/**
 * 系统通知视图
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("m.message.NoticeView",
[
'L.Json',
'B.Object',
'md.Topic',
'md.Group',
'md.Activity',
'V.View'
],
function(Json,Obj,Topic,Group,Activity,View){
	
	var NoticeView=View.derive({
		init      : fInit      //初始化配置
	});
	
	function fInit(){
		var me=this;
		var oModel=me.model;
		var nType=oModel.get('type');
		var oItem={
			xtype:'Hcard',
			title:'通知：'+oModel.get('title'),
			hasImg:false,
			extCls:'hui-list-item',
			titleDesc:'{{displayTime}}',
			desc:[{
				text:oModel.get('content')
			}]
		}
		//新的话题消息
		if(nType==21){
			Obj.extend(oItem,{
				title:'评论有新的回复：',
				desc:[{
					text:'标题：'+oModel.get('title')
				},{
					text:'回复：'+oModel.get('content')
				}],
				click:function(){
					$M.go({modName:'m.topic.ReplyDetail',model:oModel});
				}
			})
		}else if(nType==22){
			Obj.extend(oItem,{
				title:'话题有新的回复：',
				desc:[{
					text:'标题：'+oModel.get('title')
				},{
					text:'回复：'+oModel.get('content')
				}],
				click:function(){
					var oParam=Json.parseJson(oModel.get('param'));
				    var oTopic=Topic.get({id:oParam.topicId});
					$M.go({modName:'m.topic.TopicDetail',model:oTopic});
				}
			})
		}else if(nType==31){
			var oParam=Json.parseJson(oModel.get('param'));
		    var oGroup=Group.get({id:oParam.groupId});
		    Obj.extend(oItem,{
				title:'群组：'+oParam.groupName,
				desc:[{
					text:'你已被管理员移出群组'
				}],
				click:function(){
					$M.go({modName:'m.group.GroupDetail',model:oGroup});
				}
		    })
		}else if(nType==41){
			var oParam=Json.parseJson(oModel.get('param'));
		    var oActivity=Activity.get({id:oParam.activityId});
		    Obj.extend(oItem,{
				title:'活动：'+oParam.activityTitle,
				desc:[{
					text:'你已被管理员移出活动'
				}],
				click:function(){
					$M.go({modName:'m.activity.ActivityDetail',model:oActivity});
				}
		    })
		}
		me.add(oItem);
	}
	
	return NoticeView;
});