/**
 * 我的活动模块
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("m.activity.MyActivities",
['m.APageList',
'm.activity.ActivityView',
'cl.Activities'],
function(APageList,ActivityView,Activities){
	
	var MyActivities=APageList.derive({
		title           : '我的活动',
		listItemXtype   : ActivityView,
		init            : fInit
	});
	
	function fInit(){
		var me=this;
		var oModel=me.model=gUser.get('activities');
		me.initList(function(aItems){
			var aBtns=aItems[0].items;
			aBtns.push({
				xtype:'Button',
				icon:'edit',
				theme:'dark',
				tType:'adapt',
				xrole:'right',
				click:function(){
					$M.go('m.activity.EditActivity');
				}
			})
		});
	}
	
	return MyActivities;
	
});