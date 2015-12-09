/**
 * 群组消息模型
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("md.GroupMessage",
[
'B.Date',
'D.Model',
'md.User'
],
function(Dat,Model,User){
	
	var GroupMessage=Model.derive({
		url    : '/groupMessage',
		fields : {
			user  : {type:User},
			dispContent:{
				deps:['content'],
				unsave:true,
				parseDeps:function(content){
					var nType=this.get('type');
					if(nType==1){
						content="申请加入群，理由："+(content||"无")
					}else if(nType>50&&nType<60||nType==61){
						content=content||'无';
					}
					return content;
				}
			},
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
	
	return GroupMessage;
});