/**
 * 首页模块，显示推送的内容
 * @author 郑银辉(zhengyinhui100@gmail.com)
 * @created 2014-2-25
 */
define("m.home.Home",
[
'L.Browser',
'B.Util',
'B.Event',
'M.AbstractModule',
'cl.Topics',
'cm.Common',
'm.topic.TopicView'
],
function(Browser,Util,Evt,AbstractModule,Topics,Common,TopicView){
	
	var Home=AbstractModule.derive({
		hasFooter     : true,
		cacheLevel    : 10,
		init          : fInit
	});

	function fInit(){
		var me=this;
		//国际新闻
		var oInterTopics=new Topics();
		oInterTopics.url="/interNews";
		Common.getPageData(oInterTopics);
		var aBtns=[{
			xtype:'Icon',
			name:'logo',
			tType:'adapt',
			xrole:'left'
		}];
		
		if(!Browser.hasTouch()){
			aBtns.push({
				xtype:'Button',
				icon:'refresh',
				theme:'dark',
				tType:'adapt',
				xrole:'right',
				click:function(){
					this.parents().find('ModelList[showed=true]')[0].pullLoading(true);
				}
			});
		}
		
		aBtns.push({
			xtype:'Button',
			icon:'edit',
			theme:'dark',
			tType:'adapt',
			xrole:'right',
			click:function(){
				if(!Common.chkLogin()){
					return;
				}
				var oDialog=new $C.Dialog({
					width:'15.625em',
					noAction:true,
					clickHide:true,
					items:{
						xtype:'Panel',
						xrole:'dialog-content',
						items:[{
							xtype:'Button',
							theme:'green',
							text:'活动',
							isInline:false,
							click:function(){
								$M.go('m.activity.EditActivity');
							}
						},{
							xtype:'Button',
							text:'话题',
							theme:'green',
							isInline:false,
							click:function(){
								$M.go('m.topic.EditTopic');
							}
						}]
					}
				})
			}
		});
		var nContHeight=$G.clientHeight-Util.em2px(5.75);
		me.add([{
			xtype:'Toolbar',
			title:'首页',
			tType:'align-left',
			isHeader:true,
			items:aBtns
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
					title:'国际足球',
					selected:true,
					content:{
						xtype:'ModelList',
						extCls:'home-content has-img',
						itemXtype:TopicView,
						model:oInterTopics,
						hasPullRefresh:true,
						refresh:function(){
							Common.getPageData(oInterTopics,{refresh:true});
						},
						getMore:function(){
							Common.getPageData(oInterTopics);
						}
					}
				},{
					title:'国内足球',
					content:{
						xtype:'Panel',
						extCls:'home-content has-img',
						cClass:'innerNews',
						isLoading:true
					},
					Select:function(){
						if(!me.innerNews){
							var oInnerNews=me.innerNews=new Topics(null,{custom:{url:'/innerNews'}});
							Common.enableLoading(false);
							oInnerNews.once('sync',function(){
								Common.enableLoading(true);
								var oPanel=me.find('.innerNews')[0];
								oPanel.update({isLoading:false});
								oPanel.add({
									xtype:'ModelList',
									itemXtype:TopicView,
									model:oInnerNews,
									autoFetch:false,
									hasPullRefresh:true,
									refresh:function(){
										Common.getPageData(oInnerNews,{refresh:true});
									},
									getMore:function(){
										Common.getPageData(oInnerNews);
									}
								});
							});
							Common.getPageData(oInnerNews);
						}
					}
				},{
					title:'话题',
					content:{
						xtype:'Panel',
						extCls:'home-content',
						cClass:'topics',
						isLoading:true
					},
					Select:function(){
						if(!me.topics){
							var oTopics=me.topics=new Topics(null,{custom:{url:'/newTopics'}});
							$S.push('newTopics',oTopics);
							Common.enableLoading(false);
							oTopics.once('sync',function(){
								Common.enableLoading(true);
								var oPanel=me.find('.topics')[0];
								oPanel.update({isLoading:false});
								oPanel.add({
									xtype:'ModelList',
									itemXtype:TopicView,
									model:oTopics,
									hasPullRefresh:true,
									autoFetch:false,
									refresh:function(){
										Common.getPageData(oTopics,{refresh:true});
									},
									getMore:function(){
										Common.getPageData(oTopics);
									}
								});
							});
							Common.getPageData(oTopics);
						}
					}
				}]
			}
		}]);
		Evt.on('m.home.Home.dblclick',function(){
			me.find('.contactTab')[0].getSelectedItem().find('ModelList')[0].scrollTo(0);
		});
	}
	
	return Home;
	
});