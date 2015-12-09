//初始化模块
(function(){

	var oWin=window;
	
	var Init=oWin.Init={
		init          : fInit,            //初始化
		processError  : fProcessError,    //处理系统错误
		logError      : fLogError,        //向服务器发送错误日志
		initConfig    : fInitConfig,      //初始配置
		configScript  : fConfigScript,    //配置脚本
		fixViewport   : fFixViewport,     //窗口发生变化时(旋转，全屏等)，修正viewport
		initViewport  : fInitViewport,    //初始化viewport，通过自动计算默认字体大小(1em)来显示应用，让设备使用最佳分辨率进行显示
		initLogin     : fInitLogin,       //添加登录脚本
		exitApp       : fExitApp,         //退出app
		initIndex     : fInitIndex        //添加首页脚本
	}
	
	
	var sHandyPath,sSportAppPath,sType,_oStyles,_oScripts,
	_sUa=navigator.userAgent,
	bIsMobile=/mobile/i.test(_sUa),
	_eHead=document.head ||document.getElementsByTagName('head')[0] ||document.documentElement;
	
	/**
	 * 错误系统处理
	 */
	function fProcessError(){
		//错误捕捉
		window.onerror = function(msg, url, line) {
			var bHasDebug=typeof $D!='undefined';
			var sContent="onError handler:\n";
			if(typeof msg==='string'){
				sContent+= msg + "\nurl: " + url + "\nline #: " + line;
			}else{
			    for( var k in msg){
			    	sContent+=k+" : "+msg[k]+'\n';
			    }
			}
			
			if(bHasDebug){
		    	$D.error(arguments);
			}else if(gEnv!=='online'){
				alert(sContent);
			}
			if(bHasDebug&&!$D.debugLog||!bHasDebug){
				Init.logError(sContent);
			}
		    var suppressErrorAlert = true;
		    return suppressErrorAlert;
		};
	}
	
	function fLogError(sContent){
		$.ajax({
			url:'/feedback/create.do',
			data:{
				content:sContent,
				type:1,
				ua:(!!window.cordova?'[phonegap] ':'')+_sUa
			}
		});
	}
	
	function fInitConfig(){
		//gEnv:运行环境标志，dev表示开发，test表示测试，online表示线上，在index.ftl或index.html里定义
		//url中指定参数优先级高于服务器端配置
		var match;
		if(match=location.href.match(/env=([a-z]+)/)){
			gEnv=match[1];
		}
		//是否是phonegap环境
		oWin.gIsPg=!!window.cordova;
		
		oWin.gIsDev=gEnv==='dev';
		//脚本配置类型
		sType='dev';
		if(!gIsDev){
			sType='online';
		}
		//对应资源的根目录
		
		var bIsDevDir=gIsDev;
		if(match=location.href.match(/isDevDir=([a-z]+)/)){
			bIsDevDir=match[1]==='true';
		}
		//TODO
		//bIsDevDir=true;
		//sType='dev';
		
		sHandyPath='static/'+gStaticVersion+'/'+(bIsDevDir?"handyDev/":"handy/");
		oWin.gHandyUrl=gStaticServer+sHandyPath;
		sSportAppPath='static/'+gStaticVersion+'/'+(bIsDevDir?"sportappDev/":"sportapp/");
		oWin.gSportAppUrl=gStaticServer+sSportAppPath;
		//是否使用压缩版
		oWin.gIsMin=!gIsDev;
		if(match=location.href.match(/isMin=([a-z]+)/)){
			gIsMin=match[1]==='true';
		}
		
		//TODO
		//gIsMin=false;
	}
	
	function fConfigScript() {
		var bIsWebkit=/webkit/i.test(_sUa);
		var sBaseLib=sHandyPath+((bIsWebkit||bIsMobile)? 'lib/zepto.js':'lib/jquery.js');
		_oStyles = {
			dev : [
					// 合并css会导致目录问题，如css中定义的路径图片加载错误
					// "??"+sHandyPath+"css/reset.css"+','+sHandyPath+"css/common.css"+','+sHandyPath+"css/icon.css"+','+
					// sHandyPath+"css/widget.css"+','+sSportAppPath+"css/main.css"+','+sSportAppPath+"css/userlogin.css"
					sHandyPath + "css/reset.css", sHandyPath + "css/common.css",
					sHandyPath + "css/icon.css", sHandyPath + "css/widget.css",
					sSportAppPath + "css/main.css",
					sSportAppPath + "css/userlogin.css"],
			online : [sHandyPath + "css/handy.css",
					sSportAppPath + "css/sportapp.css"]
		}
		_oScripts = {
			dev : {
				'login' : [
						sBaseLib,
						
						//TODO change
						sHandyPath + "lib/modernizr.js",
						sHandyPath + "js/loader/base.js",
						sHandyPath + "js/loader/Json.js",
						sHandyPath + "js/loader/Browser.js",
						sHandyPath + "js/loader/Debug.js",
						sHandyPath + "js/loader/Loader.js",
						sSportAppPath + "js/Config.js",
						
						sSportAppPath + 'lib/crypto/aes.js',
						sSportAppPath + 'lib/crypto/mode-ecb.js',
						sSportAppPath + 'lib/crypto/pad-zeropadding.js',
						sSportAppPath + 'js/UserLogin.js'
				],
				'index' : [
						sBaseLib,
						sHandyPath + "lib/modernizr.js",
						sHandyPath + "js/loader/base.js",
						sHandyPath + "js/loader/Json.js",
						sHandyPath + "js/loader/Browser.js",
						sHandyPath + "js/loader/Debug.js",
						sHandyPath + "js/loader/Loader.js",
						sSportAppPath + "js/Config.js",
						sSportAppPath + "js/Start.js"
				]
			},
			online : {
				'login' : [
						sBaseLib,
						sHandyPath + "lib/modernizr.js",
						sSportAppPath + 'lib/crypto.js',
						sHandyPath + "js/handy.js",
						sSportAppPath + 'js/UserLogin.js'
				],
				'index' : [
						sBaseLib,
						sHandyPath + "lib/modernizr.js",
						sHandyPath + "js/handy.js",
						sSportAppPath + 'js/sportapp.js'
				]
			}
		}
		
		if(bIsMobile){
			var sFastclick=sHandyPath+'lib/fastclick.js';
//			_oScripts.dev.login.unshift(sFastclick);
			_oScripts.dev.index.unshift(sFastclick);
//			_oScripts.online.login.unshift(sFastclick);
			_oScripts.online.index.unshift(sFastclick);
		}

		//tmp TODO weinre调试
		if (0&&gIsDev) {
			var sUrl = "http://my.com:8089/target/target-script-min.js#anonymous";
			_oScripts.dev.login.unshift(sUrl);
			_oScripts.dev.index.unshift(sUrl);
			//TODO  style是否必须同域？
			var aStyles = _oStyles[sType];
			for (var i = 0; 0&&i < aStyles.length; i++) {
				sUrl = aStyles[i];
				aStyles[i] = 'http://my.com:8080'
						+ sUrl.substring(sUrl.indexOf('/css/'));
			}
		}
	}
	/**
	 * 窗口发生变化时(旋转，全屏等)，修正viewport
	 */
	function fFixViewport(){
		//计算默认字体大小
		var nOrigWidth=document.body.clientWidth;
		//使用screen.width有时会不准确，比如Android上的chrome36，小米3数值是360
		//var nOrigWidth=window.screen.width;
		//屏幕宽高比
		var nScale=window.screen.width/window.screen.height;
		//是否竖屏
		var nOrient=window.orientation;
		//在chrome上模拟移动设备时，window.orientation=undefined，所以增加判断条件nScale<1
		var bPortrait=nOrient===0||nOrient===180||(nOrient===undefined&&nScale<1);
		//ios浏览器中，不管横屏还是竖屏，window.screen.width和window.screen.height都是固定的
		if(!bPortrait&&nScale<1){
			nScale=1/nScale;
		}
		//平板
		if((/ Mobile\//.test(_sUa) && /iPad/.test(_sUa))
		||(/Android/i.test(_sUa))&&!/Mobile/.test(_sUa)){
			var nActWidth=bPortrait?600:600*nScale;
			gZoom=nOrigWidth/(nOrigWidth>nActWidth?nActWidth:nOrigWidth);
		}else{
			//手机
			var nActWidth=bPortrait?360:360*nScale;
			gZoom=nOrigWidth/(nOrigWidth>nActWidth?nActWidth:nOrigWidth);
		}
		//通知zepto touch，事件边界检测
		window.fixDevicePixelRatio=gZoom;
		var nNewSize=Math.ceil(gZoom*16);
		if(gFontSize!=nNewSize){
			gFontSize=nNewSize;
//			alert(nOrient+"\n"+window.screen.width+";"+window.screen.height+"\n"+document.body.clientWidth+";"+nActWidth+";"+gFontSize);
			document.body.style.fontSize=gFontSize+"px";
		}
		//收起地址栏
		if(!gIsPg&&!navigator.standalone){
			document.body.style.minHeight=window.innerHeight+200+"px";
			//这里不延迟的话，iPod touch下刷新后不能收起
			setTimeout(function(){
				window.scrollTo(0,1);
			},0);
		}
	}
	/**
	 * 初始化viewport，通过自动计算默认字体大小(1em)来显示应用，让设备使用最佳分辨率进行显示
	 */
	function fInitViewport() {
		oWin.gZoom=1;
		oWin.gFontSize=16;
		if(bIsMobile){
			var eHead=document.head ||document.getElementsByTagName('head')[0] ||document.documentElement;
			var _fAddMeta=function(sName,sContent){
				var oMeta = document.createElement('meta');
				oMeta.setAttribute('name', sName);
				oMeta.setAttribute('content',sContent);
				eHead.appendChild(oMeta);
			}
			var sViewPort='user-scalable=no';
			//Android浏览器中添加了initial-scale、width等属性后宽度会变成viewport一般宽度344，
			//而qq手机浏览器等在没设置时宽度是viewport宽度360，所以这里以此条件(document.body.clientWidth<=450)判断要不要加viewport相关属性
			//TODO:qq浏览器中有时还是不能以最高分辨率显示
			//但是在微博和易信内嵌webview里则例外，必须设置viewport，否则页面会有横向滚动条
			if(document.body.clientWidth<=450||/(weibo|yixin)/i.test(_sUa)||/windows phone/i.test(_sUa)){
				//web中加上无法显示最高分辨率
				sViewPort+=',initial-scale=1,maximum-scale=1,minimum-scale=1,width=device-width,height=device-height,target-densitydpi=device-dpi';
			}
			_fAddMeta('viewport',sViewPort);
			//IOS不检测电话号码
			_fAddMeta('format-detection','telephone=no');
			//Android不检测邮件地址
			_fAddMeta('format-detection','email=no');
			
			//全屏支持
			if(!gIsPg){
			    var nav = window.navigator,
			        ua = nav.userAgent;
				var bIsIos=/iPhone|iPod|iPad/.test(ua);
			    if (ua.indexOf('Android') !== -1) {
			        // 56对应的是Android Browser导航栏的高度
			        //page.style.height = window.innerHeight + 56 + 'px';
					_fAddMeta('mobile-web-app-capable','yes');
			    } else if (bIsIos) {
			        // 60对应的是Safari导航栏的高度
			        //page.style.height = window.innerHeight + (isFullScreen ? 0 : 60) + 'px'
					_fAddMeta('apple-mobile-web-app-capable','yes');
					//添加到桌面图标
					var oLink=document.createElement('link');
					oLink.rel="apple-touch-icon-precomposed";
					oLink.href=gSportAppUrl+"img/logo.png";
					eHead.appendChild(oLink);
					/**
					 * <link rel="apple-touch-icon" href="touch-icon-iphone.png" />
					 * <link rel="apple-touch-icon" sizes="72x72" href="touch-icon-ipad.png" />
					 * <link rel="apple-touch-icon" sizes="114x114" href="touch-icon-iphone-retina.png" />
					 * <link rel="apple-touch-icon" sizes="144x144" href="touch-icon-ipad-retina.png" />
					 */
			    }
			    
			}
			/**
			 * 《android和iphone下的全屏实现》
			 * http://yansong.me/2013/04/22/show-full-screen-in-android-and-iphone-browser.html
			 */
			Init.fixViewport();
			window.addEventListener('orientationchange',function(){
				setTimeout(Init.fixViewport,0);
			});
		}
	}
	function _fAddScript(aScripts){
		var sUrl;
		var bNotCombine=gIsDev;
		if(bNotCombine){
			//过滤已加载
			while(sUrl=aScripts.shift()){
				//未加载
				if(!_oScripts[sUrl]){
					break;
				}
			}
		}else{
			//TODO:线上js可能会被运营商广告劫持，导致执行顺序出错（例如：联通广告是替换请求的js内容为：
			//document.write方式追加广告js文件和原本请求的文件)这里，要优化，后续用loader加载控制执行顺序
			var a=[];
			for(var i=0,len=aScripts.length;i<len;i++){
				sUrl=aScripts[i];
				if(!_oScripts[sUrl]){
					//线上环境所有脚本标记已加载，一次性加载
					_oScripts[sUrl]=1;
					a.push(sUrl);
				}
			}
			sUrl='??'+a.join(',');
		}
		if(sUrl){
			_oScripts[sUrl]=1;
			if(gIsMin){
				sUrl=sUrl.replace(/\.js/g,'.min.js');
			}
			sUrl=sUrl.indexOf('http://')>=0?sUrl:gStaticServer+sUrl;
			var eScript=document.createElement("script");
	    	// 脚本相对于页面的其余部分异步地执行(当页面继续进行解析时，脚本将被执行)
	    	eScript.src=sUrl;
	    	eScript.type="text/javascript";
			_eHead.appendChild(eScript);
			//标记已添加
			if(bNotCombine){
				eScript.onload  = eScript.onerror=eScript.onreadystatechange = function(){
					if (/loaded|complete|undefined/.test(eScript.readyState)) {
						// 保证只运行一次回调
						eScript.onload = eScript.onerror = eScript.onreadystatechange = null;
						// 移除标签
	//					_eHead.removeChild(eScript);
	//					eScript = null;
						// IE10下新加载的script会在此之后才执行，所以此处需延迟执行
						setTimeout(function(){
							_fAddScript(aScripts);
						}, 0);
					}
				};
			}
		}
	}
	function fInit(){
		var me=this;
		//非开发环境和移动设备开启错误处理，由于开启显示的错误信息不详细，pc开发环境不开启
		if(gEnv!=='dev'||bIsMobile){
			me.processError();
		}
		me.initConfig();
		me.initViewport();
		//TODO 非登录页返回，以后全部使用loader
		if(location.pathname.indexOf('safeUrl')>-1){
			return;
		}
		
		me.configScript();
		
		//添加css
		var aStyles=_oStyles[sType];
		for(var i=0;i<aStyles.length;i++){
			var eCssNode=document.createElement("link");
	    	eCssNode.rel="stylesheet";
	    	var sUrl=aStyles[i];
			if(gIsMin){
				sUrl=sUrl.replace('.css','.min.css');
			}
			sUrl=sUrl.indexOf('http://')>=0?sUrl:gStaticServer+sUrl;
	    	eCssNode.href=sUrl;
	    	//插入到皮肤css之前
	    	_eHead.appendChild(eCssNode);
		}
			
		//web版已登录直接跳转向首页
		if(typeof gUid!='undefined'){
			me.initIndex();
		}else{
			me.initLogin();
			if(gIsPg){
				document.addEventListener("backbutton",me.exitApp);
			}
		}
	}
	
	function fInitLogin(){
		_fAddScript(_oScripts[sType].login);
	}
	
	function fInitIndex(){
		_fAddScript(_oScripts[sType].index);
	}
	
	function fExitApp(){
		navigator.app.exitApp();
	}
	
	if(typeof gAppType=='string'&&gAppType==='phonegap'){
		document.addEventListener("deviceready", function(){
			Init.init();
		}, false);	
	}else{
		Init.init();
	}
	
})();