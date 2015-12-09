/**
 * 群会话列表模块
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("m.message.GpConList",
['m.AMessageList',
'm.message.GpConListItemView'],
function(AMessageList,GpConListItemView){
	
	var GpConList=AMessageList.derive({
		title            : '群消息',
	    ignoreUnread     : true,
	    ignoreUnreadAttr : 'groupMessageTime',
		listItemXtype    : GpConListItemView,
		init             : fInit
	});
	
	function fInit(){
		var me=this;
		me.initList();
	}
	
	return GpConList;
	
});