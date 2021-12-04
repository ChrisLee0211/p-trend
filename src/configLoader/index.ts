interface Config {
    entry:string,
    port: number,
    alias?:{
        [key:string]:string
    }
}

/**
 *  解析config为配置对象
 * @param {string} configPath 文件地址
 * @author chris lee
 * @Time 2021/06/20
 */
export const configLoader = (configPath:string):Promise<Config> => {
    return new Promise((rs,rj) => {
        import(`${configPath}`).then((res:Config) => {
            rs(res);
        },(err) => {
            rj(err);
        });
    });
};