/**
 * 群组消息模型
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("md.AllMsg",
[
'D.Model',
'cl.Notices',
'cl.Groups',
'cl.Users',
'cl.ActivityMessages'
],
function(Model,Notices,Groups,Users,ActivityMessages){
	
	var AllMsg=Model.derive({
		url    : '/allMsgs',
		fields : {
			notices : {
				type:Notices,
				options:{
					custom:{
						dirtyTime:60*1000
					}
				}
			},
			activityMsgs:{
				type:ActivityMessages,
				options:{
					custom:{
						dirtyTime:60*1000
					}
				}
			},
			gpConList : {
				type:'cl.Groups',
				options:{
					custom:{
						url:'/gpConList',
						dirtyTime:60*1000,
	        			comparator:'lastMsgTime',
	        			desc:true
					}
				}
			},
			conList : {
				type:Users,
				options:{
					custom:{
						url:'/conversationList',
						dirtyTime:60*1000,
	        			comparator:'lastMsgTime',
	        			desc:true
					}
				}
			},
			allNewMsgNum:{
				deps :['newMsgNum','newGpMsgNum','newNoticeNum','newActMsgNum'],
				parseDeps:function(newMsgNum,newGpMsgNum,newNoticeNum,newActMsgNum){
					return (newMsgNum||0)+(newGpMsgNum||0)+(newNoticeNum||0)
					+(newActMsgNum||0);
				}
			}
		},
		init    : fInit
	});
	
	function fInit(){
		var me=this;
		//计算新群消息总数
		me.on('change:notices',function(sName,oModel,oNotices,sNoticesEvt,oNotice){
			if(sNoticesEvt==='add'){
				var nNum=me.get('newNoticeNum')||0;
				if(oNotice.get('createTime')>gUser.get('noticeTime')){
					me.set('newNoticeNum',++nNum);
				}
			}
		});
		//计算新群消息总数
		me.on('change:gpConList',function(sName,oModel,oGpConList,sGpConEvt){
			if(sGpConEvt==='add'||sGpConEvt==='change:newMsgNum'){
				//群消息列表初始化后，以群消息列表未读数为准，不过这里如果还有比列表里更旧的消息，
				//这里就无法计算了，好在目前超过9会显示9+，所有暂时不会有问题
				var nNum=oGpConList._hasGetList?0:(me.get('initNewGpMsgNum')||0);
				oGpConList.each(function(i,oModel){
					nNum+=oModel.get('newMsgNum')||0;
				});
				me.set('newGpMsgNum',nNum);
			}
		});
    	//计算新私信消息总数
		me.on('change:conList',function(sName,oModel,oConList,sSubEvt,oUser){
			if(sSubEvt==='add'||sSubEvt==='change:newMsgNum'){
				var nNum=oConList._hasGetList?0:(me.get('initNewMsgNum')||0);
				oConList.each(function(i,oModel){
					nNum+=oModel.get('newMsgNum')||0;
				});
				me.set('newMsgNum',nNum);
			}
		});
		//计算新活动消息总数
		me.on('change:activityMsgs',function(sName,oModel,oMsgs,sSubEvt,oMsg){
			if(sSubEvt==='add'){
				var nNum=me.get('newActMsgNum')||0;
				if(oMsg.get('createTime')>gUser.get('activityMsgTime')){
					me.set('newActMsgNum',++nNum);
				}
				var nType=oMsg.get('type');
				//新成员加入通知、移除成员、取消报名，清除活动详情缓存
				if(nType>51&&nType<55){
					var oAct=oMsg.get('activity');
					oAct.setDirty();
					var aid=oAct.id;
					$M.clearCache('m.activity.Applyers',aid);
					$M.clearCache('m.activity.Members',aid);
				}
				
			}
		});
	}
	
	return AllMsg;
});