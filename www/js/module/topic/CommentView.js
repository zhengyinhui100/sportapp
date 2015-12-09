/**
 * 评论视图
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("m.topic.CommentView",
[
'B.String',
'V.View',
'cm.Common',
'md.Comment'
],
function(Str,View,Common,Comment){
	
	var CommentView=View.derive({
		init      : fInit,
		reply     : fReply
	});
	
	function fInit(){
		var me=this;
		var oModel=me.model;
		var oAuthor=oModel.get('author');
		var oList=me.listModel=me.parents('ModelList');
		var oTopic=me.topicModel=oList.topic;
		var aItems=[{
			xtype:'Image',
			height:'2.5em',
			width:'2.5em',
			xrole:'image',
			imgSrc:'{{avatarMin}}',
			click:function(){
				$M.go({modName:'m.user.UserDetail',model:oAuthor});
			}
		}];
		var oParent=oModel.get('parentComment');
		var nFloor;
		me.extCls='topic-comment hui-comment'+(me.isQuote?'':' hui-comment-top');
		if(!me.isQuote&&oParent){
			var aQuotes=[];
			while(oParent){
				aQuotes.unshift({
					xtype:CommentView,
					model:oParent,
					isQuote:true
				});
				oParent=oParent.get('parentComment');
			}
			for(nFloor=0,len=aQuotes.length;nFloor<len;){
				aQuotes[nFloor].floor=++nFloor;
			}
			me.add({
				xtype:'Panel',
				xrole:'content',
				extCls:'hui-comment-quote',
				items:aQuotes
			});
		}
		me.add({
			xtype:'Hcard',
			model:oAuthor,
			title:'{{nickname}}',
			titleExt:'{{distanceAndTime}}',
			titleDesc:nFloor?++nFloor:me.floor,
			desc:[{
				extCls:'comment-content',
				txtOverflow:false,
				text:oModel.get('content')
			},{
				extCls:'comment-footer c-clear',
				text:oModel.get('displayTime'),
				items:[{
					xtype:'Button',
					condition:false,
					text:'支持',
					xrole:'right',
					click:function(){
					}
				},{
					xtype:'Button',
					text:'回复',
					xrole:'right',
					click:function(){
						if(!Common.chkLogin()){
							return;
						}
						if(me.replyForm){
							var oForm=me.replyForm;
							oForm[oForm.hidden?'show':'hide']();
							return;
						}
						me.replyForm=me.add({
							xtype:'Form',
							xrole:null,
							extCls:'topic-reply-form c-clear',
							items:[{
								xtype:'Input',
								name:'content',
								isTextarea:true,
								placeholder:'请输入回复内容',
								enterSubmit:function(){
									me.reply(this);
								},
								validator:{
									name:'回复',
									rules:{
										required:true,
										maxlength:2000
									}
								}
							},{
								xtype:'Button',
								text:'发布',
								size:'mini',
								click:function(){
									me.reply(this.parent.find('Input')[0]);
								}
							}]
						});
					}
				}]
			}],
			items:aItems
		});
	}
	
	function fReply(oInput){
		var me=this;
		var oComment=Comment.get();
		if(oInput.valid()){
			var oModel=me.model;
			var oTopic=me.topicModel
			var sContent=oInput.val();
			oComment.save({
				topicId:oModel.get('topicId'),
				parentId:oModel.get('id'),
				buildingId:oModel.get('buildingId'),
				editUserId:gUid,
				replyUserId:oModel.get('editUserId'),
				title:oTopic.get('title'),
				latitude:gUser.get('latitude'),
				longitude:gUser.get('longitude'),
				content:Str.encodeHTML(sContent)
			},{
				success:function(){
					$C.Tips('提交成功');
					oInput.val('');
					me.replyForm.hide();
					oComment.set('author',gUser);
					oComment.set('parentComment',oModel);
					oTopic.set('commentNum',oTopic.get('commentNum')+1);
					var oComments=me.listModel.model;
					if(!me.isQuote){
						oComments.remove(oModel);
					}
					oComments.add(oComment);
				}
			});
		}
	}
	
	return CommentView;
});