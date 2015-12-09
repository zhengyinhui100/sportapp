/**
 * 分页列表模块抽象类
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("m.APageList",
['M.AbstractModule',
'cm.Common'],
function(AbstractModule,Common){
	
	var APageList=AbstractModule.derive({
//		listItemXtype   : null,              //列表项视图
		init            : fInit,
		initList        : fInitList,
		getMoreData     : fGetMoreData
	});
	
	function fInit(){
		this.initList();
	}
	
	function fInitList(fFix){
		var me=this;
		var oHeader=Common.getHeader(me.title,'pdRefresh');
		var oCollection=me.model;
		var aItems=[oHeader,{
			xtype:'Panel',
			cClass:'content',
			extCls:'m-module-content',
			items:{
				xtype:'ModelList',
				extCls:'hui-mlist-padding',
				height:$G.getHeight('hasHeader'),
				itemXtype:me.listItemXtype,
				hasPullRefresh:true,
				model:oCollection,
				refresh:function(){
					me.getMoreData(true);
				},
				getMore:function(){
					me.getMoreData();
				}
			}
		}];
		fFix&&fFix(aItems);
		me.add(aItems);
	}
	
	function fGetMoreData(bRefresh){
		var me=this;
		var oCollection=me.model;
		var oOptions={add:true,data:me.searchParam};
		if(bRefresh){
			Common.enableLoading(false);
			oOptions.beforeSet=function(){
				Common.enableLoading(true);
				oCollection.reset();
			}
		}
		Common.getPageData(oCollection,{first:!me._hasEnter,refresh:bRefresh});
		me._hasEnter=true;
	}
	
	
	return APageList;
	
});