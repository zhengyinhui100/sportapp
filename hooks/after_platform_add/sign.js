#!/usr/bin/env node

//Android build拷贝签名文件
var fs = require('fs'); 
var rootdir = process.argv[2];
var platform=process.env.CORDOVA_PLATFORMS;
if(platform.indexOf('android')>-1){
	var prifix="Hook after platform add: ";
	var source=rootdir+'/resources/ant.properties';
	var destination=rootdir+'/platforms/android/ant.properties';
	var content=fs.readFileSync(source);
	fs.writeFileSync(destination,content);
	
	console.log(prifix+source+" copy to "+destination);
}