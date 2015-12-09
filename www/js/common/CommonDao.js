/****************************************************************
* Author:		郑银辉											*
* Email:		zhengyinhui100@gmail.com						*
* Created:		2013-01-26										*
*****************************************************************/
/**
 * 项目数据访问对象类，模块可以直接使用此类的方法，也可以通过继承此类实现自己的dao类，dao内的方法只可以使用此类的方法进行数据操作，以便进行统一的管理
 */
define('cm.CommonDao',['B.Object','cm.Common','D.AbstractDao'],function(Obj,Common,AbstractDao){
	
	var CommonDao=AbstractDao.derive({
		parseParam   : fParseParam,  //预处理参数
		showLoading  : fShowLoading, //显示loading提示
		error        : fError,       //项目ajax公用错误逻辑
		success      : fSuccess,     //项目ajax公用成功逻辑
		complete     : fComplete     //项目ajax公用完成逻辑
	});
	/**
	 * 发送前处理
	 * @param {Object}oParams 请求参数
	 * @return {Object} 返回处理好的参数
	 */
	function fParseParam(oParams){
		var sUrl=oParams.url;
		if(sUrl.indexOf(gServer)<0){
			oParams.url=gServer+sUrl;
		}
		var p=Obj.extend({
			type:'post',
			dataType:'json'
		},oParams);
		return p;
	}
	/**
	 * 显示loading提示
	 */
	function fShowLoading(bShow,oParams){
		if(oParams.showLoading!==false){
			Common.showLoading(bShow);
		}
	}
	/**
	 * 项目ajax公用错误逻辑
	 * @method error
	 * @param {Object}oParams
	 * 
	 */
	function fError(XMLHttpRequest, textStatus, errorThrown){
		var me=this;
		new $C.Tips({
			text:'系统繁忙，请稍后再试',
			theme:'error'
		});
		$D.error({
			textStatus:textStatus,
			errorThrown:errorThrown
		});
	}
	/**
	 * 项目ajax公用成功逻辑
	 * @method success
	 * @param {Object}oParams
	 * 
	 */
	function fSuccess(data, textStatus, jqXHR){
//		if(gIsDev){
//			$D.log(data)
//		}
		var sCode=data.code;
		if(sCode&&sCode!='success'){
			if(sCode==="NOT_LOGIN"){
				Common.chkLogin();
				return false;
			}
			new $C.Tips({
				text:data.data,
				theme:'error'
			});
			return false;
		}
	}
	/**
	 * 项目ajax公用完成逻辑
	 */
	function fComplete(oJqXHR,sTextStatus){
		this.callSuper();
		if(sTextStatus=='error'){
			$C.Tips({
				text:'系统繁忙，请稍后再试',
				theme:'error'
			})
		}
	}
	
	return CommonDao;
	
});