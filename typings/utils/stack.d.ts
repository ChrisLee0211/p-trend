/**
 * 接口名称：双向链表生成器
 */
interface doubleLink {
    head: node | null;
    tail: node | null;
    size: number;
    addOnHead(node: any): any;
    addOnTail(node: any): any;
    deleteOnHead(): any;
    deleteOnTail(): any;
    reverseAll(): any;
}
/**
 * 双向链表
 * 功能：
 * 1、头部增加节点
 * 2、尾部增加节点
 * 3、头部删除节点(弹出头部节点)
 * 4、尾部删除节点(弹出尾部节点)
 * 5、判断节点是否在链表中
 * 6、删除指定的节点
 * 7、在指定节点的前或后增加节点
 * 8、获取链表的节点个数
 * 9、打印所有节点
 * 10.反转链表
 */
export declare class DoubleLinkList implements doubleLink {
    head: node | null;
    tail: node | null;
    size: number;
    constructor();
    addOnHead(node: any): void;
    addOnTail(node: any): void;
    deleteOnHead(): node | undefined;
    deleteOnTail(): node | undefined;
    getNode(val: any): boolean;
    removeNode(val: any): void;
    /**
     *
     * @param val 要插入的节点
     * @param ele 被插入的节点
     * @param type 插入的位置：next or pre
     */
    insertNode(val: any, ele: any, type: string): node | undefined;
    countNodes(): number;
    getAllNode(): void;
    reverseAll(): void;
}
/**
 * 类名称：节点生成器
 * 功能：创建一个包含key：value的节点并返回
 * 用法：接受一个（key：vakue）的对象作为参数，返回该节点
 * 可用方法：
 *   xxx.key：返回该节点的key
 */
interface node {
    target: any;
    pre: any;
    next: any;
}
export declare class Node implements node {
    target: any;
    pre: any;
    next: any;
    constructor(obj: any);
    val(): any;
}
/**
 * 关于栈结构的接口
 */
interface stack {
    length: number;
    push(item: any): number;
    pop(): any;
    clear(): void;
    doubleLink: DoubleLinkList;
}
export declare class Stack implements stack {
    length: number;
    doubleLink: DoubleLinkList;
    constructor();
    /**
     * 把一个元素推入栈中
     * @param item :推入栈顶的元素
     * @returns {number} 此时栈内元素的数量
     */
    push(item: any): number;
    /**
     * 弹出栈顶的元素
     * @param
     * @returns {any} 被弹出的元素
     */
    pop(): any;
    /**
     * 清空栈
     */
    clear(): void;
    /**
     * 打印栈内所有元素
     */
    getAll(): Array<any>;
}
export {};
