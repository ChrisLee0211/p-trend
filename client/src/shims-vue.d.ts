declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}
 interface FileNode {
  name:string,
  path:string,
  isFolder:boolean,
  fileSize?: number,
  ctime?: Date,
  utime?: Date,
  /** 自身依赖节点路径 */
  deps:DependenceNode[]
}

interface FileTree {
  name:string,
  path:string,
  isFolder:boolean,
  children: FileTree[]
}

interface DependenceNode {
  name:string,
  path:string,
  size?: number,
  ctime?: string,
  mtime?: string,
  /** 被引用的节点 */
  reference: FileNode[],
  canResolve: boolean
}
declare interface Window {
  preloadState: {
    port?:number
  }
}