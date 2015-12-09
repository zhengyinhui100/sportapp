/**
 * 话题模型
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("md.Topic",
[
'L.Browser',
'B.Url',
'B.Date',
'D.Model',
'md.User',
'cl.Comments',
'P.Device'
],
function(Browser,Url,Dat,Model,User,Comments,Device){
	
	var Topic=Model.derive({
		url    : 'topic',
		fields : {
//			title:{type:'str'},
//			content:{type:'str'},
//			commentNum:{type:'num'},
//			readNum:{type:'num'},
			author:{type:User},
			comments:{
				type:Comments,
				options:{parse:true}
			},
			avatarMin:{
				deps:['avatar'],
				unsave:true,
				parseDeps:function(avatar){
					//转换相对路径
					if(avatar){
						avatar=gStaticServer+avatar;
						avatar=avatar.replace(/\.jpg$/,'.min.jpg');
						return avatar;
					}
				}
			},
			dispContent:{
				deps:['content'],
				unsave:true,
				parseDeps:function(content){
					if(content){
						//转换相对路径
						content=content.replace(/(src=[\"|\'])([^\"\']+)/g,function(match,$1,$2){
							if(!Url.isAbsUrl($2)&&$2.indexOf('data:')!=0){
								$2=gStaticServer+$2;
							}
							//TODO:ios浏览器环境检测不了
							if(Browser.mobile()&&!Device.isWifi()){
								$2=$2.replace(/\.jpg$/,'.min.jpg');
							}
							return $1+$2;
						});
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
			isOwner:{
				deps:['editUserId'],
				unsave:true,
				parseDeps:function(editUserId){
					if(gUid&&editUserId===gUid){
						return true;
					}
				}
			},
			notOwner:{
				deps:['isOwner'],
				unsave:true,
				def:true,
				parseDeps:function(isOwner){
					return !isOwner;
				}
			}
		}
	});
	
	return Topic;
});