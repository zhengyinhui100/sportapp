/**
 * 群会话模块
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("m.message.GpConversation",
[
'B.Date',
'B.Util',
'B.String',
'M.AbstractModule',
'md.GroupMessage',
'cl.GroupMessages',
'cm.Common',
'm.message.GpMsgView'
],
function(Dat,Util,Str,AbstractModule,GroupMessage,GroupMessages,Common,GpMsgView){
	
	var GpConversation=AbstractModule.derive({
		title           : '群会话',
		extCls          : 'm-module-gray',
		init            : fInit,
		sendMsg         : fSendMsg,
		getMoreData     : fGetMoreData,
		cache           : fCache,
		exit            : fExit
	});
	
	function fInit(){
		var me=this;
		var oGroup=me.model;
		oGroup._talking=true;
		oGroup.set('newMsgNum',0);
		var nId=oGroup.get('id');
		var oConversation=me.conversation=oGroup.get('conversation');
		me.add([
			Common.getHeader(oGroup.get('name'),'home',function(){
				$M.go({modName:'m.group.GroupDetail',model:oGroup});
			}),
			{
				xtype:'Panel',
				extCls:"m-module-content",
				items:{
					xtype:'ModelList',
					extCls:'hui-mlist-padding',
					emptyTips:'',
					pullTxt:'下拉获取历史消息',
					flipTxt:'松开可拉取',
					releaseTxt:'正在拉取历史消息',
					pdComment:'上次拉取时间',
					height:$G.getHeight()-Util.em2px(6.25),
					itemXtype:GpMsgView,
					scrollPos:'bottom',
					hasPullRefresh:true,
					pulldownIsRefresh:false,
					hasMoreBtn:false,
					stayBottom:true,
					model:oConversation,
					getMore:function(){
						me.getMoreData();
					}
				}
			},{
				xtype:'Panel',
				extCls:'hui-input-zone',
				items:[{
					xtype:'Input',
					isTextarea:true,
					inputHeight:Util.em2px(2.188),
					name:'content',
					enterSubmit:function(){
						me.sendMsg();
					},
					validator:{
						name:'发送内容',
						rules:{
							required:true,
							maxlength:500
						}
					}
				},{
					xtype:'Button',
					theme:'green',
					text:'发送',
					click:function(){
						me.sendMsg();
					}
				}]
			}
		]);
	}
	
	function fSendMsg(){
		var me=this;
		var oInput=me.find('Input')[0];
		oInput.focus();
		oInput.keepFocus=true;
		if(oInput.valid()){
			var sValue=Str.encodeHTML(oInput.val());
			var oNewMsgInfo={
				userId:gUid,
				groupId:me.model.get('id'),
				createTime:Dat.now(true),
				content:sValue,
				user:gUser
			};
			var oNewMessage=new GroupMessage(oNewMsgInfo);
			oNewMessage.save();
			//添加到会话集合中
			me.conversation.add(oNewMessage);
			oInput.update({
				value:'',
				inputHeight:Util.em2px(2.188)
			});
			me.find('ModelList')[0].scrollTo('bottom');
		}
	}
	
	function fGetMoreData(){
		var me=this;
		var oCollection=me.conversation;
		var nSize=oCollection.size();
		var sCreateTime;
		var bFirst=!oCollection.lastFetchTime;
		if(nSize==0||bFirst){
			sCreateTime=Dat.now(true);
		}else{
			var oFirst=oCollection.at(0);
			sCreateTime=oFirst.get('createTime');
		}
		var oParam={
			pageStart:0,
			pageSize:15,
			groupId:me.model.get('id'),
			historyTime:sCreateTime
		};
		var oOptions={add:true,data:oParam};
		oOptions.success=function(){
			if(!bFirst&&nSize>0&&oCollection.size()==nSize){
				$C.Tips('没有更多结果了');
			}
		}
		Common.enableLoading(false);
		oOptions.beforeSet=function(){
			Common.enableLoading(true);
		}
		oCollection.fetch(oOptions);
	}
	
	function fCache(){
		var oModel=this.model;
		oModel._talking=true;
		oModel.set('newMsgNum',0);
	}
	
	function fExit(){
		this.model._talking=false;
	}
	
	return GpConversation;
	
});