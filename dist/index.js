#!/usr/bin/env node
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
const program = require("commander");
const path_1 = require("./utils/path");
const file_1 = require("./utils/file");
const configLoader_1 = require("./configLoader");
const praser_1 = require("./core/praser");
const scaner_1 = require("./core/scaner");
const server_1 = require("./server");
const log_1 = require("./utils/log");
const resolvePackage_1 = require("./core/helper/resolvePackage");
program.version("1.0.0");
program
    .command("analyst")
    .option("-e --entry <entryPath>")
    .option("-c --config <config>", "service config")
    .option("-p --port <port>", "service port")
    .action((name, cmd) => __awaiter(void 0, void 0, void 0, function* () {
    log_1.log('正在初始化......', 'success');
    const commandOptions = Object.keys(cmd._optionValues);
    let defaultConfig = {
        entry: './',
        port: 8080
    };
    if (path_1.checkPathIsUseful('p-trend.config.js')) {
        try {
            const fullPath = path_1.concatPath(path_1.getCurrentPath(), 'p-trend.config.js');
            const isExist = yield file_1.checkFileIsBuilt(fullPath);
            if (isExist) {
                const config = yield configLoader_1.configLoader(fullPath);
                defaultConfig = Object.assign(Object.assign({}, defaultConfig), config);
            }
        }
        catch (e) {
            console.error(e);
        }
    }
    if (commandOptions.includes('config')) {
        const configPath = cmd._optionValues.config;
        if (path_1.checkPathIsUseful(configPath)) {
            try {
                const fullPath = path_1.concatPath(path_1.getCurrentPath(), configPath);
                const isExist = yield file_1.checkFileIsBuilt(fullPath);
                if (!isExist) {
                    throw new Error(`Can not find plugin conifg file by wrong path, please check if is correct`);
                }
                const config = yield configLoader_1.configLoader(fullPath);
                defaultConfig = Object.assign(Object.assign({}, defaultConfig), config);
            }
            catch (e) {
                console.error(e);
            }
        }
        else {
            throw new Error(`Can not find conifg file by wrong path, please check if is correct`);
        }
    }
    if (commandOptions.includes('entry')) {
        defaultConfig.entry = cmd._optionValues.entry;
    }
    if (commandOptions.includes('port')) {
        defaultConfig.port = cmd._optionValues.port;
    }
    log_1.log('开始扫描项目', 'warning');
    try {
        /** 解析外部依赖 */
        const externals = [];
        if (defaultConfig === null || defaultConfig === void 0 ? void 0 : defaultConfig.externals) {
            externals.push(...resolvePackage_1.resolveExternals(defaultConfig.externals));
        }
        /** 解析npm依赖 */
        const npmDependency = [];
        try {
            const packageDeps = yield resolvePackage_1.resolvePackage();
            npmDependency.push(...packageDeps);
        }
        catch (e) {
            console.error(e);
        }
        const praser = new praser_1.PraserCtr(defaultConfig.alias, npmDependency, externals);
        const scaner = new scaner_1.ScanerCtr(defaultConfig.entry);
        yield scaner.scan(praser.parseDependency, praser);
        yield scaner.buildFileTree();
        scaner.diff();
        new server_1.Server(scaner, defaultConfig.entry, defaultConfig.port);
        log_1.log(`完成扫描，请打开地址：http://localhost:${defaultConfig.port}/p-trend`, 'success');
    }
    catch (e) {
        console.error(e);
    }
}));
program.parse(process.argv);
exports.default = {
    Scaner: scaner_1.ScanerCtr,
    Parser: praser_1.PraserCtr,
};
//# sourceMappingURL=index.js.map