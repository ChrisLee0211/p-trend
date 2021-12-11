"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticMeddleware = void 0;
const static_ = require("koa-static");
const path = require("path");
exports.StaticMeddleware = () => {
    return static_(path.join(__dirname, '../../../client/dist'), {
        setHeaders(res, path) {
            const pathSplit = path.split('.');
            if (pathSplit.includes('js')) {
                res.setHeader('Content-Type', 'text/javascript');
            }
            if (pathSplit.includes('css')) {
                res.setHeader('Content-Type', 'text/css');
            }
        }
    });
};
//# sourceMappingURL=static.js.map