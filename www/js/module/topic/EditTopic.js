/**
 * 发布话题模块
 * @author 郑银辉(zhengyinhui100@gmail.com)
 * @created 2014-2-25
 */

define("m.topic.EditTopic",
[
'L.Browser',
'B.Object',
'B.Util',
'B.String',
'M.AbstractModule',
'md.Topic',
'cm.Common'
],
function(Browser,Obj,Util,Str,AbstractModule,Topic,Common){
	
	var EditTopic=AbstractModule.derive({
		listeners        : [{
			name:'afterShow',
			custom:true,
			handler:function(){
				var me=this;
				if(me.ke||!me.useKE){
					return;
				}
				var oTextarea=me.findEl('textarea');
				Common.createEditor(oTextarea[0],{
					isSimple:Browser.mobile()
				},me);
			}
		}],
		init             : fInit,     
		getFormData      : fGetFormData,
		save             : fSave,
		exit             : fExit,
		destroy          : fDestroy
	});

	function fInit(){
		var me=this;
		var oModel;
		if(!me.model){
			me.isCreate=true;
			var oUser=gUser;
			oModel=me.model=Topic.get({editUserId:gUid});
			oModel.set(oUser.getPosition());
			//获取位置信息
			oUser.getPosition(function(oPos){
				oModel.set(oPos);
			});
		}else{
		    oModel=me.model;
		}
		
		var oContItem={
			name:'content',
			value:oModel.get('dispContent'),
			validator:{
				name:'内容',
				rules:{
					required:true,
					maxlength:20000
				}
			}
		};
		var nHeight=$G.getHeight()-Util.em2px(9);
		me.useKE=1||!Browser.mobile();
		if(me.useKE){
			oContItem.xtype="Input";
			oContItem.extCls='edit-content';
			oContItem.isTextarea=true;
			oContItem.inputHeight=nHeight-Util.em2px(2);
		}else{
			oContItem.xtype="Editor";
			oContItem.fontSize=gFontSize+'px';
			oContItem.height=nHeight;
		}
		
		me.add([Common.getHeader(me.isCreate?'发布话题':'修改话题','check',function(){
					me.save();
				}),{
			xtype:'Panel',
			extCls:'m-module-content m-padding-ns-more',
			items:{
				xtype:'Form',
				cClass:'topicForm',
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
					title:'内容',
					extCls:'content-field',
					items:[
						oContItem,
					{
						xtype:'Label',
						extCls:'editor-tips',
						condition:Browser.mobile(),
						text:'电脑上网页版有更丰富的编辑功能'
					}]
				}]
			}
		}]);
	}
	
	function fGetFormData(){
		var me=this;
		var oForm=me.findEl('form');
		if(me.ke){
			me.ke.sync();
		}else{
			me.find('Editor')[0].sync();
		}
		var oAttrs=Obj.fromArray(oForm.serializeArray());
		//var oReg=new RegExp('src=\"'+gStaticServer.replace(/\//g,'\\/'),'g');
		//oAttrs.content=oAttrs.content.replace(oReg,'src="');
		//把绝对路径改为相对路径提交
		oAttrs.content=oAttrs.content.replace(/(src=[\"|\'])([^\"\']+)/g,function(match,$1,$2){
			if($2.indexOf(gStaticServer)>=0){
				$2=$2.replace(gStaticServer,'').replace(/\.min.jpg$/,'.jpg');
			}
			return $1+$2;
		});
		//zepto的结果中包含未定义name属性的textarea，形如："":value;
		delete oAttrs[''];
		if(Str.isEqualsHtml(oAttrs.content,me.model.get('content')||'')){
			delete oAttrs.content;
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
		var oFormCmp=me.find('.topicForm')[0];
		var oAttrs=me.getFormData();
		if(oFormCmp.valid()){
			oAttrs.sourceType=51;
			oModel.save(oAttrs,{
				success:function(oMod,result){
					oModel.set(oAttrs,{silent:true});
					var bCreate=me.isCreate;
					if(bCreate){
						var oNewTopics=$S.get('newTopics');
						oNewTopics&&oNewTopics.add(oModel);
						gUser.get('topics').add(oModel);
					}
					if(bCreate){
						$M.removeState();
						me.cleanCache();
						gUser.get('topics').add(oModel);
						$M.go({modName:'m.topic.TopicDetail',model:oModel,referer:me.referer});
					}else{
						$M.back();
					}
					$C.Tips(bCreate?'发布成功':'修改成功');
				},
				noChange:function(){
					$C.Tips('没有修改');
				}
			});
		}
	}
	
	function fExit(){
		var me=this;
		var oModel=me.model;
		var oAttrs=me.getFormData();
		if(!oModel.saving&&oModel.changedAttrs({diff:oAttrs})){
			new $C.Dialog({
				contentMsg:'话题信息已经修改，退出前要保存吗？',
				noIgnore:false,
				activeBtn:2,
				ignoreCall:function(){
					me.find('Input[name=title')[0].val(oModel.get('title'));
					me.ke.html(oModel.get('dispContent'));
					$M.back(true);
				},
				okTxt:'保存',
				okCall:function(){
					me.save(true);
				}
			});
			return false;
		}
	}
	
	function fUseCache(oParams){
		//新建并且已保存的模块不能缓存
		return !(this.isCreate&&!this.model.isNew());
	}
	
	function fDestroy(){
		var me=this;
		me.ke&&me.ke.remove();
		me.callSuper();
	}
	
	return EditTopic;
	
});