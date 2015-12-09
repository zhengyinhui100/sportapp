/**
 * 申请加入群组模块
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("m.group.ApplyGroup",
[
'M.AbstractModule',
'cm.Common'
],
function(AbstractModule,Common){
	
	var ApplyGroup=AbstractModule.derive({
		init           : fInit,     
		cache          : fCache
	});
	
	function fInit(){
		var me=this;
		me.add([Common.getHeader('申请加入群组'),{
			xtype:'Panel',
			extCls:'m-module-content m-padding-both-more',
			items:[{
				xtype:'Input',
				name:'applyGroup',
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
				text:'申请',
				extCls:'m-action-btn',
				isInline:false,
				theme:'green',
				click:function(){
					var oInput=me.find('Input')[0];
					if(oInput.valid()){
						var sReason=oInput.val();
						$G.dao.ajax({
							url:'applyGroup.do',
							data:{
								reason:sReason,
								groupId:me.model.get('id'),
								userId:gUser.get('id')
							},
							success:function(){
								$C.Tips({text:'申请已发送',hide:function(){
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
	
	return ApplyGroup;
});