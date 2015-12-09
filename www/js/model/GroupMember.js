/**
 * 群组成员模型
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("md.GroupMember",
[
'D.Model',
'md.User'
],
function(Model,User){
	
	var GroupMember=Model.derive({
		fields : {
			id :{
				deps:['groupId','userId'],
				unsave:true,
				parseDeps:function(nGId,nUId){
					if(nGId&&nUId){
						return nGId+'-'+nUId;
					}
				}
			},
			user:{type:User}
		}
	});
	
	return GroupMember;
});