import {readFileContent, checkFileIsBuilt} from '../../utils/file';
import * as path from 'path';

export const resolvePackage =  async () => {
    let deps:string[] = [];
    const packagePath = 'package.json';
    try{
        const isExist = await checkFileIsBuilt(packagePath);
        if (!isExist) return deps;
        const packageJson = await readFileContent(packagePath,{encoding:'utf8'});
        const json = JSON.parse(packageJson as string);
        const dep = json['dependencies'];
        const devDep = json['devDependencies'];
        deps = Object.keys({...dep,...devDep});
    }catch(e){
        console.error(e);
    }
    return deps;
};

export const resolveExternals = (obj:{[key:string]:string}):string[] => {
    return Object.values(obj);
};