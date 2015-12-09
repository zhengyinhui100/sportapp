#!/usr/bin/env node

var fs = require('fs'); 
var rootdir = process.argv[2];
var platform=process.env.CORDOVA_PLATFORMS;
var prifix="Hook before platform add: ";

function rm(path) {
    if( fs.existsSync(path) ) {
	    var files = [];
    	if(fs.statSync(path).isDirectory()){
	        files = fs.readdirSync(path);
	        files.forEach(function(file,index){
	            var curPath = path + "/" + file;
	            if(fs.statSync(curPath).isDirectory()) { 
	            	// recurse
	                rm(curPath);
	            } else {
	            	// delete file
	                fs.unlinkSync(curPath);
	                console.log(prifix+curPath);
	            }
	        });
	        fs.rmdirSync(path);
	        console.log(prifix+path);
    	}else{
    		fs.unlinkSync(path);
    		console.log(prifix+path);
    	}
    }
};

//清除build历史
if(platform.indexOf('android')>-1){
	rm(rootdir+"/plugins/android.json");
	rm(rootdir+"/platforms/android");
}else if(platform.indexOf('ios')>-1){
	rm(rootdir+"/plugins/ios.json");
	rm(rootdir+"/platforms/ios");
}
