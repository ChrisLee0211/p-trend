#!/usr/bin/env node

import * as program from "commander";
import {checkPathIsUseful,concatPath,getCurrentPath} from '../src/utils/path';
import {checkFileIsBuilt} from '../src/utils/file';
import {configLoader} from '../src/configLoader';
import {resolveDependencies,resolvePackage} from '../src/core/helper/resolvePackage';
import {PraserCtr} from '../src/core/praser';
import {ScanerCtr} from '../src/core/scaner';
import {Server} from '../src/server';
import {Stack} from '../src/utils/stack';
import * as path from 'path';
import { FileTree } from "../src/types/global";
// program.version("1.0.0")
interface Config {
    entry:string,
    port: number,
    alias?:{
        [key:string]:string
    }
    dependency?:{[key:string]:string}
    packageJsonPath?:string
}

// program
//     .command("analyst")
//     .option("-e --entry <entryPath>")
//     .option("-c --config <config>", "service config")
//     .option("-p --port <port>", "service port")
//     .action(async(name,cmd) => {
//         const commandOptions = Object.keys(cmd);
//         let defaultConfig:Config = {
//             entry:'../src',
//             port:8080
//         }
//         if(commandOptions.includes('entry')) {
//             defaultConfig.entry = cmd.entry
//         }
//         if(commandOptions.includes('port')) {
//             defaultConfig.port = cmd.port
//         }
//         if(commandOptions.includes('config')) {
//             const configPath = cmd.config as string;
//             if (checkPathIsUseful(configPath)) {
//                 try{
//                     const fullPath = concatPath(getCurrentPath(),configPath);
//                     const isExist = await checkFileIsBuilt(fullPath);
//                     if(!isExist){
//                         throw new Error(`Can not find plugin conifg file by wrong path, please check if is correct`)
//                     }
//                     const config = await configLoader(fullPath);
//                     defaultConfig = {...defaultConfig, ...config};
//                 }catch(e){
//                     console.error(e)
//                 }
//             }else {
//                 throw new Error(`Can not find conifg file by wrong path, please check if is correct`)
//             }
//         }
//         const praser = new PraserCtr(defaultConfig.alias);
//                     const scaner = new ScanerCtr(defaultConfig.entry);
//                     await scaner.scan(praser.parseDependency, praser);
//                     const result = scaner.diff();
//                     console.log(result)
//     })

// program.parse(process.argv);

interface FileTypeChartItem {
    fileType: string,
    num: number
}

const ac = async () => {
    const defaultConfig:Config = {
        entry:'src/',
        port:8080,
        alias:{
            "@": 'src'
        },
        packageJsonPath:'package.json'
    };
    function getFileTypeList(tree):FileTypeChartItem[] {
        const fileTypeMap = new Map<string, number>();
        const stack = new Stack();
        stack.push(tree);
        try{
            while(stack.length) {
                const curNode = stack.pop() as FileTree;
                if(curNode.isFolder) {
                    if (curNode.children.length) {
                        for( let i = 0; i< curNode.children.length; i++) {
                            const child = curNode.children[i];
                            stack.push(child);
                        }
                    }
                } else {
                    const filePath = curNode.path;
                    const baseName = path.basename(filePath);
                    if (fileTypeMap.has(baseName)) {
                        const prevNum = fileTypeMap.get(baseName) as number;
                        fileTypeMap.set(baseName, prevNum + 1);
                    }else {
                        fileTypeMap.set(baseName,1);
                    }
                }
            }
        }catch(e){
            console.error(e);
        }
        const result:FileTypeChartItem[] = [];
        fileTypeMap.forEach((val,key) => {
            result.push({
                fileType: key,
                num:val
            });
        });
        return result;
    }
    let npmDependency:string[] = [];
        if (defaultConfig.dependency) {
            npmDependency = resolveDependencies(defaultConfig.dependency);
        } else if(defaultConfig.packageJsonPath) {
            npmDependency = await resolvePackage(defaultConfig.packageJsonPath);
        }
        const praser = new PraserCtr(defaultConfig.alias, npmDependency);
                    const scaner = new ScanerCtr(defaultConfig.entry);
                    await scaner.scan(praser.parseDependency, praser);
                    await scaner.buildFileTree();
                    const result = scaner.diff();
                    const testTrees = getFileTypeList(scaner.fileTree);
                    new Server(scaner,defaultConfig.entry, defaultConfig.port);
};

ac();

