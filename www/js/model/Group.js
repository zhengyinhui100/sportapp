/**
 * 群组模型
 * @author 郑银辉(zhengyinhui100@gmail.com)
 * @created 2014-03-18
 */

define("md.Group",
[
'B.Geo',
'B.Date',
'D.Model',
'md.User',
'cl.GroupMembers',
'md.GroupMessage',
'cl.GroupMessages'
],
function(Geo,Dat,Model,User,GroupMembers,GroupMessage,GroupMessages){
	
	var Group=Model.derive({
		url    : '/group',
		fields : {
			avatar:'',
//			introduce:{type:'str'},
//			name:{type:'str'},
//			level:{type:'num'},
			owner :  {type:User},
			members : {type:GroupMembers},
			gpMessage:{type:GroupMessage},
			conversation:{type:GroupMessages},
			activities:{type:'cl.Activities'},
			ownerName : {
				deps : ['owner'],
				unsave:true,
				parseDeps:function(owner){
					return owner&&owner.get('nickname');
				}
			},
			isOwner:{
				deps : ['createUserId'],
				unsave:true,
				parseDeps:function(createUserId){
					return createUserId==gUid;
				}
			},
			distance : {
				deps : ['latitude','longitude'],
				unsave:true,
				parseDeps:function(){
					return Geo.distance(this,gUser,true);
				}
			},
			memberNumTxt:{
				deps : ['memberNum','memberLimit'],
				unsave:true,
				parseDeps:function(memberNum,memberLimit){
					return memberNum+'/'+memberLimit;
				}
			},
			levelText : {
				deps :['level'],
				unsave:true,
				parseDeps:function(level){
					if(level){
						return {
							1:'业余菜鸟',
							2:'业余普通',
							3:'业余高手',
							4:'业余顶尖',
							5:'职业级'
						}[level];
					}
				}
			},
			avatarOrig:{
				deps:['avatar'],
				unsave:true,
				parseDeps:function(avatar){
					if(avatar){
						avatar= gStaticServer+avatar;
					}else{
						avatar= gSportAppUrl+'img/group.jpg';
					}
					return avatar;
				}
			},
			avatarMin:{
				deps:['avatarOrig'],
				unsave:true,
				parseDeps:function(avatar){
					return avatar.replace(/\.([^\.]+)$/,'.min.$1');
				}
			},
			lastMsg : {
				deps : ['gpMessage'],
				unsave:true,
				parseDeps:function(oMsg){
					if(oMsg){
						var oUser=oMsg.get('user');
						var nType=oMsg.get('type');
						return '['+oUser.get('distance')+']&nbsp;'+oUser.get('nickname')+
						(nType==1||nType==52?'':':&nbsp;')+oMsg.get('dispContent');
					}
				}
			},
			lastMsgTime : {
				deps : ['gpMessage'],
				unsave:true,
				parseDeps:function(oMsg){
					return oMsg&&oMsg.get('createTime');
				}
			},
			lastMsgDispTime : {
				deps : ['gpMessage'],
				unsave:true,
				parseDeps:function(oMsg){
					return oMsg&&oMsg.get('displayTime');
				}
			},
			//隐藏群聊按钮
			hideConvBtn:{
				deps:['hasJoined'],
				unsave:true,
				parseDeps:function(hasJoined){
					return !hasJoined;
				}
			},
			groupBtnTxt:{
				deps:['hasJoined','isOwner'],
				unsave:true,
				parseDeps:function(hasJoined,isOwner){
					if(isOwner){
						return '管理群组';
					}
					return hasJoined?'退出群组':'申请加入';
				}
			},
			groupBtnTheme:{
				deps:['groupBtnTxt'],
				unsave:true,
				parseDeps:function(groupBtnTxt){
					return groupBtnTxt=='退出群组'?'white':'green';
				}
			}
		},
		init         : fInit,
		addMember    : fAddMember,
		removeMember : fRemoveMember
	});
	
	function fInit(){
		var me=this;
		me.once('change:id',function(sEvt,oModel,sId){
			var oActs=oModel.get('activities');
			oActs.id='groupActs'+sId;
			oActs.url='/groupActs/'+sId;
		});
		me.on('change:conversation',function(sEvt,oGroup,oCon,sConEvt,oGpMsg){
			//这里要延迟设置，因为可能同时有其他属性在设置，这样的花，这里设置后会被外层未执行的set所覆盖
			setTimeout(function(){
				if(sConEvt==='add'){
					var conversation=me.get('conversation');
					var bIsNew=oGpMsg.get('createTime')>gUser.getSaved('groupMessageTime');
					var nSize;
					if(conversation&&(nSize=conversation.size())){
						me.set('gpMessage',conversation.at(nSize-1));
						//不是正在聊天，未读数加1
						if(!me._talking&&oGpMsg.get('senderId')!=gUid&&bIsNew){
							var nNewMsgNum=me.get('newMsgNum')||0;
							me.set('newMsgNum',++nNewMsgNum);
						}
					}
					//后续拉取的群消息需要监听，同步数据
					if(bIsNew){
						var nType=oGpMsg.get('type');
						//加入、移出群组通知，同步群成员数据
						if(nType==52||nType==53){
							var oUser=oGpMsg.get('user');
							var bAdd=nType==52;
							me[bAdd?'addMember':'removeMember'](oUser,true);
						}
					}
				}
			},0);
		});
	}
	
	function fAddMember(oUser,bHasSetNum){
		var me=this;
		var nUserId=oUser.get('id');
		var oGroupMember={
			userId:nUserId,
			groupId:me.get('id'),
		    user:oUser,
		    joinTime:Dat.now()
		}
		me.get('members').add(oGroupMember);
		if(nUserId==gUid){
			me.set('hasJoined',true);
		}
		//群消息里会有group的memberNum信息，这里不用再设置
		if(!bHasSetNum){
			me.set('memberNum',me.get('memberNum')+1);
		}
		//自己加入群组，同步我的群组列表
		if(nUserId==gUid){
			var oMyGroups=gUser.get('groups');
			oMyGroups&&oMyGroups.add(me);
		}
	}
	
	function fRemoveMember(oUser,bHasSetNum){
		var me=this;
		var nUserId=oUser.get('id');
		var oGroupMember={
			userId:nUserId,
			groupId:me.get('id')
		}
		me.get('members').remove(oGroupMember);
		if(nUserId==gUid){
			me.set('hasJoined',false);
		}
		if(!bHasSetNum){
			me.set('memberNum',me.get('memberNum')-1);
		}
		//自己被移除群组，同步我的群组列表
		if(nUserId==gUid){
			var oMyGroups=gUser.get('groups');
			oMyGroups&&oMyGroups.remove(me);
		}
	}
	
	return Group;
});