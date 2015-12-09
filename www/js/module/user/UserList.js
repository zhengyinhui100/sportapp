/**
 * 用户管理列表模块
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("m.user.UserList",
['M.AbstractModule',
'm.user.UserView',
'cm.Common'],
function(AbstractModule,UserView,Common){
	
	var UserList=AbstractModule.derive({
		init         : fInit,
		useCache     : fUseCache
	});

	function fInit(){
		var me=this;
		var oUsers=me.users;
		me.add([Common.getHeader(me.title||'成员列表','pdRefresh'),{
			xtype:'Panel',
			extCls:'m-module-content',
			items:{
				xtype:'ModelList',
				itemXtype:UserView,
				hasPullRefresh:true,
				height:$G.getHeight('hasHeader'),
				model:oUsers,
				refresh:function(){
					Common.getPageData(oUsers,{refresh:true});
				},
				getMore:function(){
					Common.getPageData(oUsers);
				}
			}
		}]);
	}
	
	function fUseCache(oParams){
		//后退操作时，没有model
		return !oParams.model||this.model.listName===oParams.model.listName&&this.model.get('id')==oParams.model.get('id');
	}
	
	return UserList;
	
});