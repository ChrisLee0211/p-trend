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
const configLoader_1 = require("./configLoader");
const praser_1 = require("./core/praser");
const scaner_1 = require("./core/scaner");
const plugins_1 = require("./core/plugins");
const server_1 = require("./server");
const log_1 = require("./utils/log");
const resolvePackage_1 = require("./core/helper/resolvePackage");
program.version("1.0.0");
program
    .option("-e --entry <entryPath>", "解析入口路径，默认为'./'")
    .option("-c --config <config>", "配置文件路径, 默认不使用配置文件")
    .option("-p --port <port>", "服务端口，默认为8080")
    .action((name, cmd) => __awaiter(void 0, void 0, void 0, function* () {
    log_1.log('正在初始化......', 'success');
    let defaultConfig = {
        entry: './',
        port: 8080
    };
    try {
        /** 解析默认配置 */
        defaultConfig = yield configLoader_1.normalizeConfig(defaultConfig, cmd._optionValues);
        log_1.log('开始扫描项目', 'warning');
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
        const praser = new praser_1.PraserCtr();
        praser.registerPlugins(plugins_1.jsPlugin);
        praser.registerPlugins(plugins_1.vuePlugin);
        const scaner = new scaner_1.ScanerCtr(defaultConfig.entry, defaultConfig.alias, npmDependency, externals);
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
