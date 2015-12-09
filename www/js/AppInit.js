//线上环境初始化模块
(function(){
	
	location.href="http://renders.1688.com:6001/page/category.html?memberId=ayisha000";
	
	var AppInit={
		init              : fInit,           //初始化
		ajax              : fAjax,           //ajax请求
		showDialog        : fShowDialog      //显示对话框
	}
	
	function fInit(){
		//断网提示
		if(navigator.connection.type==Connection.NONE){
			AppInit.showDialog({
				title:'无网络连接',
				content:'系统检测到您未连接网络，请连接后点击重试。',
				okTxt:'重试',
				cancelTxt:'退出',
				okCall:function(){
					location.reload();
				},
				cancelCall:function(){
					navigator.app.exitApp();
				}
			});
		}else{
			//请求资源版本号
			AppInit.ajax(
				gServer+'/safeUrl/chkVersion.do',
				function(oResult){
					var oData=oResult.data;
					var sAppVersion=oData.appVersion;
					var sStaticVersion=window.gStaticVersion=oData.staticVersion;
					//app版本升级
					if(gAppVersion<sAppVersion){
						AppInit.showDialog({
							title:'发现新版本：'+sAppVersion,
							content:oData.appIntroduce,
							okTxt:'现在升级',
							cancelTxt:'退出',
							okCall:function(){
								window.open(oData.appUrl, "_system");
								return false;
							},
							cancelCall:function(){
								navigator.app.exitApp();
							}
						});
					}else{
						var sUrl=gStaticServer+"static/"+sStaticVersion+"/sportapp/js/Init.min.js";
						if(gEnv==='dev'){
							sUrl=gStaticServer+"static/sportappDev/js/Init.js";
						}
						var eScript=document.createElement("script");
						eScript.src=sUrl;
						eScript.type="text/javascript";
						var oHead=document.head ||document.getElementsByTagName('head')[0] ||document.documentElement;
						oHead.appendChild(eScript);
					}
				},
				function(error){
					AppInit.showDialog({
						content:'检查新版本出错。',
						okTxt:'重试',
						cancelTxt:'退出',
						okCall:function(){
							location.reload();
						},
						cancelCall:function(){
							navigator.app.exitApp();
						}
					});
				}
			)
		}
	}
	
	function fAjax(sUrl,fCall,fError) {
		var oRequest=new XMLHttpRequest();
		oRequest.open('get',sUrl,true);
		//异步
		oRequest.onreadystatechange = function() {
			if (oRequest.readyState == 4) {
				// 防止内存泄漏
				try{
					oRequest.onreadystatechange = null;
				}catch(exp){
					oRequest.onreadystatechange = function(){};
				}
				try{
					var oResult=eval("("+oRequest.responseText+")");
				}catch(e){
					fError();
				}
				fCall(oResult);
			}
		};
		oRequest.send( null);
	}
	
	function fShowDialog(oParams){
		var sHtml=[
		'<div id="appInitDialog" class="hui-dialog hui-popup hui-shadow-overlay hui-radius-little">',
			'<div class="hui-dialog-header hui-tbar hui-tbar-gray">',
				'<h1 class="hui-tbar-title">',oParams.title||'提示','</h1>',
			'</div>',
			'<div class="hui-dialog-body">',
				'<div class="hui-body-content">',
					'<div class="hui-content-msg">',oParams.content,'</div>',
				'</div>',
				'<div class="hui-body-action">',
					'<div class="hui-radius-little hui-tab hui-tab-border-top">',
						'<div class="hui-tabitem hui-item-first" style="width: 50%">',
							'<a id="appInitcancelBtn" href="javascript:;" hidefocus="true" class="hui-btn-gray hui-btn">',
								'<span class="hui-btn-txt">',oParams.cancelTxt||'取消','</span>',
							'</a>',
						'</div>',
						'<div class="hui-tabitem hui-item-last" style="width: 50%">',
							'<a id="appInitOkBtn" href="javascript:;" hidefocus="true" class="hui-btn-blue hui-btn">',
								'<span class="hui-btn-txt">',oParams.okTxt||'确定','</span>',
							'</a>',
						'</div>',
						'<div class="c-clear"></div>',
					'</div>',
				'</div>',
			'</div>',
		'</div>'
		].join('');
		var oBody=document.body;
		oBody.innerHTML=sHtml;
		var oDialog=document.getElementById('appInitDialog');
		document.getElementById('appInitOkBtn').addEventListener('click',function(){
			if((oParams.okCall&&oParams.okCall())!==false){
				oBody.removeChild(oDialog);
			}
		});
		document.getElementById('appInitcancelBtn').addEventListener('click',function(){
			if((oParams.cancelCall&&oParams.cancelCall())!==false){
				oBody.removeChild(oDialog);
			}
		});
		var width=oDialog.clientWidth;
		var height=oDialog.clientHeight;
		var oDoc=document;
		var x = ((oDoc.documentElement.offsetWidth || oDoc.body.offsetWidth) - width)/2;
		var y = ((oDoc.documentElement.clientHeight || oDoc.body.clientHeight) - height)/2 + (oDoc.documentElement.scrollTop||oDoc.body.scrollTop);
		//稍微偏上显示
		y=y-50;
		y = y < 10 ? window.screen.height/2-200 : y;
		oDialog.style.left=x + "px";
		oDialog.style.top=y + "px";
	}
	
	document.addEventListener("deviceready", function(){
		AppInit.init();
	}, false);	
	
})();