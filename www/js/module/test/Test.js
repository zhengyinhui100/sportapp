/**
 * 测试模块
 * @author 郑银辉(zhengyinhui100@gmail.com)
 * @created 2014-2-26
 */

define("m.test.Test",
[
'L.Browser',
'M.AbstractModule',
'cm.Common'
],
function(Browser,AbstractModule,Common){
	
	var Test=AbstractModule.derive({
		init          : fInit 
	});
	
	function fInit(){
		var me=this;
		me.add([Common.getHeader('测试','refresh',function(){
			location.reload();
		}),{
			xtype:'Panel',
			extCls:'m-module-content',
			items:[{
				xtype:'Panel',
				content:'<input type="date" name="date"/>'
			},{
				xtype:'Button',
				text:'test.html',
				click:function(){
					var url='http://wing.m.taobao.com:8081/test/test.html';
					location.href=url;
					if(Browser.hasTouch()){
						$('#testIframe').attr('src',url);
					}else{
						window.open(url,"_blank");
					}
				}
			},{
				xtype:'Button',
				text:'测试',
				click:function(){
					var url=gStaticServer+'lib/iscroll/demos/infinite/index.html';
					if(Browser.hasTouch()){
						$('#testIframe').attr('src',url);
					}else{
						window.open(url,"_blank");
					}
				}
			},{
				xtype:'Panel',
				height:'100%',
				content:'<iframe id="testIframe" src="" style="width:100%;height:100%;"></iframe>'
			}]
		}]);
	}
	
	return Test;
	
});