import * as fs from "fs";
import * as path from "path";
/**
 * 判断一个文件是否已经在当前目录下存在
 * @param path 文件路径
 * @author chris lee
 * @Time 2020/11/23
 */
export function checkFileIsBuilt(path:string):Promise<boolean>{
    return new Promise((resolve, reject) => {
        try{
            fs.access(path, fs.constants.F_OK, (err)=>{
                if(!err){
                    resolve(true);
                }else{
                    resolve(false);
                }
            });
        }catch(e){
            console.error(e);
            reject(e);
        }
    });
}

/**
 * 在当前目录创建一个文件夹
 * @param name 文件名
 * @author chris lee
 * @Time 2021/01/14
 */
export async function createFolder(name:string):Promise<string>{
    const curPath = process.cwd();
    const folderPath = path.join(curPath, name);
    return new Promise((resolve, reject) => {
        try{
            fs.mkdir(folderPath, {recursive:true}, (err) => {
                if(!err){
                    resolve(folderPath);
                }
            });
        }catch(e){
            reject(e);
            console.error(e);
        }
    });
}

/**
 * 异步读取文件内容
 * @param path 文件路径
 * @param opts encoding：返回内容编码类型，默认为null，即为buffer
 * @param opts flag: 文件系统标志
 * @returns {Buffer}
 * @author chrislee
 * @Time 2021/01/14
 */
export async function readFileContent(path:string,opt?:{encoding:BufferEncoding, flag?:string}):Promise<Buffer|string> {
    return new Promise((resolve, reject) => {
        try{
            fs.readFile(path, opt, (err, data) => {
                if(!err){
                    resolve(data);
                }
            });
        }catch(e){
            reject(e);
            console.error(e);
        }
    });
}

/**
 * 扫描一个路径下的所有文件夹并返回一个文件夹名称数组
 * @param path 扫描路径
 * @returns {Array}
 * @author chris lee
 * @TIme 2020/01/14
 */
export async function scanFolder(path:string):Promise<fs.Dirent[]> {
    return new Promise((resolve, reject) => {
        try{
            fs.readdir(path, {withFileTypes:true}, (err, files)=>{
                if(!err){
                    resolve(files);
                }else{
                    reject(err);
                }
            });
        }catch(e){
            reject(e);
            console.error(e);
        }
    });
}

/**
 * 删除指定文件
 * @param {string} path 文件名(包含路径)
 * @returns {boolean}
 * @author chris lee
 * @Time 2021/01/28
 */
export async function removeFile(path):Promise<boolean> {
    return new Promise((resolve, reject) => {
        try{
            fs.unlink(path, (err) => {
                if(!err){
                    resolve(true);
                }else{
                    resolve(false);
                }
            });
        }catch(e){
            reject(e);
        }
    });
}

/**
 * 在指定目录下创建文件
 * @param {string} path 路径
 * @param {string} fileName 文件名
 * @param {any} content 内容
 * @author chris lee
 * @Time 2021/02/12
 */
export async function createFile(filePath:string, fileName:string, content:any):Promise<void> {
    return new Promise((resolve, reject) => {
        try{
            fs.writeFile(path.join(filePath, fileName), content, (err) => {
                if(!err){
                    resolve();
                }else{
                    reject(err);
                }
            });
        }catch(e){
            reject(e);
        }
    });
}

/**
 * 读取一个文件的基本信息，包括大小、创建时间、更新时间
 * @param filePath 文件路径
 * @returns {size,ctime,mtime}
 * @author chris lee
 * @Time 2021/07/25
 */
export async function readFileBasicInfo(filePath:string):Promise<{size:number,ctime:Date,mtime:Date}> {
    return new Promise((resolve,reject) => {
        try{
            fs.stat(filePath,(err,stats) => {
                if(!err){
                    resolve({
                        size:stats.size,
                        ctime:stats.ctime,
                        mtime:stats.mtime
                    });
                }else{
                    reject(err);
                }
            });
        }catch(e) {
            reject(e);
        }
    });
}