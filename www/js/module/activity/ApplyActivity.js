/**
 * 申请参加活动模块
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("m.activity.ApplyActivity",
[
'M.AbstractModule',
'cm.Common'
],
function(AbstractModule,Common){
	
	var ApplyActivity=AbstractModule.derive({
		init           : fInit,     
		cache          : fCache
	});
	
	function fInit(){
		var me=this;
		me.add([Common.getHeader('申请参加活动'),{
			xtype:'Panel',
			extCls:'m-module-content m-padding-both-more',
			items:[{
				xtype:'Input',
				isTextarea:true,
				placeholder:'请输入申请理由',
				validator:{
					name:'申请理由',
					rules:{
						maxlength:100
					}
				}
			},{
				xtype:'Button',
				extCls:'m-action-btn',
				text:'申请',
				isInline:false,
				theme:'green',
				click:function(){
					var oModel=me.model;
					var oInput=me.find('Input')[0];
					if(oInput.valid()){
						var sReason=oInput.val();
						$G.dao.ajax({
							url:'/activity/apply.do',
							data:{
								reason:sReason,
								activityId:oModel.get('id'),
								userId:gUid
							},
							success:function(){
								$C.Tips({text:'申请已发送',hide:function(){
									$M.back();
								}});
								oModel.set('hasApplyed',true);
								oModel.set('applyerNum',oModel.get('applyerNum')+1);
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
	
	return ApplyActivity;
});