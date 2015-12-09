/**
 * 系统通知模块
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("m.message.Notice",
['m.AMessageList',
'm.message.NoticeView'],
function(AMessageList,NoticeView){
	
	var Notice=AMessageList.derive({
		title            : '系统通知',
		ignoreUnreadAttr : 'noticeTime',
		listItemXtype    : NoticeView,
		init             : fInit
	});
	
	function fInit(){
		var me=this;
		me.initList();
	}
	
	return Notice;
	
});