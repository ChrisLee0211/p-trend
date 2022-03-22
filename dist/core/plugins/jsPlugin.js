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
exports.jsPlugin = void 0;
const swcParser_1 = require("../praser/swcParser");
/**
 * 用于解析js、ts类型文件的引用（包含jsx和tsx）
 */
exports.jsPlugin = {
    rule: /\.(js|jsx|ts|tsx)$/,
    exclude: /\.(d.ts)$/,
    collector: (code) => __awaiter(void 0, void 0, void 0, function* () {
        if (!code)
            return [];
        const result = yield swcParser_1.scanImportDeclaration(code);
        return result;
    })
};
