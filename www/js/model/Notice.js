/**
 * 通知模型
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("md.Notice",
[
'B.Date',
'D.Model'
],
function(Dat,Model){
	
	var Notice=Model.derive({
		url    : '/notice',
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
	
	return Notice;
});