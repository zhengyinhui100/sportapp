/**
 * 关于我们模块
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("m.settings.AboutUs",
[
'M.AbstractModule',
'cm.Common'
],
function(AbstractModule,Common){
	
	var AboutUs=AbstractModule.derive({
		init           : fInit  
	});
	
	function fInit(){
		var me=this;
		me.add([Common.getHeader('关于我们'),{
			xtype:'Panel',
			cClass:"content",
			extCls:'m-module-content'
		}]);
		$G.dao.ajax({
			url:'/safeUrl/aboutUsContent.do',
			dataType:'html',
			success:function(sHtml){
				var oPanel=me.find('.content')[0];
				oPanel.set({
					content:sHtml
				});
			}
		});
	}
	
	return AboutUs;
});