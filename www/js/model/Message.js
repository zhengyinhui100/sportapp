/**
 * 群组消息模型
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("md.Message",
[
'B.Date',
'D.Model'
],
function(Dat,Model){
	var Message=Model.derive({
		url    : '/message',
		fields : {
			displayTime:{
				deps:['createTime'],
				unsave:true,
				parseDeps:function(createTime){
					return Dat.formatDate(createTime,'MM-dd HH:mm');
				}
			}
		}
	});
	
	return Message;
});