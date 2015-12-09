/**
 * 群组集合
 * @author 郑银辉(zhengyinhui100@gmail.com)
 * @created 2014-03-18
 */

define("cl.Messages",
['D.Collection','md.Message'],
function(Collection,Message){
	
	var Messages=Collection.derive({
		model       : Message,
		comparator  : 'createTime',
		url         : '/conversation'
	});
	
	return Messages;
});