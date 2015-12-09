/**
 * 个人资料模块，显示个人资料及设置
 * @author 郑银辉(zhengyinhui100@gmail.com)
 * @created 2013-12-19
 */

define("m.user.EditUser",
[
'B.Object',
'M.AbstractModule',
'md.User',
'cm.Common'
],
function(Obj,AbstractModule,User,Common){
	
	var EditUser=AbstractModule.derive({
		hasFooter            : false,
		extCls               : 'm-module-gray',
		init                 : fInit,         
		getFormData          : fGetFormData,
		save                 : fSave,            //保存
		exit                 : fExit
	});

	function fInit(){
		var me=this;
		var oUser=this.model;
		me.add([Common.getHeader('用户资料','check',function(){
				me.save();
			}),{
			xtype:'Panel',
			extCls:'m-module-content m-padding-ns',
			items:[{
					xtype:'Form',
					extCls:'hui-field-4-words',
					cClass:'settingsForm',
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
									transparent:true,
									cropWinH:$G.getHeight(),
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
											avatar=oUser.get('avatarMin');
											avatarOrig=oUser.get('avatarOrig');
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
							title:'昵称',
							items:{
								xtype:'Input',
								name:'nickname',
								value:'{{nickname}}',
								validator:{
									rules:{
										required:true,
										maxlength:50
									},
									name:'昵称'
								}
							}
						}]
					},{
						xtype:'Set',
						theme:'simple',
						items:[{
							xtype:'Field',
							title:'主队',
							items:{
								xtype:'Input',
								name:'favoriteTeam',
								placeholder:'逗号相隔，如曼联，皇马',
								value:"{{favoriteTeam}}",
								validator:{
									rules:{
										required:true,
										maxlength:100
									},
									name:'主队'
								}
							}
						},{
							xtype:'Field',
							title:'球龄',
							items:{
								xtype:'Input',
								name:'playYear',
								placeholder:'踢球年数，如10',
								value:"{{playYear}}",
								validator:{
									rules:{
										required:true,
										digits:true,
										max:100
									},
									name:'球龄'
								}
							}
						},{
							xtype:'Field',
							title:'水平',
							items:{
								xtype:'Select',
								name:'playLevel',
								value:"{{playLevel}}",
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
									rules:{
										required:true
									},
									messages:{
										required:'请选择水平选项'
									}
								}
							}
						},{
							xtype:'Field',
							title:'介绍',
							items:{
								xtype:'Input',
								name:'introduce',
								value:"{{introduce}}",
								isTextarea:true,
								validator:{
									name:'个人介绍',
									rules:{
										maxlength:500
									}
								}
							}
						}]
					}]
				}
			]
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
		var oUser=me.model;
		var oFormCmp=me.find('.settingsForm')[0];
		if(oFormCmp.valid()){
			var oAttrs=me.getFormData();
			var oOptions={
				success:function(oMod,result){
					$C.Tips({text:'保存成功',hide:function(){
						$M.back();
					}});
				},
				noChange:function(){
					$C.Tips('没有修改');
				}
			}
			if(oAttrs.fileContent){
				//传入旧值方便删除
				oOptions.extAttrs={
					avatar:oUser.get('avatar')
				}
			}
			oUser.save(oAttrs,oOptions);
		}
	}
	
	function fExit(){
		var me=this;
		var oUser=me.model;
		var oAttrs=me.getFormData();
		if(!oUser.saving&&oUser.changedAttrs({diff:oAttrs})){
			new $C.Dialog({
				contentMsg:'你的个人资料已经修改，退出前要保存吗？',
				noIgnore:false,
				activeBtn:2,
				ignoreCall:function(){
					me.cleanCache();
					$M.back(true);
				},
				okTxt:'保存',
				okCall:function(){
					me.save();
				}
			});
			return false;
		}
		me.find('ImgUpload')[0].cleanContent();
	}
	
	return EditUser;
	
});