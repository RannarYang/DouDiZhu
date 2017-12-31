/**
 * 拷贝server端的prototype文件夹到src/application目录
 */
let fs = require('fs');
let stat=fs.stat;
let path = require('path');
let copy=function(src,dst){
    //读取目录
    fs.readdir(src,function(err,paths){
        console.log(paths)
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
                    readable=fs.createReadStream(_src);//创建读取流
                    writable=fs.createWriteStream(_dst);//创建写入流
                    readable.pipe(writable);
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
