/**
 * 活动详情模块
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("m.activity.ActivityDetail",
[
'B.Util',
'B.Url',
'M.AbstractModule',
'cm.Common',
'md.Activity'
],
function(Util,Url,AbstractModule,Common,Activity){
	
	var ActivityDetail=AbstractModule.derive({
		extCls         : 'm-module-gray',
		modCls         : Activity,
		init           : fInit,  
		entry          : fEntry,
		exit           : fExit
	});
	
	function fInit(){
		var me=this;
		var oModel=me.model;
		if(oModel.destroyed){
			$C.Tips({text:'活动已被删除',hide:function(){
				$M.destroy(me);
			}});
			return;
		}
		var oGroups=oModel.get('groups');
		var nStatus=oModel.get('status');
		var oHeader=Common.getHeader('活动详情');
		oHeader.scrollHide=true;
		var bIsOwner=oModel.get('editUserId')==gUid;
		if(gUid&&oModel.get('editUserId')==gUid){
			var oItems=oHeader.items;
			oItems.push({
				icon:'edit',
				xrole:'right',
				tType:'adapt',
				theme:'dark',
				click:function(){
					$M.go({modName:'m.activity.EditActivity',model:oModel});
				}
			});
			oItems.push({
				xtype:'Button',
				theme:'dark',
				icon:'delete',
				tType:'adapt',
				xrole:'right',
				click:function(){
					$C.Dialog.confirm('确定删除这个活动吗？',function(b){
						if(b){
							oModel.destroy({success:function(){
								$M.destroy(me);
							}});
						}
					});
				}
			});
		}
		me.add([oHeader,{
			xtype:'Panel',
			extCls:"m-module-content m-padding-ns",
			items:[{
				xtype:'Form',
				extCls:'hui-field-4-words',
				defItem:{
					labelColor:'gray'
				},
				items:[{
					xtype:'Set',
					theme:'simple',
					items:{
						xtype:'Field',
						title:'活动图片',
						content:{
							underline:false,
							hasArrow:true,
							height:'5em',
							items:[{
								xtype:'Image',
								style:{
									position:'absolute',
									zInzex:1
								},
								height:'3.375em',
								width:'3.375em',
								imgSrc:'{{avatarMin}}'
							}]
						},
						click:function(){
							new $C.DisplayImage({
								height:$G.getHeight(),
								imgSrc:oModel.get('avatarMin'),
								origSrc:oModel.get('avatarOrig')
							})
						}
					}
				},{
					xtype:'Set',
					theme:'simple',
					items:[{
						xtype:'Field',
						title:'标题',
						content:'{{title}}'
					},{
						xtype:'Field',
						title:'发布者',
						content:{
							cClass:'editUser',
							text:'{{editUser.nickname}}',
							hasArrow:true,
							underline:true
						},
						click:function(){
							var oEditUser=oModel.get('editUser');
							oEditUser&&oEditUser.get('id')&&$M.go({modName:'m.user.UserDetail',model:oEditUser});
						}
					},{
						xtype:'Field',
						title:'活动id',
						content:{
							underline:false,
							text:'{{id}}'
						}
					}]
				},{
					xtype:'Set',
					theme:'simple',
					items:[{
						xtype:'Field',
						title:'地点',
						content:'{{locationName}}'
					},{
						xtype:'Field',
						title:'距离',
						content:'{{distance}}'
					},{
						xtype:'Field',
						title:'活动时间',
						content:{
							underline:false,
							text:"{{actTime}}"
						}
					}]
				},{
					xtype:'Set',
					theme:'simple',
					items:[{
						xtype:'Field',
						title:'参加规则',
						content:'{{purviewRuleText}}'
					},{
						xtype:'Field',
						extCls:'act-groups',
						title:'参加群组',
						content:{
							xtype:'ModelList',
							defItem:{
								xtype:'RowItem',
								underline:true,
								text:'{{name}}',
								click:function(){
									$M.go({modName:'m.group.GroupDetail',model:this.model});
								}
							},
							model:oGroups,
							autoFetch:false,
							hasMoreBtn:false,
							hasPullRefresh:false
						}
					},{
						xtype:'Field',
						title:'人数限制',
						content:'{{joinLimitTxt}}'
					},{
						xtype:'Field',
						title:'人均费用',
						content:{
							underline:false,
							text:'{{perCost}}'
						}
					}]
				},{
					xtype:'Set',
					theme:'simple',
					items:[{
						xtype:'Field',
						title:'已申请',
						hidden:oModel.get('needApprove')==1,
						content:{
							text:'{{applyerNum}}',
							hasArrow:bIsOwner,
							underline:true
						},
						clickable:bIsOwner,
						click:function(){
							//只有活动发布者有权查看申请列表
							if(bIsOwner){
								$M.go({modName:'m.activity.Applyers',model:oModel});
							}
						}
					},{
						xtype:'Field',
						title:'已参加',
						content:{
							text:'{{memberNum}}',
							hasArrow:true,
							underline:false
						},
						click:function(){
							$M.go({modName:'m.activity.Members',model:oModel});
						}
					}]
				},{
					xtype:'Set',
					theme:'simple',
					items:[{
						xtype:'Field',
						title:'活动说明',
						content:{
							underline:false,
							text:'{{content}}'
						}
					}]
				}]
			},{
				xtype:'Share',
				condition:!gIsPg,
				getEntry:function(){
					var sSafeUrl=$M.getSafeUrl();
					var sQuery=Url.getQuery(sSafeUrl);
					var oEntry={
						title:oModel.get('title'),
						url:gServer+"index.do?"+sQuery,
						summary:"分享自乐加球友"
					};
					return oEntry;
				}
			},{
				xtype:'Panel',
				extCls:'m-actions',
				items:{
					xtype:'Button',
					cClass:'applyBtn',
					isInline:false,
					theme:'green',
					text:'{{joinBtnTxt}}',
					disabled:'{{joinBtnDisabled}}',
					hidden:'{{fetching}}',
					click:function(){
						if(!Common.chkLogin()){
							return;
						}
						var me=this;
						var sTxt=oModel.get('joinBtnTxt');
						var url='/activity/';
						if(sTxt=='申请'){
							$M.go({modName:'m.activity.ApplyActivity',model:oModel});
							return;
						}else if(sTxt=='参加'){
							url+='join.do';
						}else if(sTxt=='取消报名'){
							url+='quit.do';
						}else{
							return;
						}
						url+='?activityId='+oModel.id+'&userId='+gUid;
						$G.dao.ajax({
							url:url,
							success:function(result){
								if(sTxt=='参加'){
									oModel.set('hasJoined',true);
									oModel.set('memberNum',oModel.get('memberNum')+1);
									$C.Tips('报名成功');
								}else if(sTxt=='取消报名'){
									oModel.set('hasJoined',false);
									oModel.set('memberNum',oModel.get('memberNum')-1);
									$C.Tips('已取消报名');
								}
							}
						});
					}
				}
			}]
		}]);
	}
	
	function fEntry(){
		var me=this;
		var oModel=me.model;
		oModel.fetchIf({
			url:'/activityDetail/'+oModel.id+'/read.do',
			success:function(){
				document.title=oModel.get('title')+$G.shareExt;
			}
		});
		me.oldTitle=document.title;
		document.title=oModel.get('title')+$G.shareExt;
	}
	
	function fExit(){
		document.title=this.oldTitle;
	}
	
	return ActivityDetail;
	
});