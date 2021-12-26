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
exports.resolveExternals = exports.resolvePackage = void 0;
const file_1 = require("../../utils/file");
exports.resolvePackage = () => __awaiter(void 0, void 0, void 0, function* () {
    let deps = [];
    const packagePath = 'package.json';
    try {
        const isExist = yield file_1.checkFileIsBuilt(packagePath);
        if (!isExist)
            return deps;
        const packageJson = yield file_1.readFileContent(packagePath, { encoding: 'utf8' });
        const json = JSON.parse(packageJson);
        const dep = json['dependencies'];
        const devDep = json['devDependencies'];
        deps = Object.keys(Object.assign(Object.assign({}, dep), devDep));
    }
    catch (e) {
        console.error(e);
    }
    return deps;
});
exports.resolveExternals = (obj) => {
    return Object.values(obj);
};
