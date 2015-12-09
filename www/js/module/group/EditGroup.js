/**
 * 新建群组模块
 * @author 郑银辉(zhengyinhui100@gmail.com)
 * @created 2013-02-27
 */

define("m.group.EditGroup",
[
'B.Object',
'M.AbstractModule',
'md.Group',
'cm.Common'],
function(Obj,AbstractModule,Group,Common){
	
	var EditGroup=AbstractModule.derive({
		extCls         : 'm-module-gray',
		init           : fInit,   
		getFormData    : fGetFormData,
		save           : fSave,            //保存
		exit           : fExit
	});
	/**
	 * 
	 */
	function fInit(){
		var me=this,oModel;
		if(!me.model){
			me.isCreate=true;
			var oUser=gUser;
			oModel=me.model=Group.get({createUserId:oUser.get("id")});
			oModel.set(oUser.getPosition());
			//获取位置信息
			oUser.getPosition(function(oPos){
				oModel.set(oPos);
			});
		}else{
		    oModel=me.model;
		}
		me.add([Common.getHeader(oModel.get('name')||'新建群组','check',function(){
				me.save();
			}),{
			xtype:'Panel',
			extCls:'m-module-content m-padding-ns',
			items:{
				xtype:'Form',
				cClass:'createGroupForm',
				extCls:'hui-field-3-words',
				items:[{
					xtype:'Set',
					theme:'simple',
					items:{
						xtype:'Field',
						title:'头像',
						clickable:true,
						content:{
							underline:false,
							hasArrow:true,
							height:'5em',
							items:[{
								xtype:'ImgUpload',
								cropWinH:$G.getHeight(),
								transparent:true,
								compressOptions:{
									maxWidth:1024,
									maxHeight:1024,
									success:function(oData){
										me.find('Image')[0].set("imgSrc",oData.base64);
									}
								}
							},{
								xtype:'Image',
								style:{
									position:'absolute',
									zInzex:1
								},
								height:'3.375em',
								width:'3.375em',
								imgSrc:'{{avatarMin}}',
								click:function(){
									var avatar=this.get('imgSrc'),avatarOrig;
									//正在修改头像，但没保存
									if(avatar.indexOf("data:image")>=0){
										avatarOrig=avatar;
									}else{
										avatar=oModel.get('avatarMin');
										avatarOrig=oModel.get('avatarOrig');
									}
									new $C.DisplayImage({
										height:$G.getHeight(),
										imgSrc:avatar,
										origSrc:avatarOrig
									})
								}
							}]
						}
					}
				},{
					xtype:'Set',
					theme:'simple',
					items:[{
						xtype:'Field',
						title:'名称',
						items:{
							xtype:'Input',
							name:'name',
							value:oModel.get('name'),
							validator:{
								name:'名称',
								rules:{
									required:true,
									maxlength:100
								}
							}
						}
					}]
				},{
					xtype:'Set',
					theme:'simple',
					items:[{
						xtype:'Field',
						title:'水平',
						items:{
							xtype:'Select',
							name:'level',
							value:oModel.get('level'),
							options:[{
								text:'业余菜鸟',
								value:'1'
							},{
								text:'业余普通',
								value:'2'
							},{
								text:'业余高手',
								value:'3'
							},{
								text:'业余顶尖',
								value:'4'
							},{
								text:'职业级',
								value:'5'
							}],
							validator:{
								name:'个人水平',
								rules:{
									required:true
								},
								messages:{
									required:'请选择水平选项'
								}
							}
						}
					},{
						xtype:"Field",
						title:'群介绍',
						items:{
							xtype:'Input',
							name:'introduce',
							value:oModel.get('introduce'),
							isTextarea:true,
							validator:{
								name:'描述',
								rules:{
									required:true,
									maxlength:500
								}
							}
						}
					}]
				},{
					xtype:'Set',
					theme:'simple',
					items:{
						xtype:'RowItem',
						text:'刷新位置',
						underline:false,
						click:function(){
							var oTips=$C.Tips({
								text:'正在刷新位置...',
								type:'loading'
							});
							gUser.getPosition(function(oPos,oError){
								oTips.hide();
								if(!oError){
									oModel.set(oPos);
									$C.Tips('刷新成功');
								}
							},{forceRefresh:true});
						}
					}
				}]
			}
		}]);
	}
	
	function fGetFormData(){
		var oForm=this.findEl('form');
		var oAttrs=Obj.fromArray(oForm.serializeArray());
		if(oAttrs.fileContent===''){
			delete oAttrs.fileContent;
		}
		//zepto的结果中包含未定义name属性的input，形如："":value;
		delete oAttrs[''];
		return oAttrs;
	}
	/**
	 * 保存
	 * @method save
	 */
	function fSave(){
		var me=this;
		var oForm=me.getEl().find('form');
		var oFormCmp=me.find('.createGroupForm')[0];
		if(oFormCmp.valid()){
			var oModel=me.model;
			var oAttrs=me.getFormData();
			var oOptions={
				success:function(oMod,result){
					if(me.isCreate){
						//删除编辑模块记录
						$M.removeState();
						me.cleanCache();
						//使进入详情页时fetchIf可以发出请求
						oModel.setDirty();
						$M.go({modName:'m.group.GroupDetail',model:oModel,referer:me.referer});
					}else{
						$M.back();
					}
					new $C.Tips(me.isCreate?'新建成功':'修改成功');
					if(me.isCreate){
						var oGroups=gUser.get('groups');
						oGroups.add(oModel);
					}
					return false;
				},
				noChange:function(){
					$C.Tips('没有修改');
				}
			}
			if(oAttrs.fileContent){
				oOptions.extAttrs={
					avatar:oModel.get('avatar')
				}
			}
			oModel.save(oAttrs,oOptions);
		}
	}
	
	function fExit(){
		var me=this;
		var oModel=me.model;
		var oAttrs=me.getFormData();
		if(!oModel.saving&&oModel.changedAttrs({diff:oAttrs})){
			new $C.Dialog({
				contentMsg:'群资料已经修改，退出前要保存吗？',
				noIgnore:false,
				activeBtn:2,
				ignoreCall:function(){
					me.cleanCache();
					$M.back(true);
				},
				okTxt:'保存',
				okCall:function(){
					me.save(true);
				}
			});
			return false;
		}
		me.find('ImgUpload')[0].cleanContent();
	}
	
	return EditGroup;
	
});