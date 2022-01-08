"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SWCVisitor = void 0;
const Visitor_js_1 = require("@swc/core/Visitor.js");
class SWCVisitor extends Visitor_js_1.Visitor {
    constructor(cb) {
        super();
        if (cb) {
            this.collectFn = cb;
        }
        this.getFirstArgsValue = this.getFirstArgsValue.bind(this);
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
    visitModule(m) {
        var _a;
        const importContent = m.body;
        if (importContent.length) {
            let path = '';
            const importNode = importContent[0];
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
        return m;
    }
}
exports.SWCVisitor = SWCVisitor;
