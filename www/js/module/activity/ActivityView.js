/**
 * 群组视图
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("m.activity.ActivityView",
'V.View',
function(View){
	
	var ActivityView=View.derive({
		init      : fInit     
	});
	
	function fInit(){
		var me=this;
		me.add({
			xtype:'Hcard',
			extCls:'hui-list-item',
			title:"{{title}}",
			desc:[{
				icon:"location",
				text:'{{distance}}'
			},{
				icon:"clock",
				text:'{{actTime}}'
			}],
			items:{
				xtype:'Image',
				theme:'lc',
				height:'3.375em',
				width:'3.375em',
				imgSrc:'{{avatarMin}}'
			},
			click : function(){
				$M.go({modName:'m.activity.ActivityDetail',model:me.model});
			}
		});
	}
	
	return ActivityView;
});