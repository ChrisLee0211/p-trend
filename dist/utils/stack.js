"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stack = exports.Node = exports.DoubleLinkList = void 0;
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
class DoubleLinkList {
    constructor() {
        this.size = 0;
        this.head = null;
        this.tail = null;
    }
    //向头部增加节点
    addOnHead(node) {
        const _node = new Node(node);
        if (this.size === 0) {
            this.head = _node;
            this.tail = _node;
            _node.pre = null;
            _node.next = null;
            this.size += 1;
        }
        else {
            const old_head = this.head;
            this.head = _node;
            _node.next = old_head;
            old_head.pre = _node;
            this.size += 1;
        }
    }
    //向尾部增加节点
    addOnTail(node) {
        const _node = new Node(node);
        if (this.size === 0) {
            this.head = _node;
            this.tail = _node;
            _node.pre = null;
            _node.next = null;
            this.size += 1;
        }
        else {
            const old_tail = this.tail;
            this.tail = _node;
            _node.pre = old_tail;
            old_tail.next = _node;
            this.size += 1;
        }
    }
    //头部删除节点
    deleteOnHead() {
        if (this.size === 0) {
            console.error("No Node In DoubleLinkList!");
            return;
        }
        if (this.size < 2) {
            const currentNode = this.head;
            this.head = null;
            this.tail = null;
            this.size = 0;
            return currentNode;
        }
        if (this.size >= 2) {
            const old_head = this.head;
            const new_head = old_head.next;
            if (this.size === 2) {
                this.size = 0;
                this.head = null;
                this.tail = null;
                this.addOnHead(new_head.target);
            }
            else {
                this.head = new_head;
                new_head.pre = null;
                this.size = this.size - 1;
            }
            return new_head;
        }
    }
    //尾部删除节点
    deleteOnTail() {
        if (this.size === 0) {
            console.error("No Node In DoubleLinkList!");
            return;
        }
        if (this.size < 2) {
            const currentNode = this.tail;
            this.head = null;
            this.tail = null;
            this.size = 0;
            return currentNode;
        }
        if (this.size >= 2) {
            const old_tail = this.tail;
            const new_tail = old_tail.pre;
            if (this.size === 2) {
                this.size = 0;
                this.head = null;
                this.tail = null;
                this.addOnTail(new_tail.target);
            }
            else {
                this.tail = new_tail;
                new_tail.next = null;
                this.size = this.size - 1;
            }
            return new_tail;
        }
    }
    //判断节点是否在链表中
    getNode(val) {
        const _node = new Node(val);
        let currentNode = this.head;
        if (this.size === 0) {
            return false;
        }
        else {
            let length = this.size;
            let c = JSON.stringify(currentNode.target);
            const n = JSON.stringify(_node.target);
            while (c !== n) {
                if (length > 1) {
                    currentNode = currentNode.next;
                    c = JSON.stringify(currentNode.target);
                    length = length - 1;
                }
                else {
                    return false;
                }
            }
            return true;
        }
    }
    //删除指定的节点
    removeNode(val) {
        const _node = new Node(val);
        const judgeNode = this.getNode(val);
        if (judgeNode === false) {
            console.error("No This Node In DoubleLinkList!");
            return;
        }
        if (this.size === 1) {
            const h = JSON.stringify(this.head.target);
            const n = JSON.stringify(_node.target);
            if (h === n) {
                this.head = null;
            }
            if (h === n) {
                this.tail = null;
            }
            this.size = 0;
        }
        else {
            let currentNode = this.head;
            let c = JSON.stringify(currentNode.target);
            const n = JSON.stringify(_node.target);
            while (c !== n) {
                currentNode = currentNode.next;
                c = JSON.stringify(currentNode.target);
            }
            const preNode = currentNode.pre === null ? null : currentNode.pre;
            const nextNode = currentNode.next === null ? null : currentNode.next;
            if (preNode === null) {
                this.deleteOnHead();
            }
            if (nextNode === null) {
                this.deleteOnTail();
            }
            if (preNode !== null && nextNode !== null) {
                preNode.next = nextNode;
                nextNode.pre = preNode;
            }
        }
    }
    /**
     *
     * @param val 要插入的节点
     * @param ele 被插入的节点
     * @param type 插入的位置：next or pre
     */
    insertNode(val, ele, type) {
        let _ele = new Node(ele);
        const _node = new Node(val);
        let currentNode = this.head;
        let c = JSON.stringify(currentNode.target);
        const e = JSON.stringify(_ele.target);
        if (!this.getNode(ele)) {
            console.error(`Can Not Find Node ${e}`);
            return;
        }
        while (c !== e) {
            currentNode = currentNode.next;
            c = JSON.stringify(currentNode.target);
        }
        _ele = currentNode;
        if (type === "next") {
            if (_ele.next === null) {
                this.addOnTail(_node.target);
                return;
            }
            const nextNode = _ele.next;
            const nextNextNode = nextNode.next;
            _node.pre = nextNode;
            _node.next = nextNextNode;
            nextNode.next = _node;
            nextNextNode.pre = _node;
        }
        if (type === "pre") {
            if (_ele.pre === null) {
                this.addOnHead(_node.target);
                return;
            }
            const preNode = _ele.pre;
            const prePreNode = preNode.pre;
            _node.pre = prePreNode;
            _node.next = preNode;
            prePreNode.next = _node;
            preNode.pre = _node;
        }
        return _node;
    }
    //获取链表的节点个数
    countNodes() {
        return this.size;
    }
    //打印所有节点
    getAllNode() {
        let str = "";
        let currentNode = this.head;
        if (currentNode === null)
            return;
        while (currentNode.next !== null) {
            const targetContent = typeof (currentNode.target) === "function" ? String(currentNode.target) : JSON.stringify(currentNode.target);
            str = str + targetContent;
            currentNode = currentNode.next;
        }
        str = str + JSON.stringify(this.tail.target);
        console.log(str);
    }
    //反转链表
    reverseAll() {
        const new_doubleLinkList = new DoubleLinkList();
        let cur = this.head;
        while (cur.next !== null) {
            const next = cur.next;
            new_doubleLinkList.addOnHead(cur.target);
            cur = next;
        }
        this.head = new_doubleLinkList.head;
        this.addOnHead(cur.target);
        this.tail = new_doubleLinkList.tail;
    }
}
exports.DoubleLinkList = DoubleLinkList;
class Node {
    constructor(obj) {
        this.pre = null;
        this.next = null;
        this.target = obj;
        this.val();
    }
    val() {
        return this.target;
    }
}
exports.Node = Node;
class Stack {
    constructor() {
        this.length = 0;
        this.doubleLink = new DoubleLinkList();
        this.length = this.doubleLink.countNodes();
    }
    /**
     * 把一个元素推入栈中
     * @param item :推入栈顶的元素
     * @returns {number} 此时栈内元素的数量
     */
    push(item) {
        let index = NaN;
        const currentItem = item;
        const size = this.doubleLink.countNodes();
        this.doubleLink.addOnHead(currentItem);
        this.length = this.doubleLink.countNodes();
        index = size + 1;
        return index;
    }
    /**
     * 弹出栈顶的元素
     * @param
     * @returns {any} 被弹出的元素
     */
    pop() {
        if (this.length === 0)
            return null;
        let result;
        result = this.doubleLink.head;
        this.doubleLink.deleteOnHead();
        this.length = this.doubleLink.countNodes();
        return result.target;
    }
    /**
     * 清空栈
     */
    clear() {
        let size = this.doubleLink.countNodes();
        while (size > 1) {
            this.doubleLink.deleteOnHead();
            size = this.doubleLink.countNodes();
        }
        this.length = this.doubleLink.countNodes();
        return;
    }
    /**
     * 打印栈内所有元素
     */
    getAll() {
        let head = this.doubleLink.head;
        const arr = [];
        let current;
        const size = this.doubleLink.countNodes();
        let count = 0;
        while (count < size) {
            const cur = head;
            arr.push(cur.target);
            head = cur.next;
            count++;
        }
        return arr;
    }
}
exports.Stack = Stack;
