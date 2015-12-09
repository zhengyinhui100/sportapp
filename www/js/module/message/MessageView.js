/**
 * 消息视图
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("m.message.MessageView",
'V.View',
function(View){
	
	var MessageView=View.derive({
		init        : fInit
	});
	
	function fInit(){
		var me=this;
		var oModel=me.model;
		var nSenderId=oModel.get('senderId');
		var oUser=$S.get('md.User',{id:nSenderId});
		me.add({
			xtype:'Conversation',
			theme:nSenderId==gUid?'right':'left',
			extTitle:'{{displayTime}}',
			content:oModel.get('content'),
			items:[{
				xtype:'Image',
				model:oUser,
				height:'2.375em',
				width:'2.375em',
				imgSrc:'{{avatarMin}}',
				click:function(){
					$M.go({modName:'m.user.UserDetail',model:oUser});
				}
			}]
		});
	}
	
	return MessageView;
	
});