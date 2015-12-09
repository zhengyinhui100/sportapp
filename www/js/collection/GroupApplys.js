/**
 * 入群申请集合
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("cl.GroupApplys",
['D.Collection','md.GroupApply'],
function(Collection,GroupApply){
	
	var GroupApplys=Collection.derive({
		model       : GroupApply
	});
	
	return GroupApplys;
});