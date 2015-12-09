/**
 * 反馈模型
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("md.Feedback",
[
'B.Date',
'D.Model'
],
function(Dat,Model){
	
	var Feedback=Model.derive({
		url    : '/feedback',
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
	
	return Feedback;
});