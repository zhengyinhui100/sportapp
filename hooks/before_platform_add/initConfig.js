#!/usr/bin/env node

var fs = require('fs'); 
var rootdir = process.argv[2];
var prifix="Hook before build: ";
var cmd=process.env.CORDOVA_CMDLINE;
var platform=process.env.CORDOVA_PLATFORMS;
var wwwRoot=rootdir+"/www/";
var shareDir=rootdir+'/plugins/org.hui.cordova.share/';
var config=fs.readFileSync(rootdir+"/resources/config.json",{encoding:'utf-8'});
config=JSON.parse(config);

if(cmd.indexOf('-test')>0){
	config=config.test;
}else if(cmd.indexOf('-online')>0){
	config=config.online;
}else{
	config=config.dev;
}

function tmpl(content,config){
	content=content.replace(/{%=(((?!%}).)+)%}/g, function(match,$1){
		var result=config[$1];
		if(result){
			if(result.indexOf('{%=')>=0){
				result=config[$1]=tmpl(result,config);
			}
			return result;
		}
		return match;
	});
	return content;
}

function replace(file){
	if(fs.existsSync(file)){
		var content=fs.readFileSync(file,{encoding:'utf-8'});
		content=tmpl(content,config);
		var newFile=file.replace('_orig','');
		console.log(prifix+"replace "+file+" to "+newFile);
		fs.writeFileSync(newFile,content,{encoding:'utf-8'});
	}
}

replace(wwwRoot+'config_orig.xml');
replace(wwwRoot+'index_orig.html');
if(platform.indexOf('android')>-1){
	replace(shareDir+'plugin_orig.xml');
	replace(shareDir+'assets/ShareSDK_orig.xml');
	replace(shareDir+'src/android/WXEntryActivity_orig.java');
	replace(shareDir+'src/android/YXEntryActivity_orig.java');
}