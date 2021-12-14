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
const stack_1 = require("../../utils/stack");
const path = require("path");
const sort_1 = require("../../utils/sort");
function getFileTreeSizeList(tree) {
    const result = [];
    if (!tree)
        return result;
    const stack = new stack_1.Stack();
    stack.push(tree);
    while (stack.length) {
        const curNode = stack.pop();
        if (curNode.isFolder) {
            if (curNode.fileSize) {
                const data = { fileName: curNode.name, filePath: curNode.path, fileSize: curNode.fileSize };
                result.push(data);
            }
            if (curNode.children.length) {
                for (let i = 0; i < curNode.children.length; i++) {
                    const child = curNode.children[i];
                    stack.push(child);
                }
            }
        }
    }
    return result;
}
function getFileNodeSizeList(nodes) {
    const result = [];
    try {
        for (let i = 0; i < nodes.length; i++) {
            const curNode = nodes[i];
            if (curNode.fileSize) {
                const data = {
                    fileName: curNode.name,
                    filePath: curNode.path,
                    fileSize: curNode.fileSize
                };
                result.push(data);
            }
        }
    }
    catch (e) {
        console.error(e);
    }
    return result;
}
function getFileTypeList(tree) {
    const fileTypeMap = new Map();
    const stack = new stack_1.Stack();
    stack.push(tree);
    try {
        while (stack.length) {
            const curNode = stack.pop();
            if (curNode.isFolder) {
                if (curNode.children.length) {
                    for (let i = 0; i < curNode.children.length; i++) {
                        const child = curNode.children[i];
                        stack.push(child);
                    }
                }
            }
            else {
                const filePath = curNode.path;
                const normalizeExtname = path.extname(filePath);
                const extname = normalizeExtname.length ? normalizeExtname : path.basename(filePath);
                const baseInfo = {
                    fileName: curNode.name,
                    filePath: curNode.path,
                };
                if (fileTypeMap.has(extname)) {
                    const item = fileTypeMap.get(extname);
                    item.num = (item === null || item === void 0 ? void 0 : item.num) + 1;
                    item.list.push(baseInfo);
                    fileTypeMap.set(extname, item);
                }
                else {
                    fileTypeMap.set(extname, { num: 1, list: [baseInfo] });
                }
            }
        }
    }
    catch (e) {
        console.error(e);
    }
    const result = [];
    fileTypeMap.forEach((val, key) => {
        result.push({
            fileType: key,
            num: val.num,
            list: val.list,
        });
    });
    return result;
}
class ChartService {
    getFileNodeSizeChart(ctx, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const query = ctx.query;
            const limit = Number((_a = query === null || query === void 0 ? void 0 : query.limit) !== null && _a !== void 0 ? _a : 10);
            const scaner = ctx.state.scaner;
            const fileTree = scaner.fileTree;
            const fileNodes = scaner.fileNodes;
            const fileTreeSizeChart = getFileTreeSizeList(fileTree);
            const fileNodesSizeChart = getFileNodeSizeList(fileNodes);
            ctx.response.body = {
                tree: fileTreeSizeChart.slice(0, limit),
                nodes: fileNodesSizeChart.slice(0, limit),
                limit,
            };
            yield next();
        });
    }
    getDependenceChart(ctx, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const query = ctx.query;
            const limit = Number((_a = query === null || query === void 0 ? void 0 : query.limit) !== null && _a !== void 0 ? _a : 10);
            const scaner = ctx.state.scaner;
            const fileNodes = scaner.fileNodes.map((curNode) => ({
                fileName: curNode.name,
                filePath: curNode.path,
                deps: curNode.deps,
                depsLength: curNode.deps.length,
            }));
            const sortByDeps = sort_1.sortObject(fileNodes, 'depsLength', 'down').reverse();
            ctx.response.body = {
                nodes: sortByDeps.slice(0, limit),
                allNodes: fileNodes,
                sort: sortByDeps,
                limit
            };
            yield next();
        });
    }
    getReferenceChart(ctx, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const query = ctx.query;
            const limit = Number((_a = query === null || query === void 0 ? void 0 : query.limit) !== null && _a !== void 0 ? _a : 10);
            const scaner = ctx.state.scaner;
            const fileNodes = scaner.dependenceNodes.map((curNode) => ({
                fileName: curNode.name,
                filePath: curNode.path,
                reference: curNode.reference.length
            }));
            ctx.response.body = {
                nodes: fileNodes.slice(0, limit),
                limit
            };
            yield next();
        });
    }
    getTypeChart(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const scaner = ctx.state.scaner;
            const fileTree = scaner.fileTree;
            const fileTypeChartData = getFileTypeList(Object.assign({}, fileTree));
            ctx.response.body = {
                types: fileTypeChartData
            };
            yield next();
        });
    }
}
exports.default = new ChartService();
//# sourceMappingURL=chart.js.map