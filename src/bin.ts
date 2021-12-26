#!/usr/bin/env node

import * as program from "commander";
import {normalizeConfig} from './configLoader';
import {PraserCtr} from './core/praser';
import {ScanerCtr} from './core/scaner';
import {Server} from './server';
import { Config } from "./types/global";
import { log } from './utils/log';
import {resolveExternals, resolvePackage} from './core/helper/resolvePackage';
program.version("1.0.0");

program
    .option("-e --entry <entryPath>", "解析入口路径，默认为'./'")
    .option("-c --config <config>", "配置文件路径, 默认不使用配置文件")
    .option("-p --port <port>", "服务端口，默认为8080")
    .action(async(name,cmd) => {
        log('正在初始化......', 'success');
        let defaultConfig:Config = {
            entry:'./',
            port:8080
        };
        try{
            /** 解析默认配置 */
            defaultConfig = await normalizeConfig(defaultConfig,cmd._optionValues);
            log('开始扫描项目','warning');
            /** 解析外部依赖 */
            const externals:string[] = [];
            if(defaultConfig?.externals) {
                externals.push(...resolveExternals(defaultConfig.externals));
            }
            /** 解析npm依赖 */
            const npmDependency:string[] = [];
            try{
                const packageDeps = await resolvePackage();
                npmDependency.push(...packageDeps);
            }catch(e) {
                console.error(e);
            }
            const praser = new PraserCtr(defaultConfig.alias, npmDependency, externals);
            const scaner = new ScanerCtr(defaultConfig.entry);
            await scaner.scan(praser.parseDependency, praser);
            await scaner.buildFileTree();
            scaner.diff();
            new Server(scaner,defaultConfig.entry, defaultConfig.port);
            log(`完成扫描，请打开地址：http://localhost:${defaultConfig.port}/p-trend`,'success');
        }catch(e){
            console.error(e);
        }
    });

program.parse(process.argv);
