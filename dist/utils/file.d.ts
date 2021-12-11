/// <reference types="node" />
import * as fs from "fs";
/**
 * 判断一个文件是否已经在当前目录下存在
 * @param path 文件路径
 * @author chris lee
 * @Time 2020/11/23
 */
export declare function checkFileIsBuilt(path: string): Promise<boolean>;
/**
 * 在当前目录创建一个文件夹
 * @param name 文件名
 * @author chris lee
 * @Time 2021/01/14
 */
export declare function createFolder(name: string): Promise<string>;
/**
 * 异步读取文件内容
 * @param path 文件路径
 * @param opts encoding：返回内容编码类型，默认为null，即为buffer
 * @param opts flag: 文件系统标志
 * @returns {Buffer}
 * @author chrislee
 * @Time 2021/01/14
 */
export declare function readFileContent(path: string, opt?: {
    encoding: BufferEncoding;
    flag?: string;
}): Promise<Buffer | string>;
/**
 * 扫描一个路径下的所有文件夹并返回一个文件夹名称数组
 * @param path 扫描路径
 * @returns {Array}
 * @author chris lee
 * @TIme 2020/01/14
 */
export declare function scanFolder(path: string): Promise<fs.Dirent[]>;
/**
 * 删除指定文件
 * @param {string} path 文件名(包含路径)
 * @returns {boolean}
 * @author chris lee
 * @Time 2021/01/28
 */
export declare function removeFile(path: any): Promise<boolean>;
/**
 * 在指定目录下创建文件
 * @param {string} path 路径
 * @param {string} fileName 文件名
 * @param {any} content 内容
 * @author chris lee
 * @Time 2021/02/12
 */
export declare function createFile(filePath: string, fileName: string, content: any): Promise<void>;
/**
 * 读取一个文件的基本信息，包括大小、创建时间、更新时间
 * @param filePath 文件路径
 * @returns {size,ctime,mtime}
 * @author chris lee
 * @Time 2021/07/25
 */
export declare function readFileBasicInfo(filePath: string): Promise<{
    size: number;
    ctime: Date;
    mtime: Date;
}>;
