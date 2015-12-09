//应用初始化
define('com.sport.Config',
[
'L.Browser',
'L.Json',
'L.Debug',
'L.Loader'
],
function(Browser,Json,Debug,Loader){
	
	var Config={
		init            : fInit        //初始化
	}
	
	/**
	 * 初始化
	 * @method init
	 */
	function fInit(){
		
		//项目命名空间别名
		$H.alias({
			's':'com.sport',
			'm':'com.sport.module',
			'cm':'com.sport.common',
			'md':'com.sport.model',
			'cl':'com.sport.collection',
			'i':'com.sport.interface'
		});
		
		//Loader及Debug配置
		//命名空间根url
		Loader.rootPath={
			'handyRoot'    : gHandyUrl,
			'handy'        : gHandyUrl+'js/',
			'com.sport'    : gSportAppUrl+'js/'
		}
		if(gIsMin){
			Loader.isMin=true;
		}
		//日志相关配置
		if(gEnv=="dev"){
			//开发环境开启日志
			//Loader.traceLog=false;
		}
		//线上环境只保留error日志，发送给服务器
		Debug.debugLog=function(oVar){
			require('md.Feedback',function(Feedback){
				var oFb=Feedback.get();
				var sContent=oVar.message?oVar.message:Json.stringify(oVar);
				oFb.save({
					content:sContent,
					type:1,
					ua:(gIsPg?'[phonegap] ':'')+navigator.userAgent,
					userId:gUser.get('id')
				},{
					success:function(){
						return false;
					}
				});
			});
		}
		
		//资源配置
		Loader.sourceMap={
			'KindEditor' : {
				url:gSportAppUrl+'lib/kindeditor/kindeditor.js',
				chkExist : function(){
					return !!window.KindEditor;
				}
			}
		}
		
	}
	
	Config.init();
	
	return Config;
});