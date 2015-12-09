/**
 * 群会话列表模块
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("m.message.ActivityMessage",
['m.AMessageList',
'm.message.ActMsgView'],
function(AMessageList,ActMsgView){
	
	var ActivityMessage=AMessageList.derive({
		title            : '活动消息',
		ignoreUnreadAttr : 'activityMsgTime',
		listItemXtype    : ActMsgView,
		init             : fInit
	});
	
	function fInit(){
		var me=this;
		me.initList();
	}
	
	return ActivityMessage;
	
});