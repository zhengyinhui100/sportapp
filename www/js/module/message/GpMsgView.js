/**
 * 群消息视图
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("m.message.GpMsgView",
'V.View',
function(View){
	
	var GpMsgView=View.derive({
		init      : fInit
	});
	
	function fInit(){
		var me=this;
		var oModel=me.model;
		var nGroupId=oModel.get('groupId');
		var oGroup=$S.get('md.Group',{id:nGroupId});
		var nUserId=oModel.get('userId');
		var oUser=oModel.get('user');
		var nType=oModel.get('type');
		sDisplayTime=oModel.get('displayTime');
		var oItem;
		//加群申请
		if(nType==1){
			oItem={
				xtype:'Hcard',
				radius:'little',
				model:oUser,
				title:'{{nickname}}',
				titleDesc:sDisplayTime,
				desc:[
					{text:oModel.get('dispContent'),txtOverflow:false},
					{
						icon:'clock',
						model:oModel,
						text:'{{howlong}}'
					}
				],
				items:[{
					xtype:'Button',
					size:'mini',
					xrole:'action',
					text:oModel.get('status')==2?'已通过':'同意',
					disabled:oModel.get('status')==2?true:false,
					click:function(){
						var oBtn=this;
						$G.dao.ajax({
							url:'agreeGroupApply.do',
							data:{
								messageId:oModel.get('id'),
								userId:oModel.get('userId'),
								groupId:oModel.get('groupId')
							},
							success:function(oResult){
								$C.Tips('已处理成功');
								oModel.set('status',2);
								oGroup.addMember(oUser);
								//新消息
								var oMsg=oResult.data;
								oMsg.user=oUser;
								me.parent.model.add(oMsg);
								oBtn.update({
									text:'已通过',
									disabled:true
								});
							}
						});
					}
				},{
					xtype:'Image',
					theme:'lc',
					height:'3.375em',
					width:'3.375em',
					imgSrc:'{{avatarMin}}',
					click:function(){
						$M.go({modName:'m.user.UserDetail',model:oUser});
					}
				}]
			}
		}else if(nType>50&&nType<60){
			//群通知
			oItem={
				xtype:'Hcard',
				radius:'little',
				model:oUser,
				title:'{{nickname}}',
				titleDesc:sDisplayTime,
				desc:{text:oModel.get('dispContent')},
				items:[{
					xtype:'Image',
					theme:'lc',
					height:'3.375em',
					width:'3.375em',
					imgSrc:'{{avatarMin}}',
					click:function(){
						$M.go({modName:'m.user.UserDetail',model:oUser});
					}
				}]
			}
		}else if(nType==61){
			//群活动
			oItem={
				xtype:'Hcard',
				radius:'little',
				model:oUser,
				title:'{{nickname}}',
				titleDesc:sDisplayTime,
				desc:{text:oModel.get('dispContent')},
				items:[{
					xtype:'Button',
					size:'mini',
					xrole:'action',
					text:'查看',
					click:function(){
						require('md.Activity',function(Activity){
							$M.go({modName:'m.activity.ActivityDetail',model:Activity.get({id:oModel.get('param')})})
						});
					}
				},{
					xtype:'Image',
				    theme:'lc',
					height:'3.375em',
					width:'3.375em',
					imgSrc:'{{avatarMin}}',
					click:function(){
						$M.go({modName:'m.user.UserDetail',model:oUser});
					}
				}]
			}
		}else{
			oItem={
				xtype:'Conversation',
				theme:nUserId==gUid?'right':'left',
				title:'{{user.nickname}}',
				extTitle:'{{displayTime}}',
				content:oModel.get('content'),
				items:[{
					xtype:'Image',
					model:oUser,
					height:'2.375em',
					width:'2.375em',
					imgSrc:'{{avatarMin}}',
					click:function(){
						$M.go({modName:'m.user.UserDetail',model:oUser});
					}
				}]
			}
		}
		me.add(oItem);
	}
	
	return GpMsgView;
});