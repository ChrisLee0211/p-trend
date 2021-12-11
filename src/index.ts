#!/usr/bin/env node

import * as program from "commander";
import {checkPathIsUseful,concatPath,getCurrentPath} from './utils/path';
import {checkFileIsBuilt} from './utils/file';
import {configLoader} from './configLoader';
import {PraserCtr} from './core/praser';
import {ScanerCtr} from './core/scaner';
import {Server} from './server';
import { Config } from "./types/global";
import { log } from './utils/log';
import {resolveExternals, resolvePackage} from './core/helper/resolvePackage';
program.version("1.0.0");

program
    .command("analyst")
    .option("-e --entry <entryPath>")
    .option("-c --config <config>", "service config")
    .option("-p --port <port>", "service port")
    .action(async(name,cmd) => {
        log('正在初始化......', 'success');
        const commandOptions = Object.keys(cmd._optionValues);
        let defaultConfig:Config = {
            entry:'./',
            port:8080
        };
        if (checkPathIsUseful('p-trend.config.js')) {
            try{
                const fullPath = concatPath(getCurrentPath(),'p-trend.config.js');
                const isExist = await checkFileIsBuilt(fullPath);
                if(isExist){
                    const config = await configLoader(fullPath);
                    defaultConfig = {...defaultConfig, ...config};
                }
            }catch(e){
                console.error(e);
            }
        }
        if(commandOptions.includes('config')) {
            const configPath = cmd._optionValues.config as string;
            if (checkPathIsUseful(configPath)) {
                try{
                    const fullPath = concatPath(getCurrentPath(),configPath);
                    const isExist = await checkFileIsBuilt(fullPath);
                    if(!isExist){
                        throw new Error(`Can not find plugin conifg file by wrong path, please check if is correct`);
                    }
                    const config = await configLoader(fullPath);
                    defaultConfig = {...defaultConfig, ...config};
                }catch(e){
                    console.error(e);
                }
            }else {
                throw new Error(`Can not find conifg file by wrong path, please check if is correct`);
            }
        }
        if(commandOptions.includes('entry')) {
            defaultConfig.entry = cmd._optionValues.entry;
        }
        if(commandOptions.includes('port')) {
            defaultConfig.port = cmd._optionValues.port;
        }
        log('开始扫描项目','warning');
        try{
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