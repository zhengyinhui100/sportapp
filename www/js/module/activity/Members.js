/**
 * 活动成员管理列表模块
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("m.activity.Members",
[
'm.user.UserList',
'cm.Common'
],
function(UserList,Common){
	
	var Members=UserList.derive({
		init                : fInit
	});
	
	function fInit(){
		var me=this;
		var oModel=me.model;
		var oMembers=oModel.get('members');
		oMembers.url='/activityMembers/'+oModel.get('id');
		Common.getPageData(oMembers,{refresh:true});
		me.title='活动成员列表';
		me.listName='activityMembers';
		me.users=oMembers,
		me.fixUserView=function(oMember,oUser,oItem){
			var nUserId=oUser.get('id');
			//活动成员管理
			if(oModel.get('editUserId')==gUid){
				oItem.items.push({
					xtype:'Button',
					size:'mini',
					text:'移除',
					click:function(){
						$G.dao.ajax({
							url:'/activity/delMember.do',
							data:{
								activityId:oModel.get("id"),
								userId:nUserId
							},
							success:function(result){
								oMembers.remove(oMember);
								$C.Tips('移除成功');
							}
						});
						return false;
					}
				});
			}
		}
		me.callSuper();
	}
	
	return Members;
	
});