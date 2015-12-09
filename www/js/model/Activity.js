/**
 * 活动模型
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("md.Activity",
[
'B.Geo',
'B.Date',
'D.Model',
'md.User',
'cl.Groups',
'cl.ActivityApplys',
'cl.ActivityMembers'],
function(Geo,Dat,Model,User,Groups,ActivityApplys,ActivityMembers){
	
	var Activity=Model.derive({
		url : '/activity',
		fields : {
			avatar:'',
//			joinLimit:-1,
//			title:{type:'str'},
//			content:{type:'str'},
//			joinLimit:{type:'num'},
//			locationName:{type:'str'},
//			perCost:{type:'num'},
			purviewRule:0,
//			startTime:{type:'str'},
//			endTime:{type:'str'},
			
			editUser:{type:User},
			applyers:{type:ActivityApplys},
			members:{type:ActivityMembers},
			groups:{
				deps:['groupIds'],
				type:'cl.Groups',
				parseDeps:function(groupIds){
					var aIds=(groupIds||'').split(',');
					var aGroups=[];
					for(var i=0;i<aIds.length;i++){
						aGroups.push({
							id:aIds[i]
						});
					}
					this.get('groups').reset();
					return aGroups;
				}
			},
			avatarOrig:{
				deps:['avatar'],
				unsave:true,
				parseDeps:function(avatar){
					if(avatar){
						avatar= gStaticServer+avatar;
					}else{
						avatar= gSportAppUrl+'img/act.jpg';
					}
					return avatar;
				}
			},
			avatarMin:{
				deps:['avatarOrig'],
				unsave:true,
				parseDeps:function(avatar){
					return avatar.replace(/\.([^\.]+)$/,'.min.$1');
				}
			},
			distance : {
				deps : ['latitude','longitude'],
				unsave:true,
				parseDeps:function(){
					return Geo.distance(this,gUser,true);
				}
			},
			purviewRuleText : {
				deps :['purviewRule'],
				unsave:true,
				parseDeps:function(purviewRule){
					if(purviewRule!==undefined){
						return {
							0:'所有人可直接参加',
							1:'所有人都需申请',
							2:'除指定群组外需申请',
							3:'只有指定群组能参加'
						}[purviewRule];
					}
				}
			},
			joinLimitTxt : {
				deps : ['joinLimit'],
				unsave:true,
				parseDeps:function(nLimit){
					return nLimit>0?nLimit:'不限';
				}
			},
			actTime : {
				deps : ['startTime','endTime'],
				unsave:true,
				parseDeps:function(startTime,endTime){
					return Dat.formatDate(startTime,'MM-dd HH:mm')+' 到 '+Dat.formatDate(endTime,'MM-dd HH:mm');
				}
			},
			joinBtnTxt : {
				deps : ['hasApplyed','hasJoined'],
				unsave:true,
				parseDeps:function(hasApplyed,hasJoined){
					var me=this;
					var txt;
					if(hasJoined){
						txt='取消报名';
					}else if(hasApplyed){
						txt='已申请';
					}else{
						if(this.get('editUserId')==gUid){
							return '参加';
						}
						var purviewRule=me.get('purviewRule');
						var bNeed=false;
						//所有人可直接参加
						if(purviewRule==0){
							txt='参加';
						}else if(purviewRule==1){
							//所有人都需申请
							txt='申请';
						}else{
							var bInGroup=false;
							var myGroups=gUser.get('groups');
							var oGroups=me.get('groups');
							if(myGroups){
								oGroups.each(function(i,oGroup){
									myGroups.each(function(i,oGp){
										if(oGp.get('id')==oGroup.get('id')){
											bInGroup=true;
											return false;
										}
									})
									if(bInGroup){
										return false;
									}
								});
							}
							if(purviewRule==2){
								//除指定群组外需申请
								if(bInGroup){
									txt='参加';
								}else{
									txt='申请';
								}
							}else{
								//只有指定群组能参加
								if(bInGroup){
									txt='参加';
								}else{
									txt='无权参加';
								}
							}
						} 
					}
					return txt;
				}
			},
			joinBtnDisabled:{
				deps:['joinBtnTxt'],
				unsave:true,
				parseDeps:function(joinBtnTxt){
					return joinBtnTxt=='已申请'||joinBtnTxt=='无权参加';
				}
			}
		},
		init             : fInit
	});
	
	function fInit(){
		var me=this;
		//检测数量变化
		me.on('change:members',function(sEvt,oModel,oMembers,sSubEvt){
			//已获取数据，按照数据计算
			if(oMembers&&oMembers.url){
				me.set('memberNum',oMembers.size());
			}else if(sSubEvt=='add'||sSubEvt=='remove'){
				me.set('memberNum',me.get('memberNum')+(sSubEvt=='add'?1:-1));
			}
		});
		me.on('change:applyers',function(sEvt,oModel,oApplyers,sSubEvt){
			//已获取数据，按照数据计算
			if(oApplyers&&oApplyers.url){
				me.set('applyerNum',oApplyers.size());
			}else if(sSubEvt=='add'||sSubEvt=='remove'){
				me.set('applyerNum',me.get('applyerNum')+(sSubEvt=='add'?1:-1));
			}
		});
	}
	
	return Activity;
});