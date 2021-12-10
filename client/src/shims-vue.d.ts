declare module '*.vue' {
  import { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
interface BasicNode {
  /** 文件名 */
  name: string;
  /** 文件路径 */
  path: string;
  /** 文件模块唯一id，组成方法是path用'-'连接，最终文件末尾去掉后缀 */
  moduleId: string;
}

interface FileStat {
  /** 文件大小 */
  fileSize?: number,
  /** 创建时间 */
  ctime?: Date,
  /** 更新时间 */
  utime?: Date,
}

type Ifile = BasicNode & FileStat
interface FileTree extends BasicNode {
  /** 是否目录 */
  isFolder:boolean,
  children: FileTree[],
  /** 文件大小 */
  fileSize?: number
}

interface FileNode extends Ifile {
  /** 是否目录 */
  isFolder:boolean,
  /** 自身依赖节点路径 */
  deps:DependenceNode[]
}

interface DependenceNode extends Ifile {
  /** 被引用的节点 */
  reference: FileNode[],
  /** 是否可解析 */
  canResolve: boolean
}
declare interface Window {
  preloadState: {
    port?:number
  }
}