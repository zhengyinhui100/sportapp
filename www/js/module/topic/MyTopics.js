/**
 * 我的话题模块
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("m.topic.MyTopics",
['m.APageList',
'm.topic.TopicView',
'cl.Topics'],
function(APageList,TopicView,Topics){
	
	var MyTopics=APageList.derive({
		title           : '我的话题',
		listItemXtype   : TopicView,
		init            : fInit
	});
	
	function fInit(){
		var me=this;
		me.model=gUser.get('topics');
		me.initList(function(aItems){
			var aBtns=aItems[0].items;
			aBtns.push({
				xtype:'Button',
				icon:'edit',
				theme:'dark',
				tType:'adapt',
				xrole:'right',
				click:function(){
					$M.go('m.topic.EditTopic');
				}
			})
		});
	}
	
	return MyTopics;
	
});