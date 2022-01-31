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
exports.vuePlugin = void 0;
const swcParser_1 = require("../praser/swcParser");
const htmlparser2_1 = require("htmlparser2");
/**
 * 用于vue单文件组件
 */
exports.vuePlugin = {
    rule: /\.(vue)$/,
    collector: (code) => __awaiter(void 0, void 0, void 0, function* () {
        if (!code)
            return [];
        let result = [];
        let isScript = false;
        let scriptCode = '';
        const parser = new htmlparser2_1.Parser({
            onopentag(name) {
                if (name === "script") {
                    isScript = true;
                }
            },
            ontext(text) {
                if (isScript) {
                    scriptCode = text;
                    isScript = false;
                }
            },
            onclosetag(tagname) {
                if (tagname === "script") {
                    isScript = false;
                }
            },
        });
        parser.write(code);
        parser.end();
        if (scriptCode.trim().length) {
            result = yield swcParser_1.scanImportDeclaration(scriptCode);
        }
        return result;
    })
};
