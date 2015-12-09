/**
 * 消息列表模块抽象类
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("m.AMessageList",
[
'B.Date',
'M.AbstractModule',
'cm.Common'
],
function(Dat,AbstractModule,Common){
	
	var AMessageList=AbstractModule.derive({
		initList        : fInitList,
		getMoreData     : fGetMoreData,
		entry           : fEntry,
		cache           : fCache,
		refreshTime     : fRefreshTime
	});
	
	function fInitList(){
		var me=this;
		me.refreshTime();
		var oModel=me.model;
		var oHeader=Common.getHeader(me.title,'pdRefresh');
		me._messageTime=gUser.getSaved(me.ignoreUnreadAttr);
		me.ignoreUnread&&oHeader.items.push({
			xtype:'Button',
			theme:'dark',
			text:'忽略未读',
			tType:'adapt',
			xrole:'right',
			click:function(){
				//清空未读数
				me._messageTime=gUser.get(me.ignoreUnreadAttr);
				var nNum=0;
				oModel.each(function(i,oMod){
					nNum+=oMod.get('newMsgNum')||0;
					oMod.set('newMsgNum',0);
				});
				if(nNum===0){
					$C.Tips('没有未读消息');
				}
			}
		});
		me.add([oHeader,{
			xtype:'Panel',
			cClass:'content',
			extCls:'m-module-content',
			items:{
				xtype:'ModelList',
				extCls:'hui-mlist-padding',
				emptyTips:'暂无新的消息',
				moreBtnTxt:'更多历史消息',
				height:$G.getHeight('hasHeader'),
				itemXtype:me.listItemXtype,
				hasPullRefresh:true,
				model:oModel,
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
		var nSize=oCollection.size();
		var sCreateTime;
		var oParam={
			pageStart:0,
			messageTime:me._messageTime,
			pageSize:15
		};
		var sNow=Dat.now(true);
		var bFirst=!oCollection._hasGetList;
		oCollection._hasGetList=1;
		if(bRefresh){
			oParam.newTime=sNow;
		}else{
			!bFirst&&(oParam.pageStart=nSize);
			oParam.historyTime=sNow;
		}
		var oOptions={add:true,data:oParam};
		oOptions.success=function(){
			if(oCollection.size()==nSize){
				//第一次进入时不提示
				if(me._hasEnter){
					$C.Tips(bRefresh?'没有新的消息':'没有更多结果了');
				}
				me._hasEnter=true;
			}
		}
		if(bRefresh){
			Common.enableLoading(false);
			oOptions.beforeSet=function(){
				Common.enableLoading(true);
			}
		}
		oCollection.fetch(oOptions);
	}
	
	function fEntry(){
		//刷新未读时间
		gUser.save(this.ignoreUnreadAttr);
	}
	
	function fCache(){
		this.refreshTime();
	}
	
	function fRefreshTime(){
		this.model.each(function(i,oModel){
			oModel.set('howlong');
		});
	}
	
	
	return AMessageList;
	
});