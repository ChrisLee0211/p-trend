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
exports.scanImportDeclaration = exports.SWCVisitor = void 0;
const Visitor_1 = require("@swc/core/Visitor");
const core_1 = require("@swc/core");
class SWCVisitor extends Visitor_1.Visitor {
    constructor(cb) {
        super();
        if (cb) {
            this.collectFn = cb;
        }
        this.getFirstArgsValue = this.getFirstArgsValue.bind(this);
        this.collectModulePath = this.collectModulePath.bind(this);
    }
    getFirstArgsValue(args) {
        let path = '';
        if (args && args.length) {
            const firstArg = args[0];
            if (firstArg.expression.type === 'StringLiteral') {
                path = firstArg.expression.value;
            }
        }
        return path;
    }
    collectModulePath(moduleItem) {
        var _a;
        let path = '';
        const importNode = moduleItem;
        if (importNode.type === 'ImportDeclaration') {
            const source = importNode.source;
            path = source.value;
        }
        if (importNode.type === 'VariableDeclaration') {
            const declareSouce = importNode.declarations;
            if (declareSouce.length) {
                const target = declareSouce[0];
                if (target.type === 'VariableDeclarator' && ((_a = target.init) === null || _a === void 0 ? void 0 : _a.type) === 'CallExpression') {
                    if (target.init.callee.type === 'Identifier' && target.init.callee.value === 'require') {
                        const args = target.init.arguments;
                        path = this.getFirstArgsValue(args);
                    }
                }
            }
        }
        if (importNode.type === 'ExpressionStatement') {
            const expression = importNode.expression;
            if (expression.type === 'CallExpression' && expression.callee.type === 'Identifier' && expression.callee.value === 'require') {
                const args = expression.arguments;
                path = this.getFirstArgsValue(args);
            }
        }
        if (this.collectFn && path.length > 0) {
            this.collectFn(path);
        }
    }
    visitModule(m) {
        const importContents = m.body;
        if (importContents.length) {
            const modulesQuantity = importContents.length;
            for (let i = 0; i < modulesQuantity; i++) {
                this.collectModulePath(importContents[i]);
            }
        }
        return m;
    }
}
exports.SWCVisitor = SWCVisitor;
/**
 * 解析代码块并抽取出内部依赖
 * @param code 代码块
 * @returns
 * @author chris lee
 * @Time 2022/01/29
 */
exports.scanImportDeclaration = (code) => __awaiter(void 0, void 0, void 0, function* () {
    const result = [];
    const collectPath = (path) => {
        result.push(path);
    };
    const prasePlugin = new SWCVisitor(collectPath);
    yield core_1.transform(code, {
        plugin: (m) => prasePlugin.visitProgram(m),
        jsc: {
            parser: {
                syntax: 'typescript',
                tsx: true,
            },
        }
    });
    return result;
});
