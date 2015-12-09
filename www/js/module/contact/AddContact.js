/**
 * 添加联系人模块
 * @author 郑银辉(zhengyinhui100@gmail.com)
 * @created 2013-02-27
 */

define("m.contact.AddContact",
[
'B.Validator',
'M.AbstractModule',
'md.User',
'md.Group',
'cm.Common'
],
function(Validator,AbstractModule,User,Group,Common){
	
	var AddContact=AbstractModule.derive({
		init            : fInit
	});
	
	function fInit(){
		var me=this;
		me.add([Common.getHeader('添加联系人'),{
			xtype:'Panel',
			extCls:'m-module-content m-padding-both',
			items:[{
				xtype:'Set',
				title:'查找用户',
				items:{
					xtype:'Input',
					placeholder:'注册号/昵称/邮箱',
					items:{
						xtype:'Button',
						radius:'big',
						items:{
							xtype:"Icon",
							name:'search'
						},
						click:function(){
							var oInput=this.parent;
							var sValue=oInput.val();
							var oParam;
							if(sValue){
								if(Validator.digits(sValue)){
									oParam={id:sValue};
								}else if(Validator.email(sValue)){
									oParam={email:sValue};
								}else{
									oParam={nickname:sValue};
								}
								$G.dao.ajax({
									url:'/user/search.do',
									data:oParam,
									success:function(oResult){
										var oData=oResult.data;
										if(!oData){
											$C.Tips({text:'搜索不到用户',theme:'error'});
										}else{
											var oUser=User.get(oData);
											$M.go({modName:'m.user.UserDetail',model:oUser});
										}
									}
								});
							}else{
								$C.Tips({text:'请输入注册号/昵称/邮箱',theme:'error'});
							}
						}
					}
				}
			},{
				xtype:'Set',
				title:'查找群组',
				items:{
					xtype:'Input',
					placeholder:'群号码/名称',
					items:{
						xtype:'Button',
						radius:'big',
						items:{
							xtype:"Icon",
							name:'search'
						},
						click:function(){
							var oInput=this.parent;
							var sValue=oInput.val();
							if(sValue){
								if(Validator.digits(sValue)){
									oParam={id:sValue};
								}else{
									oParam={name:sValue};
								}
								$G.dao.ajax({
									url:'/group/search.do',
									data:oParam,
									success:function(oResult){
										var oData=oResult.data;
										if(!oData){
											$C.Tips({text:'搜索不到群组',theme:'error'});
										}else{
											//这里需要手动检测是不是已存在对应的User对象
											var oGroup=Group.get(oData);
											$M.go({modName:'m.group.GroupDetail',model:oGroup});
										}
									}
								});
							}else{
								$C.Tips({text:'请输入群号码/名称',theme:'error'});
							}
						}
					}
				}
			},{
				xtype:'Set',
				title:'新建',
				items:[{
					xtype:'Button',
					isInline:false,
					text:'新建群组',
					click:function(){
						$M.go("m.group.EditGroup");
					}
				}]
			}]
		}]);
	}
	
	return AddContact;
	
});