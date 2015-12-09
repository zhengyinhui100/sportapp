/**
 * 群组申请模型
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("md.GroupApply",
[
'D.Model',
'md.User'
],
function(Model,User){
	
	var GroupApply=Model.derive({
		url    : '/groupApply',
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
			applyer:{type:User}
		}
	});
	
	return GroupApply;
});