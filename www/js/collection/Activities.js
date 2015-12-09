/**
 * 群组集合
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("cl.Activities",
['D.Collection','md.Activity'],
function(Collection,Activity){
	
	var Activities=Collection.derive({
		model       : Activity,
		comparator  : 'startTime',
		desc        : true
	});
	
	return Activities;
});