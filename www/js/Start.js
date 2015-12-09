//应用初始化
define('com.sport.Start',
[
'L.Browser',
'L.Loader',
'B.Date',
'B.Geo',
'B.Util',
'B.Template',
'B.Event',
'B.Url',
'com.sport.Config',
'M.ModuleManager',
'D.Model',
'D.Collection',
'cm.Common',
'cm.CommonDao',
'M.Navigator',
'md.User',
//因为内部有循环引用的关系，这里必须要再使用前加载好
'cl.Groups',
'cl.Activities',
'cl.Topics'
],
function(Browser,Loader,Dat,Geo,Util,Tmpl,Evt,Url,Config,ModuleManager,Model,Collection,
Common,CommonDao,Navigator,User,Groups,Activities,Topics){

	var Start={
		init            : fInit,        //初始化
		initNav         : fInitNav,     //初始化导航栏
		initModule      : fInitModule   //初始化模块
	}
	
	/**
	 * 初始化
	 * @method init
	 */
	function fInit(){
		$('body').removeClass('init-loading').html('<div id="mainFrameDv" class="s-main-frame hui-hidden"></div>');
		var ie=Browser.ie();
		if(ie<8){
			alert('对不起，不支持IE7及以下版本，请使用其它浏览器，推荐使用chrome浏览器。');
		}else if(Browser.android()<3){
			alert('对不起，系统检测到您使用的是Android'+Browser.android()+',应用暂时不支持Android3.0以下版本，请使用其它设备或者在电脑上使用网页版。');
		}
		
		//loader正在加载提示使用公共loading
		Loader.showLoading=Common.showLoading;
		
		//初始化公共dao
		var oDao=$G.dao=new CommonDao();
		Model.prototype.dao=oDao;
		Collection.prototype.dao=oDao;
		
		var sHiddenCls='hui-hidden';
		var oHtml=$('html').removeClass('phonegap-init').addClass('main')
		if(!Browser.mobile()){
			oHtml.addClass('page-bg');
		}
		$("#loginPage").addClass(sHiddenCls);
		$("#mainFrameDv").removeClass(sHiddenCls);
		//登录用户相关初始化
		if(typeof gUid!='undefined'){
			//设置服务器时间
			Dat.now(gNow);
			//获取位置信息
			var oUser=User.get(gUser,{saved:true});
			gUser=oUser;
			oUser.getPosition(true);
			//拉取新的消息
			Common.pullAllMsgs();
		}else{
			gUser;
		}
		
		//收起地址栏，后恢复高度
		if(Browser.mobile()&&!gIsPg&&!navigator.standalone){
			//uc浏览器中，不加1上面会残留一点工具栏
			document.body.style.minHeight=window.innerHeight+1+"px";
		}
		//系统屏幕高度
		var nHeight=$G.clientHeight=document.documentElement.clientHeihgt||document.body.clientHeight;
		$G.shareExt=' - 分享自乐加球友';
		//计算样式
		var eStyle=document.createElement("style");
    	eStyle.type="text/css";
    	//android下如果模块有输入框，必须在body上滚动，否则，输入框聚焦框会错乱，所以只有非Android设备在模块内滚动
    	//IE8下使用min-height和padding会影响高度，因为box-sizing的bug
    	var sStyle=
    	'.hui-mobile .m-module,.hui-mobile .m-module-content{min-height:'+nHeight+'px;}'+
    	'.hui-pc .m-module,.hui-ios .m-module-content{height:'+nHeight+'px;overflow-y:auto;overflow-x:hidden;}';
    	if(gZoom!==1){
	    	sStyle+='.hui-def-zoom,.hui-share,.m-topic-Topic .topic-content{zoom:'+gZoom+';font-size:16px;}'+
	    	'.ke-container .ke-toolbar,body .ke-menu,body .ke-colorpicker,body .ke-dialog{zoom:'+gZoom*1.3+';font-size:16px;}'+
	    	'.ke-container .ke-edit-textarea{font-size:'+gFontSize+'px;}';
    	}
    	var eHead=document.head ||document.getElementsByTagName('head')[0] ||document.documentElement;
    	eHead.appendChild(eStyle);
    	if(Browser.ie()<9){
    		eStyle.styleSheet.cssText=sStyle;
    	}else{
	    	eStyle.innerHTML=sStyle;
    	}
		$G.getHeight=function(sType){
			var nDif=0;
			if(sType==='hasFooter'){
				nDif=2.875;
			}else if(sType==='hasHeader'){
				nDif=2.75;
			}else if(sType==='hasBoth'){
				nDif=5.625;
			}
			return $G.clientHeight-Util.em2px(nDif);
		}
		
		Tmpl.registerHelper('default','distance',function(oPos){
			var oCurPos=gUser.getPosition();
			if(oPos.get){
				oPos=[oPos.get("latitude"),oPos.get("longitude")];
			}
			return Geo.distance(oPos,oCurPos,true);
		})
		Start.initNav();
		Start.initModule();
		
		if(ie<9&&(!gUser||!gUser.get('lowerIETips'))){
			new $C.Dialog({
				contentMsg:'系统检测到您使用的是IE'+ie+'，为了获得更好的用户体验，我们建议您使用IE10及以上版本，或其它浏览器，推荐使用chrome浏览器。',
				noClose:true,
				okTxt:'知道了',
				noCancel:true
			});
			if(gUser){
				gUser.set('lowerIETips',1);
				gUser.save();
			}
		}
		
		if(typeof FastClick!='undefined'){
			FastClick.attach(document.body);
		}
		
		//TODO 添加到桌面的缓存问题
		if(!gIsPg&&Browser.ios()&&(!gUid||!gUser.get('standaloneTips'))){
			//PS:不是Safari的情况？
			if(!navigator.standalone){
				new $C.Dialog({
					contentMsg:'从主屏幕打开可获得更好的体验（点击<span class="hui-icon hui-icon-action hui-alt-icon"></span>，然后选择添加至主屏幕，再从主频幕点击打开即可）',
					noCancel:true,
					width:'15.625em',
					okTxt:'我知道了'
				});
				if(gUser){
					gUser.set('standaloneTips',1);
					gUser.save();
				}
			}else if(gIsDev){
				//location.href=location.href+"?"+new Date().getTime();
			}
		}
		
		//使用cordova.InAppBrowser插件打开，阻止原来的链接跳转，不然无法返回应用内
		if(gIsPg){
			$(document).delegate('a','click',function(oEvt){
				var oLink=oEvt.currentTarget;
				var sUrl=oLink.href;
				if(Url.isUrl(sUrl)){
					var ref = window.open(sUrl, '_blank', 'location=yes');
					return false;
				}
			})
		}
	}
	/**
	 * 初始化导航栏
	 * @method initNav
	 */
	function fInitNav(){
		//底部导航栏
		var oFooter=new $C.Toolbar({
			renderTo:'#mainFrameDv',
			extCls:'main-footer-tbar',
			isFooter:true,
			cid:'mainFooterTb',
			items:{
				xtype:'Tab',
				theme:'noborder',
				hasContent:false,
				size:'mini',
				activeType:'c',
				cid:'mainFooterTab',
				itemClick:function(oItem) {
					var sModName=oItem.dataMod;
					if((sModName==="m.contact.Contact"||sModName==="m.settings.Settings")&&!Common.chkLogin()){
						return false;
					}
					$M.go({
						modName : sModName
					});
				},
				items:[{
						dataMod:'m.home.Home',
						title:{
							text:'首页',
							iconPos:'top',
							theme:'black',
							items:{
								xtype:'Icon',
								size:'normal',
								theme:null,
								name:'home'
							},
							dblclick:function(){
								Evt.trigger('m.home.Home.dblclick');
							}
						}
					},{
						dataMod:'m.discovery.Discovery',
						title:{
							text:'发现',
							theme:'black',
							iconPos:'top',
							items:{
								xtype:'Icon',
								size:'normal',
								theme:null,
								name:'eye'
							}
						}
					},{
						dataMod:'m.contact.Contact',
						title:{
							text:'联系人',
							theme:'black',
							iconPos:'top',
							items:{
								xtype:'Icon',
								size:'normal',
								theme:null,
								name:'user'
							}
						},
						selectchange:function(sEvt,bSelected){
							//选中，清除未读标记
							bSelected&&this.find('Button')[0].set('markType','');
						}
					},{
						dataMod:'m.settings.Settings',
						title:{
							text:'设置',
							iconPos:'top',
							theme:'black',
							items:{
								xtype:'Icon',
								size:'normal',
								theme:null,
								name:'gear'
							}
						}
					}
				]
			}
		});
		
		if(gIsPg){
			//在顶级模块点击返回键，弹出退出提示
			var oTips;
			document.removeEventListener("backbutton",Init.exitApp);
			document.addEventListener("backbutton", function(){
				if(!oTips&&Evt.trigger('hisoryChange')===false){
					return;
				}
				if(oFooter.getEl()[0].clientHeight){
					if(oTips){
						navigator.app.exitApp();
					}else{
						oTips=$C.Tips({
							text:'再点一次退出',
							noMask:true,
							hide:function(){
								oTips=null;
							}
						});
					}
				}else{
					//后退
					history.back();
				}
			}, false);
		}
	}
	/**
	 * 初始化模块
	 * @method initModule
	 */
	function fInitModule(){
		var entry;
		if(typeof gUid!='undefined'){
			//新注册用户先引导至设置模块,注册60秒内介绍为空
			var oUser=gUser;
			if(!oUser.get('introduce')&&Dat.howLong(oUser.get('registerTime'),false)<1000*60){
				entry={modName:"m.user.EditUser",model:oUser};
				$C.Tips({text:'您可以先完善资料',noMask:true});
			}
		}
		
		var oDefEntry={modName : "m.home.Home"};
		
		$M = new ModuleManager({
			container : '#mainFrameDv',
			navigator : new Navigator(),
			entry     : entry,
			defEntry  : oDefEntry
//			checkEntry: function(oEntry){
//				return gEnv=="dev"||oEntry.modName.indexOf('topic.TopicDetail')>0;
//			}
		});
	}
	
	if(gIsDev){
		require('handy.All',function(){
			Start.init();
		});
	}else{
		$(Start.init);
	}
	
	return Start;
});