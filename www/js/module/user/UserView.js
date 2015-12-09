/**
 * 用户视图
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("m.user.UserView",
[
'B.Util',
'V.View'
],
function(Util,View){
	
	var UserView=View.derive({
		init      : fInit      //初始化配置
	});
	
	function fInit(){
		var me=this;
		var oModel=me.model;
		var oUser=me.user=oModel.get('user')||oModel;
		var nUserId=oUser.get("id");
		var oListModule=me.parents();
		var oItem={
			xtype:'Hcard',
			model:oUser,
			extCls:'hui-list-item',
			title:'{{nickname}}',
			titleDesc:'{{distanceAndTime}}',
			clickable:false,
			items:[{
				xtype:'Image',
				theme:'lc',
				height:'3.375em',
				width:'3.375em',
				imgSrc:'{{avatarMin}}'
			},{
				xtype:'Desc',
				text:'{{desc1}}'
			},{
				xtype:'Desc',
				text:'{{desc2}}'
			}],
			click : function(){
				$M.go({modName:'m.user.UserDetail',model:me.user});
			}
		};
		
		if(oListModule.fixUserView){
			oListModule.fixUserView(oModel,oUser,oItem);
		}
		me.add(oItem);
	}
	
	return UserView;
});