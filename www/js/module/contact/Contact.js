/**
 * 联系人模块，显示关注的球友
 * @author 郑银辉(zhengyinhui100@gmail.com)
 * @created 2013-12-19
 */
define("m.contact.Contact",
[
'L.Browser',
'B.Util',
'M.AbstractModule',
'cm.Common',
'm.group.GroupView',
'm.user.UserView',
'cl.Groups',
'cl.Users',
'm.message.MessageNavView',
'm.message.MessageView',
'cl.GroupApplys',
'md.AllMsg',
'cl.Messages'
],
function(Browser,Util,AbstractModule,Common,GroupView,UserView,Groups,Users,MessageNavView,MessageView,GroupApplys,AllMsg,Messages){

	var Contact=AbstractModule.derive({
		hasFooter         : true,
		cacheLevel        : 5,
		init              : fInit
	});
	
	function fInit(){
		var me=this;
		var oGroups=gUser.get('groups');
		var bNoTouch=!Browser.hasTouch();
		var nContHeight=$G.clientHeight-Util.em2px(5.75);
		me.add([{
			xtype:'Toolbar',
			title:'联系人',
			tType:'align-left',
			isHeader:true,
			items:[{
				xtype:'Icon',
				name:'logo',
				tType:'adapt',
				xrole:'left'
			},{
				xtype:'Button',
				icon:'refresh',
				cClass:'pdRefreshBtn',
				condition:bNoTouch,
				theme:'dark',
				hidden:true,
				tType:'adapt',
				xrole:'right',
				click:function(){
					var oModelList=me.find('ModelList[showed=true]')[0];
					oModelList&&oModelList.pullLoading(true);
				}
			},{
				xtype:'Button',
				icon:'plus',
				theme:'dark',
				tType:'adapt',
				xrole:'right',
				click:function(){
					$M.go('m.contact.AddContact');
				}
			}]
		},{
			xtype:'Panel',
			extCls:'m-module-content',
			items:{
				xtype:'Tab',
				cClass:'contactTab',
				height:nContHeight,
				theme:'border-bottom',
				activeType:'b',
				items:[{
					title:'消息',
					selected:true,
					content:{
						xtype:MessageNavView,
						cClass:'messages',
						extCls:'contact-messages'
					},
					Select:function(){
						bNoTouch&&me.find('Toolbar')[0].find('.pdRefreshBtn')[0].hide();
					}
				},{
					title:'群组',
					content:{
						xtype:'Panel',
						cClass:'groups'
					},
					Select:function(){
						bNoTouch&&me.find('Toolbar')[0].find('.pdRefreshBtn')[0].show();
						if(!me.groups){
							var oPanel=me.groups=me.find('.groups')[0];
							oPanel.add({
								xtype:'ModelList',
								itemXtype:GroupView,
								hasMoreBtn:false,
								model:oGroups,
								hasPullRefresh:true,
								refresh:function(){
									oGroups.fetch();
								}
							});
							me.groups=oGroups;
						}
					}
				},{
					title:'关注',
					content:{
						xtype:'Panel',
						cClass:'follows',
						isLoading:true
					},
					Select:function(){
						bNoTouch&&me.find('Toolbar')[0].find('.pdRefreshBtn')[0].show();
						if(!me.follows){
							var oFollows=me.follows=gUser.get('follows');
							Common.enableLoading(false);
							oFollows.once('sync',function(){
								Common.enableLoading(true);
								var oPanel=me.find('.follows')[0];
								oPanel.update({isLoading:false});
								oPanel.add({
									xtype:'ModelList',
									itemXtype:UserView,
									model:oFollows,
									autoFetch:false,
									hasPullRefresh:true,
									refresh:function(){
										Common.getPageData(oFollows,{refresh:true});
									},
									getMore:function(){
										Common.getPageData(oFollows);
									}
								});
							});
							Common.getPageData(oFollows);
						}
					}
				},{
					title:'粉丝',
					content:{
						xtype:'Panel',
						cClass:'fans',
						isLoading:true
					},
					Select:function(){
						bNoTouch&&me.find('Toolbar')[0].find('.pdRefreshBtn')[0].show();
						if(!me.fans){
							var oFans=me.fans=gUser.get('fans');
							Common.enableLoading(false);
							oFans.once('sync',function(){
								Common.enableLoading(true);
								var oPanel=me.find('.fans')[0];
								oPanel.update({isLoading:false});
								oPanel.add({
									xtype:'ModelList',
									itemXtype:UserView,
									model:oFans,
									autoFetch:false,
									hasPullRefresh:true,
									refresh:function(){
										Common.getPageData(oFans,{refresh:true});
									},
									getMore:function(){
										Common.getPageData(oFans);
									}
								});
							});
							Common.getPageData(oFans);
						}
					}
				}]
			}
		}]);
						
	}
	
	return Contact;
	
});