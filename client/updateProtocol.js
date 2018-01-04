/**
 * 拷贝server端的prototype文件夹到src/application目录
 */
let fs = require('fs');
let stat=fs.stat;
let path = require('path');
let exportReg = /.*export.*default.*/g;
let importReg = /.*import.*from.*/g;
let blankReg = /^(\s*)\r\n/g;
let copy=function(src,dst){
    //读取目录
    fs.readdir(src,function(err,paths){
        if(err){
            throw err;
        }
        paths.forEach(function(path){
            let _src=src+'/'+path;
            let _dst=dst+'/'+path;
            let readable;
            let writable;
            stat(_src,function(err,st){
                if(err){
                    throw err;
                }
                
                if(st.isFile()){
                    fs.readFile(_src, 'utf8', function(err, data){
                        let a = data.replace(exportReg, '').replace(importReg, '').replace(blankReg, '');
                        fs.writeFile(_dst, a, function(err, data) {
                            console.log(_dst);
                        } );
                    });
                }else if(st.isDirectory()){
                    travel(_src,_dst,copy);
                }
            });
        });
    });
}

let travel=function(src,dst,callback){
    deleteFolder(dst);
    //测试某个路径下文件是否存在
    fs.exists(dst,function(exists){
        if(exists){//存在
            callback(src,dst);
        }else{//不存在
            fs.mkdir(dst,function(){//创建目录
                callback(src,dst)
            })
        }
    })
}

function deleteFolder(path) {
    let files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            let curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolder(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}

let src = path.join(process.cwd(), '../server/protocol');
let dest = process.cwd() + '/src/application/protocol';
travel(src,dest,copy)
