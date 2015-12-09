/**
 * 群组详情模块
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("m.group.GroupDetail",
[
'M.AbstractModule',
'cm.Common'
],
function(AbstractModule,Common){
	
	var GroupDetail=AbstractModule.derive({
		extCls         : 'm-module-gray',
		entry          : fEntry,
		init           : fInit,        
		gotoManage     : fGotoManage   
	});
	
	function fEntry(){
		var oModel=this.model;
		oModel.fetchIf({url:'/groupDetail/'+oModel.id+'/read.do'});
	}

	function fInit(){
		var me=this;
		var oModel=me.model;
		var aBtns=[{
			xtype:'Button',
			isInline:false,
			text:'{{groupBtnTxt}}',
			theme:'{{groupBtnTheme}}',
			hidden:'{{fetching}}',
			click:function(){
				var sTxt=oModel.get('groupBtnTxt');
				if(sTxt=='退出群组'){
					$C.Dialog.confirm('确定要退出"'+oModel.get('name')+'"吗?',function(b){
						if(b){
							var nGroupId=oModel.get("id");
							$G.dao.ajax({
								url:'/groupMember/delete.do',
								data:{
									self:true,
									groupId:nGroupId,
									userId:gUid
								},
								success:function(result){
									oModel.removeMember(gUser);
									$C.Tips({text:'退出成功'});
								}
							});
						}
					});
				}else if(sTxt=='申请加入'){
					$M.go({modName:'m.group.ApplyGroup',model:oModel});
				}else if(sTxt=='管理群组'){
					me.gotoManage();
				}
			}
		},{
			xtype:'Button',
			isInline:false,
			text:'进入群聊',
			theme:'green',
			hidden:'{{hideConvBtn}}',
			click:function(){
				$M.go({modName:'m.message.GpConversation',model:oModel});
			}
		}];
		//群主
		if(oModel.get('isOwner')){
			me.isOwner=true;
			aBtns.push({
				xtype:'Button',
				isInline:false,
				theme:'white',
				text:'解散群组',
				click:function(){
					var sName='“'+oModel.get('name')+'”';
					$C.Dialog.confirm('确定要解散'+sName+'吗?',function(bResult){
						if(bResult){
							oModel.destroy({success:function(){
								new $C.Tips({
									text:'已经解散'+sName,
									hide:function(){
										$M.back();
									}
								});
							}});
						}
					})
				}
			});
		}
		var oHeader=Common.getHeader('{{name}}');
		if(me.isOwner){
			oHeader.items.push({
				icon:'edit',
				tType:'adapt',
				theme:'dark',
				xrole:'right',
				click:function(){
					$M.go({modName:'m.group.EditGroup',model:oModel});
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
						title:'名称',
						content:'{{name}}'
					},{
						xtype:'Field',
						name:'owner',
						title:'群主',
						content:{
							text:'{{ownerName}}',
							hasArrow:true,
							underline:true
						},
						click:function(){
							$M.go({modName:'m.user.UserDetail',model:oModel.get('owner')});
						}
					},{
						xtype:'Field',
						name:'members',
						title:'群成员',
						content:{
							text:'{{memberNumTxt}}',
							hasArrow:true,
							underline:false
						},
						click:function(){
							me.gotoManage();
						}
					}]
				},{
					xtype:'Set',
					theme:'simple',
					items:[{
						xtype:'Field',
						title:'群活动',
						content:{
							text:'{{activityNum}}',
							underline:false,
							hasArrow:true
						},
						click:function(){
							require('m.activity.ActivityView',function(ActivityView){
								var oActs=oModel.get('activities');
								$M.go({
									title:'群活动',
									modName:'m.APageList',
									model:oActs,
									listItemXtype:ActivityView
								});
							})
						}
					}]
				},{
					xtype:'Set',
					theme:'simple',
					items:[{
						xtype:'Field',
						title:'群号码',
						content:'{{id}}'
					},{
						xtype:'Field',
						title:'距离',
						content:'{{distance}}'
					},{
						xtype:'Field',
						title:'创建时间',
						content:{
							underline:false,
							text:'{{createTime}}'
						}
					}]
				},{
					xtype:'Set',
					theme:'simple',
					items:[{
						xtype:'Field',
						title:'水平',
						content:'{{levelText}}'
					},{
						xtype:"Field",
						title:'群介绍',
						content:{
							underline:false,
							text:'{{introduce}}'
						}
					}]
				}]
			},{
				xtype:'Panel',
				name:'btns',
				extCls:'m-actions',
				items:aBtns
			}]
		}]);
	}
	
	function fGotoManage(){
		var me=this;
		var oModel=me.model;
		var oMembers=oModel.get('members');
		if(!oMembers.url){
			oMembers.url='/groupMembers/'+oModel.get('id');
		}
		$M.go({
			modName:'m.user.UserList',
			model:oModel,
			users:oMembers,
			listName:'groupMembers',
			fixUserView:function(oMember,oUser,oItem){
				var nUserId=oUser.get('id');
				if(gUid==oModel.get('createUserId')&&nUserId!=gUid){
					oItem.items.push({
						xtype:'Button',
						extCls:'right-btn',
						size:'mini',
						text:'移除',
						click:function(){
							$C.Dialog.confirm('确定移除“'+oUser.get('nickname')+'”吗？',function(bResult){
								bResult&&$G.dao.ajax({
									url:'/groupMember/delete.do',
									data:{
										groupId:oModel.get("id"),
										userId:nUserId
									},
									success:function(result){
										oModel.removeMember(oUser);
										$C.Tips('移出成功');
									}
								});
							})
							return false;
						}
					})
				}
			}
		});
	}
	
	return GroupDetail;
	
});