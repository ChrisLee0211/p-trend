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
const fs = require("fs");
const normalizeNpm = (npmMaps) => {
    const result = [];
    const npmNames = Object.keys(npmMaps);
    if (npmNames.length) {
        const len = npmNames.length;
        for (let i = 0; i < len; i++) {
            const key = npmNames[i];
            const npm = npmMaps[key];
            result.push(Object.assign(Object.assign({}, npm), { name: key }));
        }
    }
    return result;
};
class PkgService {
    getPackageList(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const scaner = ctx.state.scaner;
            const entry = ctx.state.entry;
            const result = normalizeNpm(scaner.npmDepsMap);
            ctx.response.body = {
                deps: result,
                entry: entry
            };
            yield next();
        });
    }
    readReferenceFile(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = ctx.request.body.path;
            try {
                const fileBuffer = fs.createReadStream(filePath);
                ctx.response.body = fileBuffer;
            }
            catch (e) {
                ctx.response.status = 500;
            }
            finally {
                yield next();
            }
        });
    }
}
exports.default = new PkgService();
