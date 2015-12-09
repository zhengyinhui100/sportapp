/**
 * 用户信息集合
 * @author 郑银辉(zhengyinhui100@gmail.com)
 */

define("cl.Users",
['D.Collection','md.User'],
function(Collection,User){
	
	var Users=Collection.derive({
		model       : User,
		url         : '/nearUsers'
	});
	
	return Users;
});