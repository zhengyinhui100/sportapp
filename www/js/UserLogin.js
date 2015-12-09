//var base64Key="0RZkCgkWjZEK0YdhoMwW2Q==";
//var keys=CryptoJS.enc.Base64.parse(base64Key);
//var encrypted = CryptoJS.AES.encrypt("123message水电费", keys, { mode:CryptoJS.mode.ECB});
//console.log(CryptoJS.enc.Base64.stringify(encrypted.ciphertext));
//
//
//var encryptedStr=CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse("123message水电费"));
//console.log(encryptedStr);
//console.log(CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(encryptedStr)));
//encryptedStr=CryptoJS.enc.Base64.parse(encryptedStr);
//console.log(encryptedStr.toString());
//var encryptedStr="n5mGZ8//EYu1BvFjT1/wyw==";
//console.log(typeof (CryptoJS.enc.Base64.parse(encryptedStr).words));
//encryptedStr=CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(encryptedStr));
//console.log(encryptedStr);
//var decrypted=CryptoJS.AES.decrypt(encryptedStr, keys, { mode: CryptoJS.mode.ECB});
//console.log(CryptoJS.enc.Utf8.stringify(decrypted));

//初始化模块
define('com.sport.UserLogin',
[
'L.Browser',
'B.Url',
'M.History'
],
function(Browser,Url,History){

	var UserLogin={
		init              : fInit,        //初始化
		initLogin         : fInitLogin    //初始化登录注册页
	}
	var _sAppType=(gIsPg?'?appType=phonegap':'');
	var _sLoginUrl=gServer+"login.do"+_sAppType;
	var _sRegUrl=gServer+"register.do"+_sAppType;
	
	function _fChangePage(sPage) {
		_fErrorTips("");
		if (sPage == 'register') {
			$("#loginDv").hide();
			$("#registerDv").show();
		} else {
			$("#loginDv").show();
			$("#registerDv").hide();
		}
	}
	
	function _fErrorTips(sMsg){
		var oDiv=$("#errorTipsDv");
		oDiv.html(sMsg);
		if(sMsg){
			oDiv.show();
		}else{
			oDiv.hide()
		}
	}
	
	function _fCheckEmail(emailId) {
		var sValue=$(emailId).val();
		sValue=sValue.replace(/^\s+/,'').replace(/\s+$/,'');
		var sMsg='';
		if (!/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i
				.test(sValue)) {
			sMsg="请输入正确的邮箱地址";
		} else {
		}
		_fErrorTips(sMsg);
		return sMsg?false:sValue;
	}
	function _fCheckPwd(pwdId) {
		var sValue=$(pwdId).val();
		sValue=sValue.replace(/^\s+/,'').replace(/\s+$/,'');
		var sMsg='';
		if (!/^.{6,20}$/.test(sValue)) {
			sMsg="请输入长度在6-20之间的密码";
		}
		_fErrorTips(sMsg);
		return sMsg?false:sValue;
	}
	function _fCheckNickname() {
		var sValue=$("#regNickname").val();
		sValue=sValue.replace(/^\s+/,'').replace(/\s+$/,'');
		var sMsg='';
		if (!sValue){
			sMsg="请输入昵称";
		}else if(sValue.length>20){
			sMsg="昵称长度不能超过20";
		}else if(/^\d+$/.test(sValue)) {
			sMsg="昵称不能只有数字";
		}
		_fErrorTips(sMsg);
		return sMsg?false:sValue;
	}
	function _fCheckConfirmPwd() {
		if ($("#confirmPwd").val() != $("#regPwd").val()) {
			_fErrorTips("请确认输入同样的密码");
		} else {
			return true;
		}
	}
	function _fEncrypt(sValue) {
		var keys = CryptoJS.enc.Base64.parse($("#keyHipt").val());
		var encrypted = CryptoJS.AES.encrypt(sValue, keys, {
			mode : CryptoJS.mode.ECB
		});
		return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
	}
	
	function _fLoading(sTxt){
		var oTips=$("#loadingTips");
		if(sTxt!=undefined){
			oTips.removeClass('hui-hidden').find('.hui-tips-txt').html(sTxt);
		}else{
			oTips.addClass('hui-hidden');
		}
	}
	
	function _fInitIndex(oResult,sEmail,sEncKey,sPwd){
		var oData=oResult.data;
		if(gIsPg){
			localStorage.setItem("email",sEmail);
			localStorage.setItem("encKey",sEncKey);
			localStorage.setItem("pwd",sPwd);
		}
		gInfo=oData;
		gUser=oData.user;
		gUid=oData.user.id;
		gEnv=oData.environment;
		gNow=parseInt(oData.now);
		Init.initIndex();
	}
	
	
	function fInit(){
		var me=this;
		//phonegap
		if(gIsPg){
			//本地登录验证
			var sEmail=localStorage.getItem('email');
			var sEncKey=localStorage.getItem('encKey');
			var sPwd=localStorage.getItem('pwd');
				
			if(sEmail&&sEncKey&&sPwd){
				//_fLoading('加载中...');
				$.ajax({
					url:_sLoginUrl,
					cache:false,
					type:"post",
					data:{
						email:sEmail,
						encKey:sEncKey,
						password:sPwd
					},
					dataType:"json",
					success:function(oResult){
						//登录成功，跳转到指定url
						if(oResult.code=="success"){
							_fInitIndex(oResult,sEmail,sEncKey,sPwd)
						}else{
							_fLoading();
							me.initLogin();
							_fErrorTips(oResult.data);
						}
					},
					error:function(XMLHttpRequest, textStatus, errorThrown){
						_fLoading();
						me.initLogin();
						_fErrorTips(textStatus);
					}
				});
			}else{
				me.initLogin();
			}
		}else{
			//web
			//获取url模块参数，hash优先级高于query中retPage
			oUrlParam=History.prototype.getCurrentState();
			var sModName=oUrlParam&&oUrlParam.modName;
			//未登录入口判断
			if(Url.getHash()==='login'){
				Url.setHash('');
			}else{
				if(sModName&&(sModName.indexOf('topic.TopicDetail')>0||sModName.indexOf('activity.ActivityDetail')>0)){
					Init.initIndex();
					return;
				}
			}
			
			me.initLogin();
		}
	}
	
	function fInitLogin(){
		var me=this;
		var sForm=[
			'<div class="hui-form login-register-form">',
				gIsPg?'':'<div class="web-tips">网页版:</div>',
				'<div id="loadingTips" class="hui-hidden hui-tips hui-tips-inline hui-tips-has-icon hui-radius-little hui-tips-black c-clear">',
					'<span class="hui-icon hui-icon-loading-mini"></span>',
					'<span class="hui-tips-txt"></span>',
				'</div>',
				'<div id="errorTipsDv"  class="hui-form-tips c-txt-error"></div>',
				'<form id="loginDv" class="login-content">',
					'<div class="hui-field">',
						'<div class="hui-field-left">',
							'<label class="hui-label c-txt-right">邮箱</label>',
						'</div>',
						'<div class="hui-field-right">',
							'<div class="hui-input hui-radius-little">',
								'<input type="email" name="email" autocomplete="off" id="email" class="hui-input-txt"/>',
							'</div>',
						'</div>',
					'</div>',
					'<div class="hui-field">',
						'<div class="hui-field-left">',
							'<label class="hui-label c-txt-right">密码</label>',
						'</div>',
						'<div class="hui-field-right">',
							'<div class="hui-input hui-radius-little">',
								'<input type="password" name="password" id="password" autocomplete="off" class="hui-input-txt"/>',
							'</div>',
						'</div>',
					'</div>',
					//css里使用em设置大小在改变默认字体时无效，这里计算px
					gIsPg?'':'<div id="autoLogin" class="auto-login hui-chkbox-green"><span class="hui-icon hui-icon-chkbox"></span>自动登录</div>',
					'<div class="hui-form-action">',
						'<a id="loginButton" class="hui-btn hui-shadow hui-inline hui-btn-',gIsPg?'blue':'green',' hui-radius-little">',
							'<span class="hui-btn-txt">登录</span>',
						'</a>',
						'<a class="hui-btn hui-inline hui-radius-little hui-btn-gray" id="toRegisterPage">',
							'<span class="hui-btn-txt">注册</span>',
						'</a>',
					'</div>',
				'</form>',
				'<form id="registerDv" class="register-content hui-field-4-words">',
					'<div class="hui-form-tips c-txt-error"></div>',
					'<div class="hui-field">',
						'<div class="hui-field-left">',
							'<label class="hui-label c-txt-right">邮箱</label>',
						'</div>',
						'<div class="hui-field-right">',
							'<div class="hui-input hui-radius-little">',
								'<input type="email" name="email" id="regEmail" autocomplete="off" class="hui-input-txt"/>',
							'</div>',
						'</div>',
					'</div>',
					'<div class="hui-field">',
						'<div class="hui-field-left">',
							'<label class="hui-label c-txt-right">昵称</label>',
						'</div>',
						'<div class="hui-field-right">',
							'<div class="hui-input hui-radius-little">',
								'<input type="text" name="nickname" id="regNickname" autocomplete="off" class="hui-input-txt"/>',
							'</div>',
						'</div>',
					'</div>',
					'<div class="hui-field">',
						'<div class="hui-field-left">',
							'<label class="hui-label c-txt-right">密码</label>',
						'</div>',
						'<div class="hui-field-right">',
							'<div class="hui-input hui-radius-little">',
								'<input type="password" name="password" id="regPwd" autocomplete="off" class="hui-input-txt"/>',
							'</div>',
						'</div>',
					'</div>',
					'<div class="hui-field">',
						'<div class="hui-field-left">',
							'<label class="hui-label c-txt-right">确认密码</label>',
						'</div>',
						'<div class="hui-field-right">',
							'<div class="hui-input hui-radius-little">',
								'<input type="password" name="confirmPwd" id="confirmPwd" autocomplete="off" class="hui-input-txt"/>',
							'</div>',
						'</div>',
					'</div>',
					'<div class="hui-form-action">',
						'<a id="registerButton" class="hui-btn hui-shadow hui-inline hui-btn-',gIsPg?'blue':'green',' hui-radius-little">',
							'<span class="hui-btn-txt">注册</span>',
						'</a>',
						'<a id="toLoginPage" class="hui-btn hui-inline hui-radius-little hui-btn-gray">',
							'<span class="hui-btn-txt">登录</span>',
						'</a>',
					'</div>',
				'</form>',
				'<input id="keyHipt" type="hidden" value="YNlygw7NnkTb/vFyyrxViA=="/>',
				gIsPg&&gEnv==='dev'?'<a href="javascript:;" onclick="location.reload();" style="position:absolute;left:0;bottom:-2em;">刷新</a>':'',
			'</div>'
		].join('');
		
		//如果不先设置font-size，等到css加载时，页面能观察到字体变化，排除css加载时序的问题，
		//具体待研究，猜测是浏览器重置默认字体需要时间导致(Android phonegap下，其它未测)
		//增加js设置默认字体后修正
		var aHtml;
		if(gIsPg){
			aHtml=[
			'<div id="loginPage" class="index-page" style="">',
				'<div class="index-page-content c-h-middle-container c-clear">',
					'<div class="c-h-middle login-register-container">',
						'<div class="c-v-middle login-register">',
							'<span class="hui-icon hui-icon-logo"></span>',
							sForm,
						'</div>',
					'</div>',
				'</div>',
			'</div>'];
		}else{
			aHtml=[
			'<div id="loginPage" class="index-page">',
				'<div class="index-page-header">',
					'<div class="header-container c-clear">',
						'<div class="logo-container c-clear">',
							'<span class="hui-icon logo-icon"></span>',
							'<div class="logo-txt">',
								'<div class="logo-title">乐加球友</div>',
								'<div class="logo-url">17lejia.com</div>',
							'</div>',
						'</div>',
						'<a href="javascript:;" class="header-lnk lnk-active">首页</a>',
						'<a href="',gServer,'safeUrl/aboutUs.do" class="header-lnk">关于我们</a>',
					'</div>',
				'</div>',
				'<div class="index-page-content c-h-middle-container c-clear">',
					'<div class="login-intro">',
						'<div class="login-intro-txt">让足球更精彩！<br>&nbsp;&nbsp;&nbsp;&nbsp;寻找球友、约战、新闻资讯、话题讨论等等，应有尽有！</div>',
						'<a id="androidDownloadLink" href="',gStaticServer+'app/sportapp-'+gAppVersion+'.apk','" hidefocus="true" class="hui-btn hui-btn-green hui-shadow hui-btn-icon-left hui-radius-little">',
							'<span class="hui-icon hui-icon-android-logo"></span>',
							'<span class="hui-btn-txt">Android版</span><span class="hui-btn-ext-txt">(',gAppSize,')</span>',
						'</a>',
						'<a href="javascript:;" hidefocus="true" class="hui-btn hui-btn-green hui-shadow hui-btn-icon-left hui-radius-little">',
							'<span class="hui-icon hui-icon-apple-logo"></span>',
							'<span class="hui-btn-txt">IOS版开发中...</span>',
						'</a>',
						'<a href="javascript:;" hidefocus="true" class="hui-btn hui-btn-green hui-shadow hui-btn-icon-left hui-radius-little">',
							'<span class="hui-icon hui-icon-win8-logo"></span>',
							'<span class="hui-btn-txt">WP版开发中...</span>',
						'</a>',
						Browser.phone()?'':'<img class="app-download-ecode" src="'+gSportAppUrl+'/img/ecode.png"/>',
					'</div>',
					'<div class="c-h-middle login-register">',
						sForm,
					'</div>',
				'</div>',
			'</div>'];
		}
		
		$('body').removeClass('init-loading').html(aHtml.join(''));
		
		var sPath=location.pathname;
		if(sPath.indexOf('register.do')>0){
			_fChangePage('register');
		}else{
			_fChangePage();
		}
		
		//微信下载提示
		if(/MicroMessenger\/([\d.]+)/.test(navigator.userAgent)){
			$('#androidDownloadLink').click(function(){
				alert('如果没有开始下载，请点击微信右上角菜单，选择在浏览器中打开，再下载');
			});
		}
		$("#autoLogin").click(function(){
			var oIcon=$(this);
			var sCls='hui-chkbox-on';
			if(oIcon.hasClass(sCls)){
				oIcon.removeClass(sCls);
			}else{
				oIcon.addClass(sCls);
			}
		});
		$('#toRegisterPage').click(function(){
			_fChangePage('register');
		});
		$('#toLoginPage').click(function(){
			_fChangePage();
		});
		var bDisable=false;
		$("#loginButton").click(function() {
			var sEmail,sPwd;
			if ((sEmail=_fCheckEmail("#email"))&&(sPwd=_fCheckPwd("#password"))) {
				var sEncKey=$("#keyHipt").val();
				sPwd=_fEncrypt(sPwd);
				_fLoading('登录中...');
				if(bDisable){
					return;
				}
				bDisable=true;
				$.ajax({
					url:_sLoginUrl,
					cache:false,
					type:"post",
					data:{
						email:sEmail,
						encKey:sEncKey,
						autoLogin:$("#autoLogin").hasClass('hui-chkbox-on')?1:0,
						password:sPwd
					},
					dataType:"json",
					success:function(oResult){
						//登录成功，跳转到指定url
						if(oResult.code=="success"){
							_fLoading('登录成功，加载中...');
							_fInitIndex(oResult,sEmail,sEncKey,sPwd)
						}else{
							bDisable=false;
							_fLoading();
							_fErrorTips(oResult.data);
						}
					},
					error:function(XMLHttpRequest, textStatus, errorThrown){
						bDisable=false;
						_fLoading();
						_fErrorTips(textStatus);
					}
				});
			}
		})
		$("#registerButton").click(function() {
			var sEmail,sPwd,sNickname;
			if ((sEmail=_fCheckEmail("#regEmail"))&&(sNickname=_fCheckNickname())
			&&(sPwd=_fCheckPwd("#regPwd")) && _fCheckConfirmPwd()) {
				var sEncKey=$("#keyHipt").val();
				sPwd=_fEncrypt(sPwd);
				_fLoading('注册中...');
				if(bDisable){
					return;
				}
				bDisable=true;
				$.ajax({
					url:_sRegUrl,
					cache:false,
					type:"post",
					data:{
						email:sEmail,
						encKey:sEncKey,
						nickname:sNickname,
						password:sPwd
					},
					dataType:"json",
					success:function(oResult){
						//登录成功，跳转到指定url
						if(oResult.code=="success"){
							_fLoading('注册成功，加载中...');
							_fInitIndex(oResult,sEmail,sEncKey,sPwd)
						}else{
							bDisable=false;
							_fLoading();
							_fErrorTips(oResult.data);
						}
					},
					error:function(XMLHttpRequest, textStatus, errorThrown){
						bDisable=false;
						_fLoading();
						_fErrorTips(textStatus);
					}
				});
			}
		})
	}
	
	if(gIsDev){
		require('handy.All',function(){
			UserLogin.init();
		});
	}else{
		UserLogin.init();
	}
	
	return UserLogin;
	
})