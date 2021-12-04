import {readFileContent} from '../../utils/file';

export const resolvePackage =  async(path:string):Promise<string[]> => {
    let deps:string[] = [];
    try{
        const packageJson = await readFileContent(path,{encoding:'utf8'});
        const json = JSON.parse(packageJson as string);
        const dep = json['dependencies'];
        const devDep = json['devDependencies'];
        deps = Object.keys({...dep,...devDep});
    }catch(e){
        console.error(e);
    }
    return deps;
};

export const resolveDependencies = (obj:{[key:string]:string}):string[] => {
    return Object.keys(obj);
};