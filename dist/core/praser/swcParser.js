"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SWCVisitor = void 0;
const Visitor_1 = require("@swc/core/Visitor");
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
                    const args = target.init.arguments;
                    path = this.getFirstArgsValue(args);
                }
            }
        }
        if (importNode.type === 'ExpressionStatement') {
            const expression = importNode.expression;
            if (expression.type === 'CallExpression') {
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
