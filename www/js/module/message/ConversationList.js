/**
 * 会话列表模块
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("m.message.ConversationList",
['m.AMessageList',
'm.message.ConListItemView'],
function(AMessageList,ConListItemView){
	
	var ConversationList=AMessageList.derive({
		title            : '私信',
		ignoreUnread     : true,
		ignoreUnreadAttr : 'messageTime',
		listItemXtype    : ConListItemView,
		init             : fInit
	});
	
	function fInit(){
		var me=this;
		me.initList();
	}
	
	return ConversationList;
	
});