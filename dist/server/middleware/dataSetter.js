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
exports.dataSetter = void 0;
const path = require("path");
const file_1 = require("../../utils/file");
exports.dataSetter = (scaner, entry, port) => {
    return (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
        const mainfest = {
            index: '',
            vendor: '',
            css: ''
        };
        const clientDistPath = path.join(__dirname, '../../../client/dist/assets/');
        try {
            const files = yield file_1.scanFolder(clientDistPath);
            const len = files.length;
            for (let i = 0; i < len; i++) {
                const fileName = files[i].name;
                if (path.extname(fileName) === '.js') {
                    if (fileName.split('.').includes('index')) {
                        mainfest.index = fileName;
                    }
                    if (fileName.split('.').includes('vendor')) {
                        mainfest.vendor = fileName;
                    }
                }
                if (path.extname(fileName) === '.css') {
                    mainfest.css = fileName;
                }
            }
        }
        catch (e) {
            console.error(e);
        }
        ctx.state.scaner = scaner;
        ctx.state.entry = entry;
        ctx.state.port = port;
        ctx.state.mainfest = mainfest;
        yield next();
    });
};
