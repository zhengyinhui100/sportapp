/**
 * 附近用户模块
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */
define("m.user.NearUsers",
['m.ANearList',
'm.user.UserView',
'cl.Users'],
function(ANearList,UserView,Users){
	
	var NearUsers=ANearList.derive({
		title           : '附近用户',
		listItemXtype   : UserView,
		init            : fInit
	});
	
	function fInit(){
		var me=this;
		me.model=new Users(null,{
			custom:{url:'/nearUsers'}
		});
		me.initList();
	}
	
	return NearUsers;
	
});