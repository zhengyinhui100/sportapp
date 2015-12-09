/**
 * 活动申请集合
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("cl.ActivityApplys",
['D.Collection','md.ActivityApply'],
function(Collection,ActivityApply){
	
	var ActivityApplys=Collection.derive({
		model       : ActivityApply
	});
	
	return ActivityApplys;
});