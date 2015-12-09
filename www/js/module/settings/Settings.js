/**
 * 设置模块，显示个人资料及设置
 * @author 郑银辉(zhengyinhui100@gmail.com)
 * @created 2013-12-19
 */

define("m.settings.Settings",
[
'L.Browser',
'M.AbstractModule',
'md.User'
],
function(Browser,AbstractModule,User){
	
	var Settings=AbstractModule.derive({
		hasFooter            : true,
		extCls               : 'm-module-gray',
		cacheLevel           : 5,
		init                 : fInit,         
		logout               : fLogout           //退出登录
	});

	function fInit(){
		var me=this;
		var oUser=this.model=gUser;
		me.add([{
			xtype:'Toolbar',
			isHeader:true,
			title:'设置',
			tType:'align-left',
			items:{
				xtype:'Icon',
				name:'logo',
				tType:'adapt',
				xrole:'left'
			}
		},{
			xtype:'Panel',
			extCls:'m-module-content m-padding-ns',
			items:[{
				xtype:'Set',
				theme:'simple',
				items:[{
					xtype:'Field',
					title:{
						xtype:'Icon',
						name:'user-info',
						tType:'big',
						bgColor:'#fcaa1c',
						radius:'normal'
					},
					content:{
						xtype:'RowItem',
						hasArrow:true,
						text:'我的资料'
					},
					click:function(){
						$M.go({modName:'m.user.UserDetail',model:oUser});
					}
				},{
					xtype:'Field',
					title:{
						xtype:'Icon',
						name:'user-activity',
						tType:'big',
						bgColor:'#ef73b8',
						radius:'normal'
					},
					content:{
						xtype:'RowItem',
						hasArrow:true,
						text:'我的活动'
					},
					click:function(){
						$M.go({modName:'m.activity.MyActivities'});
					}
				},{
					xtype:'Field',
					title:{
						xtype:'Icon',
						name:'user-topic',
						tType:'big',
						bgColor:'#b37cce',
						radius:'normal'
					},
					content:{
						xtype:'RowItem',
						text:'我的话题',
						hasArrow:true,
						underline:false
					},
					click:function(){
						$M.go({modName:'m.topic.MyTopics'});
					}
				}]
			},{
				xtype:'Set',
				theme:'simple',
				items:[{
					xtype:'Field',
					title:'版本',
					content:{
						underline:gIsPg,
					    text:(gIsDev?'开发版-':gEnv==='test'?'测试版-':'')+gAppVersion
					}
				},{
					xtype:'RowItem',
					text:'检查更新',
					hidden:!gIsPg,
					click:function(){
						$G.dao.ajax({
							url:'/safeUrl/chkVersion.do',
							success:function(oResult){
								var oData=oResult.data;
								var sVersion=oData.appVersion;
								if(sVersion>gAppVersion){
									new $C.Dialog({
										contentTitle:'发现新版本：'+sVersion,
										contentMsg:oData.appIntroduce,
										width:'15.625em',
										noClose:true,
										activeBtn:2,
										okTxt:'现在升级',
										cancelTxt:'暂不升级',
										okCall:function(){
											window.open(gStaticServer+'app/sportapp-+'+sVersion+'.apk', "_system");
											return false;
										}
									});
									//navigator.app.loadUrl(url,{ openExternal:true }); 
								}else{
									$C.Tips('当前已是最新版本');
								}
								return false;
							}
						});
					}
				}]
			},{
				xtype:'Set',
				theme:'simple',
				items:[{
					xtype:'RowItem',
					text:'关于我们',
					click:function(){
						$M.go({modName:'m.settings.AboutUs'});
					}
				},{
					xtype:'RowItem',
					text:'反馈意见',
					underline:false,
					click:function(){
						$M.go({modName:'m.settings.Feedback'});
					}
				}]
			},{
				xtype:'Set',
				theme:'simple',
				items:[{
					xtype:'RowItem',
					text:'测试',
					hidden:!gIsDev,
					click:function(){
						$M.go('m.test.Test');
					}
				},{
					xtype:'RowItem',
					text:'下载app',
					hidden:!Browser.android()||gIsPg,
					click:function(){
						var oIframe = document.createElement("iframe");   
						oIframe.src = gStaticServer+"/test.apk";   
						oIframe.style.display = "none";
						document.body.appendChild(oIframe);   
					}
				},{
					xtype:'RowItem',
					text:'刷新位置',
					click:function(){
						var oTips=$C.Tips({
							text:'正在刷新位置...',
							type:'loading'
						})
						gUser.getPosition(function(oPos,oError){
							oTips.hide();
							if(!oError){
								$C.Tips('刷新成功');
							}
						},{forceRefresh:true});
					}
				},{
					xtype:'RowItem',
					text:'刷新应用',
					click:function(){
						location.reload();
					}
				},{
					xtype:'RowItem',
					text:'退出登录',
					underline:false,
					click:function(){
						me.logout();
					}
				}]
			}]
		}]);
	}
	/**
	 * 退出登录
	 */
	function fLogout(){
		new $C.Dialog({
			activeBtn:1,
			width:'15.625em',
			contentMsg:'确定要退出吗?',
			okCall:function(){
				$G.dao.ajax({
					url:'/logout.do',
					beforeSucc:function(result){
						if(gIsPg){
							localStorage.removeItem("email");
							localStorage.removeItem("encKey");
							localStorage.removeItem("pwd");
						}
						location.hash='';
						if(location.search){
							location.search='';
						}else{
							location.reload();
						}
						return false;
					}
				});
			}
		});
	}
	
	return Settings;
	
});