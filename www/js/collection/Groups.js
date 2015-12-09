/**
 * 群组集合
 * @author 郑银辉(zhengyinhui100@gmail.com)
 * @created 2014-03-18
 */
define("cl.Groups",
[
'D.Collection',
'md.Group'
],
function(Collection,Group){
	
	var Groups=Collection.derive({
		model       : Group,
		url         : '/myGroups'
	});
	
	return Groups;
});