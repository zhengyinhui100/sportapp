/**
 * 活动申请管理列表模块
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("m.activity.Applyers",
[
'm.user.UserList',
'cm.Common'
],
function(UserList,Common){
	
	var Applyers=UserList.derive({
		init                : fInit
	});
	
	function fInit(){
		var me=this;
		var oModel=me.model;
		var oApplyers=oModel.get('applyers');
		oApplyers.url='/activityApplyers/'+oModel.get('id');
		Common.getPageData(oApplyers,{refresh:true});
		me.title='活动申请列表';
		me.listName="activityApplyers";
		me.users=oApplyers;
		me.fixUserView=function(oApply,oUser,oItem){
			var nUserId=oUser.get('id');
			//活动申请管理
			if(oModel.get('editUserId')==gUid&&nUserId!=gUid){
				oItem.desc=[{
					text:'理由:'+oApply.get('applyReason')
				}];
				oItem.items.push({
					xtype:'Button',
					size:'mini',
					text:'批准',
					click:function(){
						$G.dao.ajax({
							url:'/activity/agree.do',
							data:{
								activityId:oModel.get("id"),
								userId:nUserId
							},
							success:function(result){
								oApplyers.remove(oApply);
								var oMembers=oModel.get("members");
								oMembers.add(oApply);
								$C.Tips('批准成功');
							}
						});
						return false;
					}
				});
			}
		}
		me.callSuper();
	}
	
	return Applyers;
	
});