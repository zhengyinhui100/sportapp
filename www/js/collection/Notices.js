/**
 * 通知集合
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("cl.Notices",
['D.Collection','md.Notice'],
function(Collection,Notice){
	
	var Notices=Collection.derive({
		model       : Notice,
		comparator  : 'createTime',
		desc        : true,
		url         : '/notices'
	});
	
	return Notices;
});