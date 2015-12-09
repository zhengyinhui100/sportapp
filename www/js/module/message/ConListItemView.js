/**
 * 会话列表项视图
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("m.message.ConListItemView",
'V.View',
function(View){
	
	var ConListItemView=View.derive({
		init      : fInit      //初始化配置
	});
	
	function fInit(){
		var me=this;
		var oUser=me.model;
		var oItem={
			xtype:'Hcard',
			extCls:'hui-list-item',
			newsNum:'{{newMsgNum}}',
			clickable:true,
			title:'{{nickname}}',
			titleDesc:'{{lastMsgDispTime}}',
			desc:[{
				text:'{{lastMsg}}'
			}],
			imgClick:function(){
				$M.go({modName:'m.user.UserDetail',model:oUser});
				me.imgClick=true;
			},
			click:function(){
				if(me.imgClick){
					me.imgClick=false;
				}else{
					$M.go({modName:'m.message.Conversation',model:oUser});
				}
			},
			items:[{
				xtype:'Image',
				theme:'lc',
				extCls:'js-img',
				xrole:'left',
				height:'3.375em',
				width:'3.375em',
				imgSrc:'{{avatarMin}}'
			}]
		};
		me.add(oItem);
	}
	
	return ConListItemView;
});