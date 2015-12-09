/**
 * 附近活动模块
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("m.activity.NearActivities",
['m.ANearList',
'm.activity.ActivityView',
'cl.Activities'],
function(ANearList,ActivityView,Activities){
	
	var NearActivities=ANearList.derive({
		title           : '附近活动',
		listItemXtype   : ActivityView,
		init            : fInit
	});
	
	function fInit(){
		var me=this;
		me.model=new Activities(null,{
			custom:{url:'/nearActivities'}
		});
		me.initList();
	}
	
	return NearActivities;
	
});