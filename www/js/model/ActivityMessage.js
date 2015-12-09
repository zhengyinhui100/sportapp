/**
 * 群组消息模型
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("md.ActivityMessage",
[
'B.Date',
'D.Model',
'md.User',
'md.Activity'
],
function(Dat,Model,User,Activity){
	
	var ActivityMessage=Model.derive({
		url    : '/activityMessage',
		fields : {
			activity:{type:Activity},
			user  : {type:User},
			displayTime:{
				deps:['createTime'],
				unsave:true,
				parseDeps:function(createTime){
					return Dat.formatDate(createTime,'MM-dd HH:mm');
				}
			},
			howlong : {
				deps : ['createTime'],
				unsave:true,
				parseDeps:function(createTime){
					return Dat.howLong(createTime,true);
				}
			}
		}
	});
	
	return ActivityMessage;
});