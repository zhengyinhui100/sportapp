/**
 * 附近列表模块抽象类
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("m.ANearList",
[
'L.Browser',
'M.AbstractModule',
'cm.Common'
],
function(Browser,AbstractModule,Common){
	
	var ANearList=AbstractModule.derive({
		listeners       : [{
			name:'afterShow',
			times:1,
			handler:function(){
				this.find('ModelList')[0].pullLoading(true);
			}
		}],
		initList        : fInitList,
		getMoreData     : fGetMoreData
	});
	
	function fInitList(){
		var me=this;
		var oHeader=Common.getHeader(me.title,'pdRefresh');
		//双击返回顶部
		var fDbl=function(){
			me.find('ModelList')[0].scrollTo(0,0,300);
		}
		oHeader.dblclick=fDbl;
		me.add([oHeader,{
			xtype:'Panel',
			cClass:'content',
			extCls:'m-module-content',
			items:{
				xtype:'ModelList',
				extCls:'hui-mlist-padding',
				height:$G.getHeight('hasHeader'),
				itemXtype:me.listItemXtype,
				hasPullRefresh:true,
				autoFetch:false,
				model:me.model,
				refresh:function(){
					me.getMoreData(true);
				},
				getMore:function(){
					me.getMoreData();
				}
			}
		}]);
	}
	
	function fGetMoreData(bRefresh){
		var me=this;
		var oCollection=me.model;
		var _fGet=function(){
			me.searchParam=Common.getSearchNearParam(oCollection,bRefresh?null:me.searchParam);
			var oOptions={add:true,data:me.searchParam};
			if(bRefresh){
				Common.enableLoading(false);
				oOptions.beforeSet=function(){
					Common.enableLoading(true);
					oCollection.reset();
				}
			}
			oCollection.fetch(oOptions);
		}
		if(bRefresh||!me.searchParam){
			var oModelList=me.find('ModelList')[0];
			oModelList.update({pdTxt:"正在定位"});
			gUser.getPosition(function(oPos,oError){
				oModelList.update({pdTxt:"正在加载"});
				if(oPos.latitude&&oPos.longitude){
					_fGet();
				}
			},{need:true});
		}else{
			_fGet();
		}
	}
	
	
	return ANearList;
	
});