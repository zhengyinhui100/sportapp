/**
 * 话题集合
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("cl.Topics",
['D.Collection','md.Topic'],
function(Collection,Topic){
	
	var Topics=Collection.derive({
		url         : '/newTopics',
		model       : Topic,
		comparator  : 'createTime',
		desc        : true
	});
	
	return Topics;
	
});