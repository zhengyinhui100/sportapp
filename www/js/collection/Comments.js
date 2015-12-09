/**
 * 评论集合
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("cl.Comments",
['D.Collection','md.Comment'],
function(Collection,Comment){
	
	var Comments=Collection.derive({
		url         : '/comments',
		model       : Comment,
		comparator  : 'createTime',
		desc        : true,
		parse       : fParse
	});
	
	/**
     * 分析处理回调数据，默认直接返回response
     * @param {Object}resp
     */
    function fParse(resp){
    	if(!resp){
    		return;
    	}
    	var aComments;
        if(resp.code){
	        aComments= resp.data;
    	}else{
    		aComments= resp;
    	}
    	var oCache={};
    	for(var i=0,len=aComments.length;i<len;i++){
    		oCache[aComments[i].id]=aComments[i];
    	}
    	for(var i=0,len=aComments.length;i<len;i++){
    		var oComment=aComments[i];
    		var parentId;
    		if(parentId=oComment.parentId){
    			var oParent=oCache[parentId];
    			if(oParent){
    				oComment.parentComment=oParent;
    				oParent.hasChild=true;
    			}
    		}
    	}
    	var aResult=[];
    	for(var i=0,len=aComments.length;i<len;i++){
    		var oComment=aComments[i];
    		if(oComment.hasChild){
    			delete oComment.hasChild;
    		}else{
    			aResult.push(oComment);
    		}
    	}
    	return aResult;
    }
	
	return Comments;
	
});