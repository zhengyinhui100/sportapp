/**
 * 群组信息集合
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("cl.ActivityMessages",
['D.Collection','md.ActivityMessage'],
function(Collection,ActivityMessage){
	
	var ActivityMessages=Collection.derive({
		model       : ActivityMessage,
		url         : '/activityMsgs',
		comparator  : 'createTime',
		desc        : true
	});
	
	
	return ActivityMessages;
});