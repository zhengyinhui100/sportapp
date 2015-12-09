/**
 * 附近群组模块
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("m.group.NearGroups",
['m.ANearList',
'm.group.GroupView',
'cl.Groups'],
function(ANearList,GroupView,Groups){
	
	var NearGroups=ANearList.derive({
		title           : '附近群组',
		listItemXtype   : GroupView,
		init            : fInit
	});
	
	function fInit(){
		var me=this;
		me.model=new Groups(null,{
			custom:{url:'/nearGroups'}
		});
		me.initList();
	}
	
	return NearGroups;
	
});