#!/usr/bin/env node

var fs = require('fs'); 
var rootdir = process.argv[2];
var platform=process.env.CORDOVA_PLATFORMS;
var prifix="Hook before compile,remove: ";

function rm(path,except) {
    if( fs.existsSync(path) ) {
	    var files = [];
    	if(fs.statSync(path).isDirectory()){
	        files = fs.readdirSync(path);
	        var bHasChild;
	        files.forEach(function(file,index){
	            var curPath = path + "/" + file;
	            if(fs.statSync(curPath).isDirectory()) { 
	            	// recurse
	                rm(curPath);
	            } else {
	            	// delete file
	            	if(!except||!except(curPath)){
		                fs.unlinkSync(curPath);
				        console.log(prifix+curPath);
	            	}else{
	            		bHasChild=true;
	            	}
	            }
	        });
	        if(!bHasChild){
		        fs.rmdirSync(path);
		        console.log(prifix+path);
	        }
    	}else{
    		fs.unlinkSync(path);
    		console.log(prifix+path);
    	}
    }
};

//打包前清除无用的本地文件
if(platform.indexOf('android')>-1){
	var wwwPath=rootdir+"/platforms/android/assets/www";
	rm(wwwPath+"/css",function(curPath){
		return curPath.indexOf('appinit.')>0;
	});
	rm(wwwPath+"/js",function(curPath){
		return curPath.indexOf('AppInit.')>0;
	});
	rm(wwwPath+"/lib");
	rm(wwwPath+"/config_orig.xml");
	rm(wwwPath+"/index_orig.html");
}

