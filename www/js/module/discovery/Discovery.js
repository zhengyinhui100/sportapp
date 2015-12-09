/**
 * 发现模块
 * @author 郑银辉(zhengyinhui100@gmail.com)
 * @created 2014-2-26
 */

define("m.discovery.Discovery",
[
'M.AbstractModule',
'cm.Common'
],
function(AbstractModule,Common){
	
	var Discovery=AbstractModule.derive({
		extCls           : 'm-module-gray',
		hasFooter        : true,
		cacheLevel       : 5,
		init             : fInit
	});

	function fInit(){
		var me=this;
		me.add([{
			xtype:'Toolbar',
			title:'发现',
			tType:'align-left',
			isHeader:true,
			items:{
				xtype:'Icon',
				name:'logo',
				tType:'adapt',
				xrole:'left'
			}
		},{
			xtype:'Panel',
			extCls:'m-module-content m-padding-ns',
			items:[{
				xtype:'Set',
				theme:'simple',
				items:[{
					xtype:'Field',
					title:{
						xtype:'Icon',
						name:'activity',
						tType:'big',
						bgColor:'#fb7c6e',
						radius:'normal'
					},
					content:{
						xtype:'RowItem',
						hasArrow:true,
						text:'附近的活动'
					},
					click:function(){
						Common.chkLogin()&&$M.go('m.activity.NearActivities');
					}
				},{
					xtype:'Field',
					title:{
						xtype:'Icon',
						name:'nearby-group',
						tType:'big',
						bgColor:'#66cccc',
						radius:'normal'
					},
					content:{
						xtype:'RowItem',
						hasArrow:true,
						text:'附近的群组'
					},
					click:function(){
						Common.chkLogin()&&$M.go('m.group.NearGroups');
					}
				},{
					xtype:'Field',
					title:{
						xtype:'Icon',
						name:'nearby-user',
						tType:'big',
						bgColor:'#ffa200',
						radius:'normal'
					},
					content:{
						xtype:'RowItem',
						text:'附近的用户',
						hasArrow:true,
						underline:false
					},
					click:function(){
						Common.chkLogin()&&$M.go('m.user.NearUsers');
					}
				}]
			},{
				xtype:'Set',
				theme:'simple',
				items:[{
					xtype:'Field',
					condition:false,
					title:{
						xtype:'Icon',
						name:'topic',
						tType:'big',
						bgColor:'#fb83a5',
						radius:'normal'
					},
					content:{
						xtype:'RowItem',
						text:'附近的话题',
						extTxt:'开发中...'
					}
				},{
					xtype:'Field',
					title:{
						xtype:'Icon',
						name:'phone',
						tType:'big',
						bgColor:'#76E094',
						radius:'normal'
					},
					content:{
						xtype:'RowItem',
						underline:false,
						text:'附近的球场',
						extTxt:'开发中...'
					}
				}]
			}]
		}])
	}
	
	return Discovery;
	
});