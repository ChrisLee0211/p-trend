"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const filterFileNodes = (nodes, page, pageSize, query) => {
    const result = {
        list: [],
        total: 0,
    };
    if (!nodes || !nodes.length)
        return result;
    let list = [];
    if (!query) {
        list = nodes;
    }
    else {
        const hasName = Reflect.has(query, 'name') && query.name !== '';
        const hasCtime = Reflect.has(query, 'ctime');
        const hasUtime = Reflect.has(query, 'utime');
        list = nodes;
        try {
            if (hasName) {
                list = list.filter((node) => {
                    const reg = new RegExp(query.name);
                    return reg.test(node.name) || reg.test(node.path);
                });
            }
            if (hasCtime) {
                list = list.filter((node) => {
                    const timestamp = Number(node.ctime);
                    const ctime = query.ctime;
                    return ctime[0] < timestamp && ctime[1] >= timestamp;
                });
            }
            if (hasUtime) {
                list = list.filter((node) => {
                    const timestamp = Number(node.utime);
                    const utime = query.utime;
                    return utime[0] < timestamp && utime[1] >= timestamp;
                });
            }
        }
        catch (e) {
            console.error(e);
        }
        result.total = list.length;
        if (list.length <= pageSize) {
            result.list = list;
        }
        else {
            result.list = list.slice((page - 1) * pageSize, page * pageSize);
        }
    }
    return result;
};
class TableService {
    getTableData(ctx, next) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const scaner = ctx.state.scaner;
            const query = ctx.query;
            const page = Number((_a = query === null || query === void 0 ? void 0 : query.page) !== null && _a !== void 0 ? _a : 1);
            const name = query === null || query === void 0 ? void 0 : query.name;
            const ctimeStart = query === null || query === void 0 ? void 0 : query.ctimeStart;
            const ctimeEnd = query === null || query === void 0 ? void 0 : query.ctimeEnd;
            const utimeStart = query === null || query === void 0 ? void 0 : query.utimeStart;
            const utimeEnd = query === null || query === void 0 ? void 0 : query.utimeEnd;
            const pageSize = Number((_b = query === null || query === void 0 ? void 0 : query.PageSize) !== null && _b !== void 0 ? _b : 10);
            const searchParam = {};
            if (name && name !== '') {
                searchParam['name'] = name;
            }
            if (ctimeStart && ctimeEnd) {
                searchParam['ctime'] = [Number(ctimeStart), Number(ctimeEnd)];
            }
            if (utimeStart && utimeEnd) {
                searchParam['ctime'] = [Number(utimeStart), Number(utimeEnd)];
            }
            const fileNodes = scaner.fileNodes;
            const result = filterFileNodes(fileNodes, page, pageSize, searchParam);
            ctx.response.body = {
                data: result.list,
                page,
                pageSize,
                total: result.total,
            };
            yield next();
        });
    }
    removeFile(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = false;
            const targetPath = ctx.request.body.path;
            try {
                // 需要在扫码器实例内删除，不然再请求一样会在内存中返回已删除的节点
                const scaner = ctx.state.scaner;
                result = yield scaner.removeFileNode(targetPath);
            }
            catch (e) {
                console.error(e);
            }
            ctx.response.body = {
                result,
            };
            yield next();
        });
    }
}
exports.default = new TableService();
