/**
 * 回复消息模块，显示话题回复详情
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("m.topic.ReplyDetail",
[
'L.Json',
'M.AbstractModule',
'cm.Common',
'cl.Comments',
'md.Topic',
'm.topic.CommentView'
],
function(Json,AbstractModule,Common,Comments,Topic,CommentView){
	
	var ReplyDetail=AbstractModule.derive({
		init          : fInit
	});
	

	function fInit(){
		var me=this;
		var oModel=this.model;
		var oParam=Json.parseJson(oModel.get('param'));
		var oComments=new Comments();
		oComments.url='comment/building/';
		var oTopic=Topic.get({id:oParam.topicId,title:oModel.get('title')});
		oComments.fetch({
			data:oParam
		});
		me.add([Common.getHeader('回复详情'),
			{
				xtype:'Panel',
				extCls:'m-module-content m-padding-both-more',
				items:[{
					xtype:'RowItem',
					underline:false,
					text:'标题：'+oTopic.get('title'),
					click:function(){
						$M.go({modName:'m.topic.TopicDetail',model:oTopic});
					}
				},{
					xtype:'Set',
					extCls:'topic-reply-list',
					title:'评论',
					items:{
						xtype:'ModelList',
						itemXtype:CommentView,
						topic:oTopic,
						model:oComments
					}
				}]
			}
		]);
	}
	
	return ReplyDetail;
	
});