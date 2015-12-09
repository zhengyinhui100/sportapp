/**
 * 话题模块，显示话题讨论
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("m.topic.TopicDetail",
[
'B.Url',
'B.String',
'M.AbstractModule',
'cm.Common',
'md.Comment',
'md.Topic',
'm.topic.CommentView'
],
function(Url,Str,AbstractModule,Common,Comment,TopicModel,CommentView){
	
	var TopicDetail=AbstractModule.derive({
		modCls        : TopicModel,
		listeners     : [{
			name:'click',
			selector:'.topic-content img',
			method:'delegate',
			handler:function(oEvt){
				var oImg=oEvt.currentTarget;
				var sSrc=oImg.src;
				var sOrigSrc=sSrc;
				if(sOrigSrc.indexOf(gStaticServer)>=0){
					sOrigSrc=sOrigSrc.replace(/\.min\.jpg$/,'.jpg');
				}
				new $C.DisplayImage({
					height:$G.getHeight(),
					imgSrc:sSrc,
					origSrc:sOrigSrc
				})
			}
		}],
		init          : fInit,
		comment       : fComment,
		entry         : fEntry,
		exit          : fExit
	});
	

	function fInit(){
		var me=this;
		var oModel=this.model;
		if(oModel.destroyed){
			$C.Tips({text:'话题已被删除',hide:function(){
				$M.destroy(me);
			}});
			return;
		}
		oModel.fetch({success:function(){
			document.title=oModel.get('title')+$G.shareExt;
		}});
		var oComments=oModel.get('comments');
		oComments.url='comments/'+oModel.id;
		var oHeader=Common.getHeader('话题');
		oHeader.scrollHide=true;
		var oItems=oHeader.items;
		Common.getPageData(oComments,{showLoading:true});
		//原生分享
		if(gIsPg){
			oItems.push({
				xtype:'Button',
				theme:'dark',
				icon:'action',
				tType:'adapt',
				xrole:'right',
				click:function(){
					var sSafeUrl=$M.getSafeUrl();
					var sQuery=Url.getQuery(sSafeUrl);
					var sUrl=Common.getShareUrl();
					var sContent=oModel.get('content');
					//过滤图片说明文字
					sContent=sContent.replace(/img-desc[^(<\/)]+/g,'');
					sContent=Str.htmlToTxt(sContent).replace(/(\n|\s)+/g,'');
					//TODO  新浪微博日后使用linkcard改善体验
					sContent=sContent.substring(0,100)+sUrl;
					var oEntry={
						title:oModel.get('title'),
						content:sContent,
						url:sUrl,
						imgUrl:oModel.get('avatarMin'),
						site:'http://www.17lejia.com'
					};
					Share.share(oEntry);
				}
			});
		}
		oItems.push({
			xtype:'Button',
			theme:'dark',
			icon:'delete',
			tType:'adapt',
			hidden:'{{notOwner}}',
			xrole:'right',
			click:function(){
				$C.Dialog.confirm('确定删除这篇文章吗？',function(b){
					if(b){
						oModel.destroy({success:function(){
							$M.destroy(me);
						}});
					}
				});
			}
		});
		oItems.push({
			xtype:'Button',
			theme:'dark',
			icon:'edit',
			tType:'adapt',
			xrole:'right',
			hidden:'{{notOwner}}',
			click:function(){
				$M.go({modName:'m.topic.EditTopic',model:oModel});
			}
		});
		
		me.add([oHeader,
			{
				xtype:'Panel',
				extCls:'m-module-content m-padding-both',
				items:[{
					xtype:'Hcard',
					extCls:'topic-title',
					hasImg:false,
					txtOverflow:false,
					title:"{{title}}",
					desc:[{
						text:'{{displayTime}}',
						items:[{
							xtype:'Link',
							xrole:'content',
							text:'{{author.nickname}}',
							click:function(){
								var oAuthor=oModel.get('author');
								if(oAuthor.id){
									$M.go({modName:'m.user.UserDetail',model:oAuthor});
								}
							}
						},{
							xtype:'Panel',
							xrole:'right',
							items:[{
								xtype:'Icon',
								theme:null,
								extCls:'hui-lighter',
								isAlt:true,
								name:'comment'
							},{
								xtype:'Panel',
								style:{float:'left'},
								content:'{{commentNum}}'
							}]
						}]
					}]
				},{
					xtype:'Panel',
					extCls:'topic-content',
					content:'{{dispContent}}'
				},{
					xtype:'Share',
					condition:!gIsPg,
					getEntry:function(){
						var oEntry={
							title:oModel.get('title'),
							url:Common.getShareUrl(),
							summary:"分享自乐加球友"
						};
						return oEntry;
					}
				},{
					xtype:'Form',
					extCls:'topic-reply-form c-clear',
					items:[{
						xtype:'Input',
						name:'content',
						isTextarea:true,
						placeholder:'请输入评论内容',
						validator:{
							name:'评论',
							rules:{
								required:true,
								maxlength:2000
							}
						},
						click:function(){
							Common.chkLogin();
						},
						enterSubmit:function(){
							me.comment(this);
						}
					},{
						xtype:'Button',
						text:'评论',
						size:'mini',
						click:function(){
							me.comment(this.parent.find('Input')[0]);
						}
					}]
				},{
					xtype:'Set',
					extCls:'topic-reply-list',
					title:'最新评论',
					items:[{
						xtype:'Button',
						size:'mini',
						xrole:'title',
						text:'刷新',
						click:function(){
							Common.getPageData(oComments,{refresh:true,showLoading:true});
						}
					},{
						xtype:'ModelList',
						itemXtype:CommentView,
						model:oComments,
						autoFetch:false,
						topic:oModel,
						getMore:function(){
							Common.getPageData(oComments,{showLoading:true});
						}
					}]
				}]
			}
		]);
	}
	
	function fComment(oInput){
		var me=this;
		if(!Common.chkLogin()){
			return;
		}
		var oComment=Comment.get();
		if(oInput.valid()){
			var oModel=me.model;
			var sContent=oInput.val();
			oComment.save({
				topicId:oModel.get('id'),
				editUserId:gUid,
				latitude:gUser.get('latitude'),
				longitude:gUser.get('longitude'),
				content:Str.encodeHTML(sContent)
			},{
				success:function(){
					$C.Tips('提交成功');
					oInput.val('');
					oModel.set('commentNum',oModel.get('commentNum')+1);
					oComment.set('author',gUser);
					oModel.get('comments').add(oComment);
				}
			});
		}
	}
	
	function fEntry(){
		var me=this;
		me.oldTitle=document.title;
		document.title=me.model.get('title')+$G.shareExt;
	}
	
	function fExit(){
		document.title=this.oldTitle;
	}
	
	return TopicDetail;
	
});