/**
 * 活动成员集合
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("cl.ActivityMembers",
['D.Collection','md.ActivityMember'],
function(Collection,ActivityMember){
	
	var ActivityMembers=Collection.derive({
		model       : ActivityMember,
		comparator  : 'role',
		desc        : true
	});
	
	return ActivityMembers;
});