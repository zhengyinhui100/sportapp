/**
 * 群组视图
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("m.group.GroupView",
[
'B.Util',
'V.View'
],
function(Util,View){
	
	var GroupView=View.derive({
		init      : fInit     
	});
	
	function fInit(){
		var me=this;
		me.add({
			xtype:'Hcard',
			extCls:'hui-list-item',
			title:"{{name}}",
			titleDesc:'{{memberNumTxt}}',
			desc:[{
				icon:"location",
				text:'{{distance}}'
			},{
				text:"{{introduce}}"
			}],
			items:{
				xtype:'Image',
				theme:'lc',
				height:'3.375em',
				width:'3.375em',
				imgSrc:'{{avatarMin}}'
			},
			click : function(){
				$M.go({modName:'m.group.GroupDetail',model:me.model});
			}
		});
	}
	
	return GroupView;
});