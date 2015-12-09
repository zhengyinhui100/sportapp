/**
 * 活动消息视图
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("m.message.ActMsgView",
'V.View',
function(View){
	
	var ActMsgView=View.derive({
		init      : fInit
	});
	
	function fInit(){
		var me=this;
		var oModel=me.model;
		var oAct=oModel.get('activity');
		var oUser=oModel.get('user');
		var nType=oModel.get('type');
		var oItem={
			xtype:'Vcard',
			title:'{{activity.title}}',
			extTitle:'{{howlong}}',
			hasBorder:true,
			hasImg:true,
			items:[{
				xtype:'Image',
				extCls:'hui-title-img',
				imgSrc:'{{activity.avatarMin}}',
				width:'1.875em',
				height:'1.875em',
				xrole:'title',
				click:function(){
					$M.go({modName:'m.activity.ActivityDetail',model:oAct});
				}
			},{
				xtype:'Hcard',
				model:oUser,
				title:'{{nickname}}',
				desc:[
					{text:oModel.get('content'),txtOverflow:false}
				],
				items:{
					xtype:'Image',
					theme:'lc',
					height:'3.375em',
					width:'3.375em',
					imgSrc:'{{avatarMin}}',
					click:function(){
						$M.go({modName:'m.user.UserDetail',model:oUser});
						me.clickImg=true;
					}
				},
				click:function(){
					if(me.clickImg){
						me.clickImg=false;
					}else{
						$M.go({modName:'m.activity.ActivityDetail',model:oAct});
					}
				}
			}]
		};
		//加入申请
		if(nType==1){
			oItem.items[1].desc[0].text="申请参加活动，理由："+(oModel.get('content')||"无");
			oItem.items.push({
				xtype:'Button',
				size:'mini',
				xrole:'action',
				text:'处理申请',
				click:function(){
					$M.go({modName:'m.activity.Applyers',model:oAct});
				}
			})
		}
		me.add(oItem);
	}
	
	return ActMsgView;
});