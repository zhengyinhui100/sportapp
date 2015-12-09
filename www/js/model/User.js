/**
 * 用户模型
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("md.User",
[
'L.Browser',
'B.Object',
'B.Geo',
'B.Date',
'D.Model',
'P.Geolocation',
'md.Relation',
'md.Message',
'cl.Messages'
],
function(Browser,Obj,Geo,Dat,Model,Geolocation,Relation,Message,Messages){
	
	var User=Model.derive({
		url          : '/user/',
		fields       : {
			avatar:'',
//			favoriteTeam:{type:'str'},
//			playLevel:{type:'str'},
//			introduce:{tpye:'str'},
			
			relation:{type:Relation},
			message:{type:Message},
			conversation:{type:Messages},
			activities:{type:'cl.Activities'},
			topics:{type:'cl.Topics'},
			groups:{type:'cl.Groups'},
			follows:{type:'cl.Users'},
			fans:{type:'cl.Users'},
			dispRegTime : {
				deps : ['registerTime'],
				unsave:true,
				parseDeps:function(registerTime){
					return registerTime.replace(/\s.+/,'');
				}
			},
			distance : {
				deps : ['latitude','longitude'],
				unsave:true,
				parseDeps:function(){
					return Geo.distance(this,gUser,true);
				}
			},
			distanceAndTime:{
				deps : ['distance','loginTime'],
				unsave:true,
				parseDeps:function(distance,loginTime){
					return distance+"|"+loginTime;
				}
			},
			desc1:{
				deps : ['playYear','levelText'],
				unsave:true,
				parseDeps:function(playYear,levelText){
					return "球龄: "+(playYear||'空')+"|"+(levelText||'空');
				}
			},
			desc2:{
				deps : ['favoriteTeam'],
				unsave:true,
				parseDeps:function(favoriteTeam){
					return "主队: "+(favoriteTeam||"空");
				}
			},
			loginTime : {
				deps : ['lastLoginTime'],
				unsave:true,
				parseDeps:function(lastLoginTime){
					return Dat.howLong(lastLoginTime,true);
				}
			},
			//球龄
			'playYear' : {
				deps : ['playAge'],
				parseDeps :function(playAge){
					if(playAge){
						playAge=Dat.parseDate(playAge);
						var oNow=new Date();
						//只计算月份，不必再精确
						nPlayYearSum=Math.round(oNow.getFullYear()+(oNow.getMonth()+1)/12-
						playAge.getFullYear()-(playAge.getMonth()+1)/12);
						return nPlayYearSum;
					}
				}
			},
			levelText : {
				deps :['playLevel'],
				unsave:true,
				parseDeps:function(playLevel){
					if(playLevel){
						return {
							1:'业余菜鸟',
							2:'业余普通',
							3:'业余高手',
							4:'业余顶尖',
							5:'职业级'
						}[playLevel];
					}
				}
			},
			'relationship' : {
				deps : ['isFans','isFollow'],
				unsave:true,
				parseDeps :function(isFans,isFollow){
					if(this.get('id')==gUid){
						return '自己';
					}
					var sType='陌生人';
					if(isFans==1&&isFollow==1){
						sType='好友';
					}else if(isFollow){
						sType='关注';
					}else if(isFans==1){
						sType='粉丝';
					}
					return sType;
				}
			},
			avatarOrig:{
				deps:['avatar'],
				unsave:true,
				parseDeps:function(avatar){
					if(avatar){
						avatar= gStaticServer+avatar;
					}else{
						avatar= gSportAppUrl+'img/user.jpg';
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
			lastMsg : {
				deps : ['message'],
				unsave:true,
				parseDeps:function(message){
					return message&&message.get('content');
				}
			},
			lastMsgTime : {
				deps : ['message'],
				unsave:true,
				parseDeps:function(message){
					return message&&message.get('createTime');
				}
			},
			lastMsgDispTime : {
				deps : ['message'],
				unsave:true,
				parseDeps:function(message){
					return message&&message.get('displayTime');;
				}
			},
			settings : {
				deps : ['lowerIETips','standaloneTips'],
				parseDeps:function(lowerIETips,standaloneTips){
					var me=this,
					settings=me.get('settings');
					return (lowerIETips?'1':'0')+(standaloneTips?'1':'0')+(settings?settings.substring(2):'');
				}
			},
			//低版本IE提示，主要是ie8、9
			lowerIETips : {
				deps : ['settings'],
				unsave:true,
				parseDeps:function(settings){
					return settings?settings.charAt(0)==='1':false;
				}
			},
			//ios添加到桌面提示
			standaloneTips:{
				deps : ['settings'],
				unsave:true,
				parseDeps:function(settings){
					return settings?settings.charAt(1)==='1':false;
				}
			}
		},
		init         : fInit,
		getPosition  : fGetPosition   //获取当前位置
	});
	
	function fInit(){
		var me=this;
		me.once('change:id',function(sEvt,oModel,sId){
			var oActs=me.get('activities');
			oActs.id='userActs'+sId;
			oActs.url='/userActs/'+sId;
			var oTopics=me.get('topics');
			oTopics.id='userTopics'+sId;
			oTopics.url='/userTopics/'+sId;
			var oGroups=me.get('groups');
			oGroups.id='userGroups'+sId;
			oGroups.url='/userGroups/'+sId;
			var oFollows=me.get('follows');
			oFollows.id='follows'+sId;
			oFollows.url='/follows/'+sId;
			var oFans=me.get('fans');
			oFans.id='fans'+sId;
			oFans.url='/fans/'+sId;
		});
		me.on('change:conversation',function(){
			var conversation=me.get('conversation');
			var nSize;
			if(conversation&&(nSize=conversation.size())){
				var oLastMsg=conversation.at(nSize-1);
				me.set('message',oLastMsg);
				//不是正在聊天，未读数加1
				if(!me._talking&&oLastMsg.get('createTime')>gUser.get('messageTime')){
					gUser.get('messageTime')
					var nNewMsgNum=me.get('newMsgNum')||0;
					me.set('newMsgNum',++nNewMsgNum);
				}
			}
		});
	}
	/**
	 * 获取当前位置
	 * @param {boolean|Function=}call 如果传入回调函数或者true表示重新请求地址，回调函数参数是当前位置坐标；
	 * 								如果不传，则不重新请求，直接返回之前的坐标值
	 * @return {Object=} 如果没有回调函数，直接返回位置
	 */
	function fGetPosition(call,oOptions){
		var me=this;
		var oPos={latitude:me.get('latitude'),longitude:me.get('longitude')};
		var bHasPos=oPos.latitude&&oPos.longitude;
		//pc环境默认使用当前地址，因为获取误差较大，而且不确定性较大，如：chrome请求超时时间太长等
		if(call){
			var fCall=Obj.isFunc(call)?call:$H.noop;
			if(Browser.mobile()||!bHasPos||(oOptions&&oOptions.forceRefresh)){
				Geolocation.getCurrentPosition(function(oPos){
					var oCoords=oPos.coords;
					var nLat=oCoords.latitude;
					var nLng=oCoords.longitude;
					//更新地理信息
					var oPosition={latitude:nLat,longitude:nLng};
					me.save(oPosition);
					return fCall(oPosition);
				},function(oError){
					var bShowDialog;
					if(oOptions&&oOptions.need){
						if(!bHasPos){
							var sMsg;
							var bIsPc=Browser.pc();
							if(oError.code==='unsupport'){
								sMsg='当前环境不支持获取定位信息，'+(bIsPc?'请更换新版浏览器(建议chrome)或在手机上使用':'请更换设备后再使用');
							}else if(bIsPc){
								sMsg='建议您检查设置或者更换设备。'
							}
							sMsg+='(位置信息只需获取一次后续就可以跨环境使用了。)';
							new $C.Dialog({
								title:'无法获取位置信息',
								contentMsg:sMsg,
								noCancel:true,
								afterHide:function(){
									$M.getModule().cleanCache();
									$M.back();
								}
							});
							bShowDialog=true;
						}
					}
					//如果不能获得位置，返回之前的位置
					var bResult=fCall(oPos,oError);
					return !(bResult===false||bShowDialog);
				});
			}else{
				return fCall(oPos);
			}
		}else{
			return oPos;
		}
	}
	
	return User;
});