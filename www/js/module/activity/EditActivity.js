/**
 * 发布活动模块
 * @author 郑银辉(zhengyinhui100@gmail.com)
 * @created 2014-2-25
 */

define("m.activity.EditActivity",
[
'B.Object',
'M.AbstractModule',
'md.Activity',
'cm.Common'
],
function(Obj,AbstractModule,Activity,Common){
	
	var EditActivity=AbstractModule.derive({
		extCls           : 'm-module-gray',
		init             : fInit,   
		getGroupIds      : fGetGroupIds,
		getFormData      : fGetFormData,
		save             : fSave,
		exit             : fExit
	});

	function fInit(){
		var me=this;
		var oModel;
		if(!me.model){
			me.isCreate=true;
			var oUser=gUser;
			oModel=me.model=Activity.get({editUserId:gUid});
			oModel.set(oUser.getPosition());
			//获取位置信息
			oUser.getPosition(function(oPos){
				oModel.set(oPos);
			},{need:true});
		}else{
		    oModel=me.model;
		}
		var aGroupOptions=[];
		function _fAdd(oGroups,bCheck){
			oGroups.each(function(i,oGroup){
				var oItem={
					text:oGroup.get('name'),
					value:oGroup.get('id')
				};
				if(!bCheck||!Obj.contains(aGroupOptions,oItem)){
					aGroupOptions.push(oItem);
				}
			});
		}
		_fAdd(gUser.get('groups'));
		var aGroups=oModel.get('groups');
		_fAdd(aGroups,true);
		
		aGroupOptions.push({
			text:'其它群组',
			value:'-1'
		});
		
		//参加群组列表
		var oGroupItem={
			xtype:'Panel',
			items:[{
				xtype:'Select',
				name:'groupId',
				text:'选中可发送群通知',
				options:aGroupOptions,
				beforeChange:function(sEvt,sValue){
					var aGroupIds=me.getGroupIds();
					if(Obj.contains(aGroupIds,sValue)){
						$C.Tips({text:'选中的群组重复了',theme:'error'});
						return false;
					}
				},
				change:function(sEvt,sValue){
					var oSel=this;
					if(sValue==='-1'){
						Common.searchGroup(function(oGroup){
							if(oGroup){
								oSel.set('text',oGroup.get('name'));
								oSel.set('value',oGroup.get('id'));
							}else{
								oSel.clearValue();
							}
						},function(){
							oSel.clearValue();
						},{
							renderTo:me.getEl(),
							hide:function(){
								me._allowExist=false;
							}
						});
						me._allowExist=true;
					}
				}
			},{
				xtype:'Button',
				radius:'big',
				extCls:'del-btn',
				icon:'delete',
				click:function(){
					var oPanel=this.parent;
					oPanel.parent.remove(oPanel);
				}
			}]
		}
		var aGroupItems=[];
		aGroups.each(function(i,oGroup){
			var oItem=Obj.clone(oGroupItem);
			oItem.items[0].value=oGroup.get('id');
			aGroupItems.push(oItem);
		})
		if(aGroupItems.length==0){
			aGroupItems.push(oGroupItem);
		}
		
		aGroupItems.push({
			xtype:'Button',
			text:'添加群组',
			gradient:true,
			click:function(){
				var oParent=this.parent;
				oParent.add(oGroupItem,oParent.find().length-2);
			}
		});
		
		me.add([Common.getHeader(me.isCreate?'发布活动':'修改活动','check',function(){
			me.save();
		}),{
			xtype:'Panel',
			extCls:'m-module-content m-padding-ns',
			items:{
				xtype:'Form',
				cClass:'activityForm',
				extCls:'hui-field-4-words',
				items:[{
					xtype:'Set',
					theme:'simple',
					items:{
						xtype:'Field',
						title:'活动图片',
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
						title:'标题',
						items:{
							xtype:'Input',
							name:'title',
							value:oModel.get('title'),
							validator:{
								rules:{
									required:true,
									maxlength:100
								},
								name:'标题'
							}
						}
					},{
						xtype:'Field',
						title:'地点',
						items:{
							xtype:'Input',
							name:'locationName',
							value:oModel.get('locationName'),
							validator:{
								rules:{
									required:true
								},
								name:'地点'
							}
						}
					},{
						xtype:'Field',
						title:'开始时间',
						items:{
							xtype:'DateSelect',
							name:'startTime',
							value:oModel.get('startTime'),
							change:function(){
								var oEndTimeSel=me.find('[name=endTime]')[0];
								var oStartTime=this.val(true);
								//结束时间不能早于开始时间，自动设置结束时间
								var oEndTime=oEndTimeSel.val(true);
								if(!oEndTime||oEndTime.getTime()<oStartTime.getTime()){
									//默认活动时间两小时
									oStartTime.setHours(oStartTime.getHours()+2);
									oEndTimeSel.val(oStartTime);
								}
							},
							validator:{
								rules:{
									required:true,
									custom:function(){
										var oStartTimeSel=me.find('[name=startTime]')[0];
										var oEndTimeSel=me.find('[name=endTime]')[0];
										var oStartTime=oStartTimeSel.val(true);
										//结束时间须比开始时间晚
										if(oEndTimeSel.val(true).getTime()<=oStartTime.getTime()){
											return false;
										}
										return true;
									}
								},
								messages:{
									custom:'结束时间须比开始时间晚'
								},
								name:'开始时间'
							}
						}
					},{
						xtype:'Field',
						title:'结束时间',
						items:{
							xtype:'DateSelect',
							name:'endTime',
							value:oModel.get('endTime'),
							confirm:function(){
								var oStartTimeSel=me.find('[name=startTime]')[0];
								var oEndTimeSel=me.find('[name=endTime]')[0];
								var oStartTime=oStartTimeSel.val(true);
								//结束时间须比开始时间晚
								if(oEndTimeSel.val(true).getTime()<=oStartTime.getTime()){
									$C.Tips({
										text:'结束时间须比开始时间晚',
										theme:'error'
									});
									return false;
								}
							},
							validator:{
								rules:{
									required:true
								},
								name:'结束时间'
							}
						}
					}]
				},{
					xtype:'Set',
					theme:'simple',
					items:[{
						xtype:'Field',
						title:'参加规则',
						items:{
							xtype:'Select',
							name:'purviewRule',
							value:oModel.get('purviewRule')||0,
							options:[{
								text:'所有人可直接参加',
								value:0
							},{
								text:'所有人都需申请',
								value:1
							},{
								text:'除指定群组外需申请',
								value:2
							},{
								text:'只有指定群组能参加',
								value:3
							}]
						}
					},{
						xtype:'Field',
						title:'参加群组',
						extCls:'add-group',
						items:aGroupItems
					},{
						xtype:'Field',
						title:'人数',
						items:{
							xtype:'Input',
							name:'joinLimit',
							value:oModel.get('joinLimit')==-1?undefined:oModel.get('joinLimit'),
							placeholder:'不填表示无限制',
							validator:{
								rules:{
									number:true
								},
								name:'人数'
							}
						}
					},{
						xtype:'Field',
						title:'人均费用',
						items:{
							xtype:'Input',
							name:'perCost',
							value:oModel.get('perCost'),
							placeholder:'不填表示0',
							validator:{
								rules:{
									number:true
								},
								name:'人均费用'
							}
						}
					}]
				},{
					xtype:'Set',
					theme:'simple',
					items:{
						xtype:'Field',
						title:'活动说明',
						items:{
							xtype:'Input',
							name:'content',
							value:oModel.get('content'),
							isTextarea:true,
							validator:{
								name:'活动说明',
								rules:{
									maxlength:500
								}
							}
						}
					}
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
	
	function fGetGroupIds(){
		var oGroupSels=this.find('[name=groupId]');
		var aIds=[];
		Obj.each(oGroupSels,function(i,oSel){
			var sValue=oSel.val();
			if(sValue!=''){
				aIds.push(sValue);
			}
		});
		return aIds;
	}
	function fGetFormData(){
		var me=this;
		var oGroups=me.model.get('groups');
		var oFormCmp=me.find('.activityForm')[0];
		var oAttrs=oFormCmp.getFormData();
		delete oAttrs.groupId;
		if(oAttrs.joinLimit===''&&!me.isCreate){
			oAttrs.joinLimit=-1;
		}
		var aIds=me.getGroupIds();
		var bIsDif=false;
		if(oGroups.size()!=aIds.length){
			bIsDif=true;
		}else{
			oGroups.each(function(i,oGroup){
				var id=oGroup.get('id');
				if(!Obj.contains(aIds,id)){
					bIsDif=true;
					return false;
				}
			})
		}
		if(bIsDif){
			oAttrs.groupIds=aIds.join(',');
		}
		return oAttrs;
	}
	/**
	 * 保存
	 * @method save
	 */
	function fSave(){
		var me=this;
		var oModel=me.model;
		var oFormCmp=me.find('.activityForm')[0];
		if(oFormCmp.valid()){
			var oAttrs=me.getFormData();
			var oOptions={
				success:function(oMod,result){
					var bCreate=me.isCreate;
					if(bCreate){
						gUser.get('activities').add(oModel);
					}
					if(bCreate){
						//删除编辑模块，因为modelId已经改变了
						$M.removeState();
						me.cleanCache();
						//使进入详情页时fetchIf可以发出请求
						oModel.setDirty();
						$M.go({modName:'m.activity.ActivityDetail',model:oModel,referer:me.referer});
					}else{
						$M.back();
					}
					$C.Tips(bCreate?'发布成功':'修改成功');
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
			//如果有修改需要发送群通知，传入groupIds时自动会发送群通知
			if(oModel.changedAttrs({diff:oAttrs})&&!oAttrs.groupIds){
				var aIds=me.getGroupIds();
				if(aIds.length>0){
					oAttrs.noticeGroups=aIds.join(',');
				}
			}
			oModel.save(oAttrs,oOptions);
		}
	}
	
	function fExit(){
		var me=this;
		if(me._allowExist){
			return;
		}
		var oModel=me.model;
		var oAttrs=me.getFormData();
		if(!oModel.saving&&oModel.changedAttrs({diff:oAttrs})){
			new $C.Dialog({
				contentMsg:'活动信息已经修改，退出前要保存吗？',
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
	
	return EditActivity;
	
});