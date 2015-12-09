/**
 * 群成员集合
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("cl.GroupMembers",
['D.Collection','md.GroupMember'],
function(Collection,GroupMember){
	
	var GroupMembers=Collection.derive({
		model       : GroupMember,
		comparator  : 'role',
		desc        : true
	});
	
	return GroupMembers;
});