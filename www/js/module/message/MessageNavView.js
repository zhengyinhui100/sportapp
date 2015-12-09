/**
 * 消息导航视图
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */
 
define('m.message.MessageNavView',
[
'B.Date',
'V.View'
],
function(Dat,View){

	var MessageNavView=View.derive({
		init       : fInit
	});
	
	function fInit(){
		var me=this;
		var oAllMsg=me.model=$S.get('AllMsg.my');
		var oNotices=oAllMsg.get('notices');
		var oGpConList=oAllMsg.get('gpConList');
		var oConList=oAllMsg.get('conList');
		var oActMsgs=oAllMsg.get('activityMsgs');
		me.add([{
			xtype:'Field',
			title:{
				xtype:'Icon',
				name:'system',
				tType:'big',
				bgColor:'#71c7eb',
				radius:'normal'
			},
			content:{
				xtype:'RowItem',
				text:'系统通知',
				hasArrow:true,
				newsNum:'{{newNoticeNum}}'
			},
			click:function(){
				//清空未读数
				oAllMsg.set('newNoticeNum',0);
				$M.go({modName:'m.message.Notice',model:oNotices});
			}
		},{
			xtype:'Field',
			title:{
				xtype:'Icon',
				name:'user-msg',
				tType:'big',
				bgColor:'#7692dc',
				radius:'normal'
			},
			content:{
				xtype:'RowItem',
				text:'私信',
				hasArrow:true,
				newsNum:'{{newMsgNum}}'
			},
			click:function(){
				$M.go({modName:'m.message.ConversationList',model:oConList});
			}
		},{
			xtype:'Field',
			title:{
				xtype:'Icon',
				name:'group-msg',
				tType:'big',
				bgColor:'#8dd375',
				radius:'normal'
			},
			content:{
				xtype:'RowItem',
				text:'群消息',
				hasArrow:true,
				newsNum:'{{newGpMsgNum}}'
			},
			click:function(){
				$M.go({modName:'m.message.GpConList',model:oGpConList});
			}
		},{
			xtype:'Field',
			title:{
				xtype:'Icon',
				name:'activity-notice',
				tType:'big',
				bgColor:'#fe895d',
				radius:'normal'
			},
			content:{
				xtype:'RowItem',
				text:'活动消息',
				hasArrow:true,
				newsNum:'{{newActMsgNum}}'
			},
			click:function(){
				//清空未读数
				oAllMsg.set('newActMsgNum',0);
				$M.go({modName:'m.message.ActivityMessage',model:oActMsgs});
			}
		}]);
	}
	
	return MessageNavView;
	
});