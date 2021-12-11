"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configLoader = void 0;
/**
 *  解析config为配置对象
 * @param {string} configPath 文件地址
 * @author chris lee
 * @Time 2021/06/20
 */
exports.configLoader = (configPath) => {
    return new Promise((rs, rj) => {
        Promise.resolve().then(() => require(`${configPath}`)).then((res) => {
            rs(res);
        }, (err) => {
            rj(err);
        });
    });
};
//# sourceMappingURL=index.js.map