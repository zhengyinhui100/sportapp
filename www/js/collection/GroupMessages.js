/**
 * 群组信息集合
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("cl.GroupMessages",
['D.Collection','md.GroupMessage'],
function(Collection,GroupMessage){
	
	var GroupMessages=Collection.derive({
		model       : GroupMessage,
		url         : '/groupMsgs',
		comparator  : 'createTime'
	});
	
	
	return GroupMessages;
});