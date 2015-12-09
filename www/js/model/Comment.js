/**
 * 评论模型
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("md.Comment",
[
'B.Object',
'B.Date',
'D.Model',
'md.User'
],
function(Obj,Dat,Model,User){
	
	var Comment=Model.derive();
	Obj.extend(Comment.prototype,{
		url    : '/comment',
		fields : {
			content:{type:'str'},
			author:{type:User},
			parentComment:{type:Comment},
			displayTime:{
				deps:['createTime'],
				unsave:true,
				parseDeps:function(createTime){
					return Dat.formatDate(createTime,'MM-dd HH:mm');
				}
			}
		}
	});
	
	return Comment;
});