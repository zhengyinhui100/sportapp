#!/usr/bin/env node

//Android build拷贝修改后的cordova文件，修复Android4.04上（cordova 4.1.3+android@3.6.4），插件org.apache.cordova.network-information导致deviceready事件不触发
var fs = require('fs'); 
var rootdir = process.argv[2];
var platform=process.env.CORDOVA_PLATFORMS;
if(platform.indexOf('android')>-1){
	var prifix="Hook after platform add: ";
	var source=rootdir+'/resources/cordova.js';
	var destination=rootdir+'/platforms/android/platform_www/cordova.js';
	var content=fs.readFileSync(source);
	fs.writeFileSync(destination,content);
	
	console.log(prifix+source+" copy to "+destination);
}