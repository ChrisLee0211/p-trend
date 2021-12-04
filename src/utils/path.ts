import * as path from "path";


export const getCurrentPath = ():string => {
    return process.cwd();
};

/**
 * 拼接文件到当前路径
 * @param currentPath 当前路径
 * @param name 文件名
 * @returns {string}
 * @author chris lee
 * @Time 2021/02/08
 */
export const concatPath = (currentPath, name) => {
    return path.join(currentPath, name);
};

/**
 * 校验路径是否可用
 * @param path 路径
 * @returns {boolean}
 * @author chris lee
 * @Time 2021/02/08
 */
export const checkPathIsUseful = (path:string|undefined): path is string => {
    if(path === "" || !path) return false;
    return true;
};

/**
 * 获取当前路径的根路径
 * @param pathname 路径
 * @returns {boolean}
 * @author chris lee
 * @Time 2021/02/08
 */
export const parseRootPath = (pathname:string) => {
    return path.parse(pathname).root;
};

/**
 * 检测当前路径的文件后缀名是否符合指定类型
 * @param pathname 路径
 * @param matchs 后缀名类型
 * @returns {boolean}
 * @author chris lee
 * @Time 2021/06/24
 */
export const checkFileType = (pathname:string, matchs:string[]):boolean=>{
    return matchs.includes(path.extname(pathname));
};
