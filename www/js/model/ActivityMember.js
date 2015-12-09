/**
 * 活动成员模型
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("md.ActivityMember",
[
'D.Model',
'md.User'
],
function(Model,User){
	
	var ActivityMember=Model.derive({
		fields : {
			id :{
				deps:['activityId','userId'],
				unsave:true,
				parseDeps:function(nAId,nUId){
					if(nAId&&nUId){
						return nAId+'-'+nUId;
					}
				}
			},
			user:{type:User}
		}
	});
	
	return ActivityMember;
});