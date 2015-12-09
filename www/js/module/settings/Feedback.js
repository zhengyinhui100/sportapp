/**
 * 反馈意见模块
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("m.settings.Feedback",
[
'M.AbstractModule',
'cm.Common',
'md.Feedback'
],
function(AbstractModule,Common,Fb){
	
	var Feedback=AbstractModule.derive({
		init           : fInit,     
		cache          : fCache
	});
	
	function fInit(){
		var me=this;
		me.add([Common.getHeader('反馈意见'),{
			xtype:'Panel',
			extCls:'m-module-content m-padding-both-more',
			items:[{
				xtype:'Input',
				isTextarea:true,
				placeholder:'请输入您的意见',
				validator:{
					name:'反馈意见',
					rules:{
						required:true,
						maxlength:1000
					}
				}
			},{
				xtype:'Button',
				text:'提交',
				extCls:'m-action-btn',
				isInline:false,
				theme:'green',
				click:function(){
					var oInput=me.find('Input')[0];
					if(oInput.valid()){
						var sContent=oInput.val();
						var oFb=Fb.get();
						oFb.save({
							content:sContent,
							ua:(gIsPg?'[phonegap] ':'')+navigator.userAgent,
							userId:gUser.get('id')
						},{
							success:function(){
								$C.Tips({text:'提交成功，非常感谢您的反馈！',hide:function(){
									$M.back();
								}});
								return false;
							}
						});
					}
				}
			}]
		}])
	}
	
	function fCache(oParams){
		var me=this;
		me.model=oParams.model;
		//清空申请理由
		me.find('Input')[0].val('');
	}
	
	return Feedback;
});