/**
 * 活动申请模型
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("md.ActivityApply",
[
'D.Model',
'md.User'
],
function(Model,User){
	
	var ActivityApply=Model.derive({
		url    : '/groupApply',
		fields : {
			user:{type:User},
			id :{
				deps:['activityId','userId'],
				unsave:true,
				parseDeps:function(nAId,nUId){
					if(nAId&&nUId){
						return nAId+'-'+nUId;
					}
				}
			}
		}
	});
	
	return ActivityApply;
});