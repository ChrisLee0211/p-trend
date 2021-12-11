"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 队列生成器
 * size:属性，当前队列长度
 * pop:出列操作，弹出最近入列元素并返回
 * push:入列操作
 * clear:清空队列
 * getAll:打印队列中所有的元素
 */
class Queue {
    constructor() {
        /** 队列大小 */
        this.count = 0;
        /**队列头部元素指针 */
        this.headIndex = 0;
        /** 队列实体 */
        this.queue = {};
        this.init();
    }
    /** 初始化方法 */
    init() {
        this.count = 0;
        this.headIndex = 0;
        this.queue = {};
    }
    /** 推入一个元素到队列尾部 */
    push(item) {
        this.queue[this.count] = item;
        this.count++;
    }
    /** 获取队列的大小 */
    size() {
        return this.count - this.headIndex;
    }
    /** 弹出队列头部元素 */
    pop() {
        const len = this.size();
        if (len <= 0)
            return undefined;
        const result = this.queue[this.headIndex];
        delete this.queue[this.headIndex];
        this.headIndex++;
        return result;
    }
    /** 清空队列 */
    clear() {
        this.init();
    }
    /** 打印队列内部所有元素 */
    getAll() {
        const result = [];
        for (let i = this.headIndex; i < this.count; i++) {
            result.push(this.queue[i]);
        }
        console.log(result);
    }
}
exports.default = Queue;
//# sourceMappingURL=queue.js.map