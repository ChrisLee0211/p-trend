interface QueueType<T> {
    size(): number;
    pop(): T | undefined;
    push(item: T): void;
    clear(): any;
    getAll(): void;
}
/**
 * 队列生成器
 * size:属性，当前队列长度
 * pop:出列操作，弹出最近入列元素并返回
 * push:入列操作
 * clear:清空队列
 * getAll:打印队列中所有的元素
 */
export default class Queue<T> implements QueueType<T> {
    /** 队列大小 */
    private count;
    /**队列头部元素指针 */
    private headIndex;
    /** 队列实体 */
    private queue;
    constructor();
    /** 初始化方法 */
    private init;
    /** 推入一个元素到队列尾部 */
    push(item: any): void;
    /** 获取队列的大小 */
    size(): number;
    /** 弹出队列头部元素 */
    pop(): T | undefined;
    /** 清空队列 */
    clear(): void;
    /** 打印队列内部所有元素 */
    getAll(): void;
}
export {};
