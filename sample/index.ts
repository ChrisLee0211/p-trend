import { ScanerCtr } from "../src/core/scaner";
import { PraserCtr } from '../src/core/praser';
import { Server } from '../src/server';
import { resolveExternals, resolvePackage } from "../src/core/helper/resolvePackage";
import { log } from '../src/utils/log';
import * as path from 'path';
import { scanFolder, readFileBasicInfo } from "../src/utils/file";

const defaultConfig = {
    entry:'src/',
    port:8080,
    externals:{},
    alias: {
        '@':'src'
    },
};

const test = async () => {
    try{
        /** 解析外部依赖 */
        const externals:string[] = [];
        if(defaultConfig?.externals) {
            externals.push(...resolveExternals(defaultConfig.externals));
        }
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
};

test();