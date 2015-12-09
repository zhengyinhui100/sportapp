/**
 * 用户详情模块
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("m.user.UserDetail",
[
'M.AbstractModule',
'cm.Common'
],
function(AbstractModule,Common){
	
	var UserDetail=AbstractModule.derive({
		extCls         : 'm-module-gray',
		listeners      : [{
			target     : function(){
				return this.model;
			},
			name : 'sync',
			handler : function(sEvt,oModel){
				var me=this;
				var sRelation=oModel.get('relationship');
				var bFollowed=sRelation=='关注'||sRelation=='好友';
				var oBtn=me.find('.followBtn')[0];
				oBtn&&oBtn.update({hidden:false,text:bFollowed?'取消关注':'关注'});
			}
		}],
		init           : fInit,   
		entry          : fEntry
	});
	
	function fEntry(){
		var oModel=this.model;
		oModel.fetchIf({url:'/userDetail/'+oModel.id+'/read.do'});
	}
	
	function fInit(){
		var me=this;
		var oModel=me.model;
		var aBtns=[];
		var bIsSelf=gUid==oModel.get("id");
		//不是自己
		if(!bIsSelf){
			var sRelation=oModel.get('relationship');
			var bFollowed=sRelation=='关注'||sRelation=='好友';
			aBtns.push({
				xtype:'Button',
				cClass:'followBtn',
				theme:'white',
				isInline:false,
				text:bFollowed?'取消关注':'关注',
				hidden:oModel.fetching,
				click:function(){
					var me=this;
					var bCancel=me.get('text')!='关注';
					$G.dao.ajax({
						url:'/relation/'+(bCancel?'unFollow':'follow')+'.do?userId='+gUid+'&followUserId='+oModel.get("id"),
						success:function(result){
							oModel.set('fanNum',oModel.get('fanNum')+(bCancel?-1:1));
							oModel.set('isFollow',bCancel?0:1);
							var oData=result.data;
							me.update({text:bCancel?'关注':'取消关注'});
							$C.Tips(oData);
							//更新关注列表
							var oMyFollows=gUser.get('follows');
							if(oMyFollows){
								oMyFollows[bCancel?'remove':'add'](oModel);
							}
						}
					});
				}
			})
			aBtns.push({
				xtype:'Button',
				theme:'green',
				isInline:false,
				text:'私信',
				click:function(){
					$M.go({modName:'m.message.Conversation',model:me.model});
				}
			});
		}
		
		var oHeader=Common.getHeader('{{nickname}}');
		if(bIsSelf){
			oHeader.items.push({
				icon:'edit',
				tType:'adapt',
				theme:'dark',
				xrole:'right',
				click:function(){
					$M.go({modName:'m.user.EditUser',model:oModel});
				}
			});
		}
		me.add([oHeader,{
			xtype:'Panel',
			extCls:"m-module-content m-padding-ns",
			items:[{
				xtype:'Form',
				extCls:'hui-field-4-words',
				defItem:{
					labelColor:'gray'
				},
				items:[{
					xtype:'Set',
					theme:'simple',
					items:[{
						xtype:'Field',
						title:'头像',
						content:{
							underline:false,
							hasArrow:true,
							height:'5em',
							items:[{
								xtype:'Image',
								style:{
									position:'absolute',
									zInzex:1
								},
								height:'3.375em',
								width:'3.375em',
								imgSrc:'{{avatarMin}}'
							}]
						},
						click:function(){
							new $C.DisplayImage({
								height:$G.getHeight(),
								imgSrc:oModel.get('avatarMin'),
								origSrc:oModel.get('avatarOrig')
							})
						}
					}]
				},{
					xtype:'Set',
					theme:'simple',
					items:[{
						xtype:'Field',
						title:'昵称',
						content:'{{nickname}}'
					},{
						xtype:'Field',
						title:'距离',
						content:'{{distance}}'
					},{
						xtype:'Field',
						title:'上次登录',
						content:{
							underline:false,
							text:'{{loginTime}}'
						}
					}]
				},{
					xtype:'Set',
					theme:'simple',
					items:[{
						xtype:'Field',
						title:'活动',
						content:{
							text:'{{activityNum}}',
							underline:true,
							hasArrow:true
						},
						click:function(){
							require('m.activity.ActivityView',function(ActivityView){
								$M.go({
									title:'活动',
									modName:'m.APageList',
									model:oModel.get('activities'),
									listItemXtype:ActivityView
								});
							})
						}
					},{
						xtype:'Field',
						title:'群组',
						content:{
							text:'{{groupNum}}',
							underline:true,
							hasArrow:true
						},
						click:function(){
							require('m.group.GroupView',function(GroupView){
								$M.go({
									title:'群组',
									modName:'m.APageList',
									model:oModel.get('groups'),
									listItemXtype:GroupView
								});
							})
						}
					},{
						xtype:'Field',
						title:'话题',
						content:{
							text:'{{topicNum}}',
							underline:false,
							hasArrow:true
						},
						click:function(){
							require('m.topic.TopicView',function(TopicView){
								$M.go({
									title:'话题',
									modName:'m.APageList',
									model:oModel.get('topics'),
									listItemXtype:TopicView
								});
							})
						}
					}]
				},{
					xtype:'Set',
					theme:'simple',
					items:[{
						xtype:'Field',
						title:'关系',
						content:'{{relationship}}'
					},{
						xtype:'Field',
						title:'关注',
						content:{
							text:'{{followNum}}',
							underline:true,
							hasArrow:true
						},
						click:function(){
							require('m.user.UserView',function(UserView){
								$M.go({
									title:'关注',
									modName:'m.APageList',
									model:oModel.get('follows'),
									listItemXtype:UserView
								});
							})
						}
					},{
						xtype:'Field',
						title:'粉丝',
						content:{
							underline:false,
							hasArrow:true,
							text:'{{fanNum}}'
						},
						click:function(){
							require('m.user.UserView',function(UserView){
								$M.go({
									title:'粉丝',
									modName:'m.APageList',
									model:oModel.get('fans'),
									listItemXtype:UserView
								});
							})
						}
					}]
				},{
					xtype:'Set',
					theme:'simple',
					items:[{
						xtype:'Field',
						title:'注册号',
						content:oModel.get('id')
					},{
						xtype:'Field',
						title:'注册时间',
						content:{
							text:'{{dispRegTime}}'
						}
					},{
						xtype:'Field',
						title:'注册邮箱',
						content:{
							underline:false,
							text:"{{email}}"
						}
					}]
				},{
					xtype:'Set',
						theme:'simple',
						items:[{
						xtype:'Field',
						title:'主队',
						content:"{{favoriteTeam}}"
					},{
						xtype:'Field',
						title:'球龄',
						content:"{{playYear}}"
					},{
						xtype:'Field',
						title:'水平',
						content:'{{levelText}}'
					},{
						xtype:'Field',
						title:'个人介绍',
						content:{
							underline:false,
							text:'{{introduce}}'
						}
					}]
				}]
			},{
				xtype:'Panel',
				extCls:'m-actions',
				items:aBtns
			}]
		}]);
	}
	
	return UserDetail;
	
});