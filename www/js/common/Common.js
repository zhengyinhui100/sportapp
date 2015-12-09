/****************************************************************
* Author:		郑银辉											*
* Email:		zhengyinhui100@gmail.com						*
*****************************************************************/
/**
 * 项目通用工具类
 */
define('cm.Common',
[
'L.Browser',
'B.Class',
'B.Object',
'B.Date',
'B.Url',
'md.AllMsg',
'm.group.GroupView',
'md.Group'
],
function(Browser,Class,Obj,Dat,Url,AllMsg,GroupView,Group){
	
	var Common=Class.createClass();

	Obj.extend(Common,{
		getHeader               : fGetHeader,              //生成顶部工具栏配置
		createEditor            : fCreateEditor,           //创建编辑器
		getSearchNearParam      : fGetSearchNearParam,     //获取搜索附近的参数
		getPageData             : fGetPageData,            //获取分页数据
		enableLoading           : fEnableLoading,          //开启/禁用公共loading提示，当模块内有自定义的loading提示时，需要禁用全局的loading提示
		showLoading             : fShowLoading,            //显示/隐藏公共loading提示
		pullAllMsgs             : fPullAllMsgs,            //拉取全部新消息
		pullMsg                 : fPullMsg,                //拉取消息
		searchGroup             : fSearchGroup,            //搜索群组
		chkLogin                : fChkLogin,               //检查是否登录，未登录弹窗提示
		getShareUrl             : fGetShareUrl             //获取分享的url
	});
	
	var _bEnable=true;      //是否禁用loading
	var _oLoading;          //当前loading提示对象
	var _nShowTimes=0;      //当前loading提示被调用显示的次数，隐藏时清零，用于控制多次并行请求的情况
	
	/**
	 * 生成顶部工具栏配置
	 * @param {string}sTitle 标题
	 * @param {string=}sRightIcon 右边按钮图标名
	 * @param {function=}fRightClick 右边按钮点击函数
	 */
	function fGetHeader(sTitle,sRightIcon,fRightClick){
		var oHeader={
			xtype:'Toolbar',
			isHeader:true,
			items:[{
				xtype:'Button',
				xrole:'left',
				theme:'dark',
				text:sTitle,
				tType:'adapt',
				icon:'carat-l',
				iconPos:'left',
				click:function(){
					$M.back();
				}
			}]
		};
		if(sRightIcon){
			var oItem={
				xtype:'Button',
				theme:'dark',
				tType:'adapt',
				xrole:'right'
			}
			if(sRightIcon==='pdRefresh'){
				if(!Browser.hasTouch()){
					oItem.icon='refresh';
					oItem.click=function(){
						this.parents().find('ModelList')[0].pullLoading(true);
					};
					oHeader.items.push(oItem);
				}
			}else{
				oItem.icon=sRightIcon;
				oItem.click=fRightClick;
				oHeader.items.push(oItem);
			}
		}
		return oHeader;
	}
	/**
	 * 创建编辑器
	 */
	function fCreateEditor(oEl,oParams,oObj){
		require('KindEditor',function(){
			var oEditor;
			oParams=oParams||{};
			var aItems=[ 'undo', 'redo', '|', 'justifyleft', 'justifycenter', 'justifyright',
		        'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
		        'superscript', 'clearhtml', 'quickformat', 'selectall', '|', 'preview', 
		        'plainpaste', 'wordpaste', '|',  'source','fullscreen','/',
		        'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
		        'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'image',
		         'table', 'hr', 'emoticons'];
		    if(oParams.isSimple){
		    	aItems=['fontsize', 'forecolor', 'hilitecolor', 'bold','removeformat','image'];
		    }
	    	delete oParams.isSimple;
		    var oInitParams={
			    resizeType:0,
			    designMode:true,
				uploadJson : gServer+'file/filesUpload.do?from=kindeditor',
				filePostName:'files',
				items:aItems
			};
			var sCss='img{max-width:100%;}body{'+(gZoom!==1?'zoom:'+gZoom+';':'')+'font-size:16px;height:100%;color:#666}';
			if(Browser.mobile()){
				oInitParams.afterCreate=function(){
					var oIcon=$(oEditor.toolbar.div[0]).find('.ke-icon-image');
					oIcon[0].parentNode.style.position='relative';
					new $C.ImgUpload({
						renderTo:oIcon,
						renderBy:'after',
						transparent:true,
						cropWinH:$G.getHeight(),
						cropOptions:{
							fixedScale:false
						},
						compressOptions:{
							maxWidth:1024,
							maxHeight:1024,
							success:function(oData){
								var oTips=new $C.Tips({
									text:'图片上传中...',
									type:'loading'
								});
								$G.dao.ajax({
									url:'file/imgUpload.do',
									data:{
										image:oData.clearBase64,
										resizeW:500,
										resizeH:500
									},
									success:function(oResult){
										oTips.hide();
										var sUrl=oResult.data;
										oEditor.insertHtml('<img class="insertImg" src="'+gStaticServer+sUrl+'"/>');
									}
								})
							}
						}
					});
				}
			}
			oInitParams.cssData=sCss;
		    Obj.extend(oInitParams,oParams);
			oEditor=KindEditor.create(oEl,oInitParams);
			oObj&&(oObj.ke=oEditor);
		});
	}
	/**
	 * 获取搜索附近的参数
	 * @param {Collection}oCollection 集合对象
	 * @param {Object=} oParam 上次搜索参数
	 * @return {Object} 返回搜索参数
	 */
	function fGetSearchNearParam(oCollection,oParam){
		//oParam为空表示初始搜索或者刷新
		var nSize=0,nIgnoreNum=0;
		if(oParam){
			nIgnoreNum=oCollection._ignoreNum;
			nSize=oCollection.size();
		}
		var nPageSize=15;
		//搜索距离间隔10公里
		var nDistance=20;
		oParam=oParam||{
			latitude:gUser.get('latitude'),
			longitude:gUser.get('longitude'),
			pageStart:0,
			pageSize:nPageSize,
			from:0,
			to:0
		}
		if(nSize-nIgnoreNum-oParam.pageStart<nPageSize){
			oCollection._ignoreNum=nSize;
			oParam.from=oParam.to;
			oParam.to=nDistance+oParam.to;
			oParam.pageStart=0;
		}else{
			oParam.pageStart=oParam.pageStart+nPageSize;
		}
		return oParam;
	}
	/**
	 * 获取分页的数据
	 * @param {Collection}oCollection 集合对象
	 * @param {object=}oOptions 选项{
	 * 		{boolean=}refresh:true表示刷新
	 * 		{boolean=}showLoading:仅当true时显示loading
	 * 		{boolean=}first:true表示是第一次调用
	 * }
	 */
	function fGetPageData(oCollection,oOptions){
		var me=this;
		var nSize=oCollection.size();
		oOptions=oOptions||{};
		var bRefresh=oOptions.refresh;
		var bFirst=oOptions.first||!oCollection.lastFetchTime;
		var oParam={
			pageStart:bRefresh||bFirst?0:nSize,
			pageSize:15
		};
		var oOptions=Obj.extend({add:true,data:oParam},oOptions);;
		oOptions.success=function(){
			if(!bFirst&&nSize>0&&!bRefresh&&oCollection.size()==nSize){
				$C.Tips('没有更多结果了');
			}
		}
		if(bRefresh){
			var bLoading=oOptions.showLoading;
			bLoading||Common.enableLoading(false);
			oOptions.beforeSet=function(){
				bLoading||Common.enableLoading(true);
				oCollection.reset();
			}
		}
		oCollection.fetch(oOptions);
	}
	/**
	 * 开启/禁用公共loading提示，当模块内有自定义的loading提示时，需要禁用全局的loading提示
	 * @param {boolean=}bEnable 仅当为false时禁用
	 */
	function fEnableLoading(bEnable){
		_bEnable=bEnable!=false;
		if(!bEnable){
			_oLoading&&_oLoading.hide();
		}
	}
	/**
	 * 显示/隐藏公共loading提示，外部只需在请求开始和结束时调用此接口，多次串行请求的处理逻辑已封装在内部
	 * @param {boolean}bShow 仅当为false时表示隐藏
	 */
	function fShowLoading(bShow){
		var me=this;
		if(bShow!=false){
			_nShowTimes++;
			if(_bEnable){
				if(_oLoading){
					_oLoading.show();
				}else{
					_oLoading=$C.Tips({
						type:'miniLoading'
					})
				}
			}
		}else{
			_nShowTimes--;
			if(_oLoading){
				if(_nShowTimes<=0){
					_oLoading.hide();
				}
			}
		}
	}
	/**
	 * 拉取全部新消息
	 */
	function fPullAllMsgs(){
		var me=this;
		var oAllMsgs;
		if(!(oAllMsgs=me.allMsgs)){
			oAllMsgs=me.allMsgs=AllMsg.get();
	        $S.push('AllMsg.my',oAllMsgs);
		}
    	
		oAllMsgs.fetch({data:{
        	messageTime:gUser.get('messageTime'),
        	noticeTime:gUser.get('noticeTime'),
        	groupMessageTime:gUser.get('groupMessageTime'),
        	activityMsgTime:gUser.get('activityMsgTime')
        },success:function(oModel,oData){
        	//设置初始消息数，用于后续拉取消息时统计新消息数
        	oAllMsgs.set('initNewMsgNum',oAllMsgs.get('newMsgNum'));
        	oAllMsgs.set('initNewMsgNum',oAllMsgs.get('newGpMsgNum'));
        	//更新消息时间
        	var sCurTime=Dat.now(true);
        	gUser.set('messageTime',sCurTime);
        	gUser.set('groupMessageTime',sCurTime);
        	gUser.set('noticeTime',sCurTime);
        	gUser.set('activityMsgTime',sCurTime);
    		
    		var bFast=gIsDev;
			//开启消息线程
    		me.pullMsg(oAllMsgs.get('conList'),'messageTime',{
	        	startTimeout  : 15*1000,                 //私信初次拉取时间间隔
				maxTimeout    : 15*60*1000,              //私信最大拉取时间间隔
				factor        : bFast?1:2                //私信拉取心跳系数
	        });
	        me.pullMsg(oAllMsgs.get('gpConList'),'groupMessageTime',{
				startTimeout  : bFast?15*1000:30*1000,   //群消息初次拉取时间间隔
				maxTimeout    : 15*60*1000,              //群消息最大拉取时间间隔
				factor        : bFast?1:3                //群消息拉取心跳系数
	        });
	        me.pullMsg(oAllMsgs.get('notices'),'noticeTime',{
	        	startTimeout  : 60*1000,                 //系统通知初次拉取时间间隔
				maxTimeout    : 15*60*1000,              //系统通知最大拉取时间间隔
				factor        : bFast?1:3                //系统通知拉取心跳系数
	        });
	        me.pullMsg(oAllMsgs.get('activityMsgs'),'activityMsgTime',{
	        	startTimeout  : 30*1000,                 //活动消息初次拉取时间间隔
				maxTimeout    : 15*60*1000,              //活动消息最大拉取时间间隔
				factor        : bFast?1:3                //活动消息拉取心跳系数
	        });
        }});
        //底部导航栏新消息提醒
        oAllMsgs.on('change:allNewMsgNum',function(sEvt,oMod,value){
    		var nLast=oAllMsgs._lastAllNewMsgNum||0;
			oAllMsgs._lastAllNewMsgNum=value;
    		if(value>nLast){
		        var oContactTabBtn=$V.get('mainFooterTab').find('[dataMod=m.contact.Contact] Button')[0];
	        	if(!oContactTabBtn.get('isActive')){
		        	oContactTabBtn.set('markType','red');
	        	}
    		}
        });
	}
	/**
	 * 拉取消息
	 * @param {object}oCollection 消息集合对象
	 * @param {string}sTimeProp gUser里对应的时间属性名
	 * @param {object}oFactor 心跳因子
	 */
	function fPullMsg(oCollection,sTimeProp,oFactor){
		var me=this;
		var timer,timeout;
		var sLastFetchTime=gUser.get(sTimeProp);
		//@param {boolean=}bPull 是否拉取消息，不为true时，仅开启定时器
		var _fPull=function(bPull){
			if(bPull){
				oCollection.fetch({
					showLoading:false,
					data:{
			    		newTime:sLastFetchTime
			        },beforeSet:function(oModel,oData,oOptions){
			        	//新消息添加到集合
			        	var nLength=oData.length;
			        	if(nLength>0){
				        	//重置定时器时间
				        	timeout=0;
				        	clearTimeout(timer);
				        	_fPull();
			        	}
			        },
			        success:function(){
				        //更新时间(这样设置的话：新消息时间是在sLastFetchTime和服务器查询时间之间时，下次查询还会包含该消息)
				        gUser.set(sTimeProp,sLastFetchTime,{silent:true});
			        }
		        });
		        sLastFetchTime=Dat.now(true);
			}
			timeout=timeout||oFactor.startTimeout;
	        timer=setTimeout(function(){
	        	_fPull(true);
	        },timeout);
	        //根据心跳系数计算下次拉取时间间隔
	        var nTimeout=timeout*oFactor.factor;
	        //不能超过最大时间间隔
	        timeout=nTimeout>oFactor.maxTimeout?oFactor.maxTimeout:nTimeout;
		}
		_fPull();
	}
	/**
	 * 搜索群组
	 * @param {function}fCall 回调函数
	 * @param {function}fCancel 取消按钮回调
	 * @param {object}oSettings 对话框设置{
	 *    {jEl}renderTo:渲染节点,
	 * }
	 */
	function fSearchGroup(fOk,fCancel,oSettings){
		var oGroup;
		oSettings=oSettings||{};
		var oParams={
			contentMsg:'请输入群组号码',
			items:{
				xtype:'Input',
				xrole:'dialog-content',
				items:{
					xtype:'Button',
					radius:'big',
					items:{
						xtype:"Icon",
						name:'search'
					},
					click:function(){
						var oInput=this.parent;
						if(oInput.valid()){
							oGroup=Group.get({id:oInput.val()});
							oGroup.fetch({beforeSet:function(m, data){
								if(!data){
									$C.Tips({text:'此id不存在',theme:'error'});
									return false;
								}
								oGroup.setDirty();
							},success:function(){
								oDialog.remove('.groupView');
								oDialog.add({
									xtype:GroupView,
									cClass:'groupView',
									xrole:'dialog-content',
									model:oGroup
								});
							}});
						}
					}
				},
				validator:{
					rules:{
						required:true,
						number:true
					},
					name:'群组id'
				}
			},
			okCall:function(){
				fOk(oGroup);
			},
			cancelCall:fCancel
		};
		Obj.extend(oParams,oSettings);
		var oDialog=$C.Dialog(oParams);
	}
	/**
	 * 检查是否登录，未登录弹窗提示
	 * @return {boolean} true表示已登录，false表示未登录
	 */
	function fChkLogin(){
		if(gUid){
			return true;
		}
		new $C.Dialog({
			title:'您未登录',
			contentMsg:'需要登录才能继续操作。',
			activeBtn:2,
			okTxt:'去登录',
			okCall:function(){
				var sUrl=$M.getSafeUrl();
				sUrl=Url.setHash('login',sUrl);
				location.href=sUrl;
				//如果href未改变(设置后跟设置前一样)，强制跳转
				setTimeout(function(){
					location.reload();
				},50);
			}
		});
		return false;
	}
	/**
	 * 获取分享的url
	 * @return 返回安全的的能分享的url
	 */
	function fGetShareUrl(){
		var sSafeUrl=$M.getSafeUrl();
		var sQuery=Url.getQuery(sSafeUrl);
		return gServer+"index.do?"+sQuery;
	}
	
	return Common;
});