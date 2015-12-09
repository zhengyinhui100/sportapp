/**
 * 话题视图
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("m.topic.TopicView",
[
'B.Util',
'V.View'
],
function(Util,View){
	
	var TopicView=View.derive({
		
		listeners   : [{
			name    : 'click',
			handler : function(){
				$M.go({modName:'m.topic.TopicDetail',model:this.model});
			}
		}],
		
		init      : fInit     
	});
	
	function fInit(){
		var me=this;
		var oModel=me.model;
		var bHasImg=!!oModel.get('avatarMin');
		if(oModel.get('editUserId')!=gUid){
			me.bindType='none';
		}
		var oItem={
			xtype:'Hcard',
			extCls:'hui-list-item',
			title:"{{title}}",
			hasImg:bHasImg,
			txtOverflow:false,
			desc:[{
				text:'{{displayTime}}',
				items:{
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
						bindType:'model',
						content:'{{commentNum}}'
					}]
				}
			}]
		};
		if(bHasImg){
			oItem.items=[{
				xtype:'Image',
				radius:null,
				theme:'lc',
				style:{
					marginTop:'-1.875em'
				},
				height:'3.75em',
				width:'4.5em',
				imgSrc:'{{avatarMin}}'
			}]
		}
		me.add(oItem);
	}
	
	return TopicView;
});