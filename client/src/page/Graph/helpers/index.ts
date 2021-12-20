import { breadthFirstSearch } from "@antv/algorithm";
import { GraphData } from "@antv/algorithm/lib/types";
import { TreeGraph, TreeGraphData, Algorithm, Item} from "@antv/g6";

/**
     * 格式化扁平数组为树结构方法，因为每个模块名称有可能相同，所以不能直接作为id，需要随机分配
     * @author chris lee
     * @Time 2021/08/17
     */
export const formatNodesData = (nodes: FileNode[], entry: string):TreeGraphData => {
    const uniqueArray: string[] = [];
    const root: TreeGraphData = { id: entry, children: [], name: entry };
    const target = nodes.map((node, idx) => {
      let result: TreeGraphData = {
        id: node.path,
        children: [],
        name: node.name,
      };
      if (uniqueArray.includes(node.path)) {
        result.id = node.path + `${idx}`;
      } else {
        uniqueArray.push(node.path);
      }
      result = { ...result, ...node };
      if (node.deps.length) {
        result.children = node.deps.map((dep, i) => {
          let item = { id: dep.path, childen: [], name: dep.name };
          if (uniqueArray.includes(dep.path)) {
            item.id = `${Math.random() * 10}` + dep.path;
          } else {
            uniqueArray.push(dep.path);
          }
          item = { ...item, ...dep };
          return item;
        });
      }
      return result;
    });
    if (target.length) {
      root?.children?.push(...target);
    }
    return root;
  };

  /**
   * 格式化当前被依赖节点树
   * @returns 
   */
  export  const formatDepsData = (tree:FileTree, deps:DependenceNode[], entry:string):TreeGraphData=> {
    let treeClone = {...tree};
    try {
       treeClone = JSON.parse(JSON.stringify(tree));
    }catch(e){
      console.error(e);
    }
    const depsMap:Record<string, number> = {};
    for(let i=0;i<deps.length;i++) {
      depsMap[deps[i].moduleId] = i;
    }
    const depsPath = Object.keys(depsMap);
    const root = {
      id: entry, 
      name:treeClone.name, 
      path: treeClone.path,
      isFolder:treeClone.isFolder, 
      children:treeClone.children} as unknown as TreeGraphData;
    const stack = [];
    let level = 0;
    stack.push(root);
    while(stack.length) {
      level = level+1;
      const curNode = stack.pop() as TreeGraphData;
      if (depsPath.includes(curNode.moduleId as string)) {
        const depIndex = depsMap[curNode.moduleId as string];
        const dep = deps[depIndex];
        curNode['fileSize'] = dep.fileSize || 0;
        curNode['ctime'] = dep.ctime;
        curNode['mtime'] = dep.utime;
        curNode['importTimes'] = dep?.reference?.length;
        curNode['isDep'] = true;
      }
     if(curNode?.children?.length) {
       for( let i = 0; i < curNode.children.length; i++) {
        const child = curNode.children[i];
        child.id = `${child.path}-${level}`;
        stack.push(child);
       }
     } else {
      curNode.id = `${curNode.path}-${level}`;
     }
    }
    return root;
  };

  /**
     * 递归生成树结构方法
     */
export const formatTreeDate = (tree: FileTree, entry: string):TreeGraphData => {
    let treeClone = {...tree};
    try {
       treeClone = JSON.parse(JSON.stringify(tree));
    }catch(e){
      console.error(e);
    }
    const root = {
      id: entry, 
      name:treeClone.name, 
      path: treeClone.path, 
      isFolder:treeClone.isFolder, 
      children:treeClone.children} as unknown as TreeGraphData;
    const stack = [];
    let level = 0;
    stack.push(root);
    while(stack.length) {
      level = level+1;
      const curNode = stack.pop() as TreeGraphData;
     if(curNode?.children?.length) {
       const normalizeChildren = curNode.children.map(node => {
         return {
           ...node,
           id: `${node.path}-${level}`,
         };
       });
       stack.push(...normalizeChildren);
     } else {
      curNode.id = `${curNode.path}-${level}`;
     }
    }
    return root;
  };

  /**
   * 扫描文件树构建出文件目录选择器数组
   * @param tree 
   * @returns 
   * @author chris lee
   * @Time 2021/12/19
   */
export const formatDirOptions = (tree:FileTree) => {
    const treeClone = {...tree};
    const root = {
        name: treeClone.path,
        path: treeClone.path,
        key:treeClone.path,
        label:treeClone.path,
        children:treeClone.children.filter((node) => node.isFolder).map((node) => {
            return {
                ...node,
                parent:{name:treeClone.name, path: treeClone.path},
                key:'',
                label: '',
            };
        }),
    };
    const stack = [];
    stack.push(...root.children);
    while(stack.length) {
        const currentNode = stack.pop() as FileTree & {parent:{name:string,path:string},key:string,label:string};
        if (currentNode.isFolder) {
            currentNode.children = currentNode.children.filter((node) => node.isFolder).map((node) => {
                return {
                    ...node,
                    parent: {name:currentNode.name,path:currentNode.path},
                    key:'',
                    label:'',
                };
            });
            if (currentNode.children.length) {
                stack.push(...currentNode.children);
            } else {
                Reflect.deleteProperty(currentNode, 'children');
            }
        } 
        const splitPath = currentNode.path.split(currentNode?.parent?.path);
        currentNode.label = splitPath[splitPath.length - 1];
        currentNode.key = currentNode.path;
    }
    return [root];
};

const serachMap = new Map<string, TreeGraphData>();

/**
 * 根据当前路径深度遍历树找到对应树节点
 * @param path 路径
 * @param graph 树图数据
 * @returns 
 * @author chris lee
 * @Time 2021/12/20
 */
export const findGraphNode = (path:string, graphData: TreeGraphData): TreeGraphData | null => {
    const cache = serachMap.get(path);
    if (cache) {
        return cache;
    }
   const data = graphData;
   let result:TreeGraphData | null = null;
   const stack = [];
   stack.push(data);
   while(stack.length) {
       const currentNode = stack.pop()  as TreeGraphData;
       if(currentNode.path === path) {
           result = currentNode;
           serachMap.set(path, currentNode);
           break;
       }
       if (currentNode.children?.length) {
           stack.push(...currentNode.children);
       }
   }
   return result;
};