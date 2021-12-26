"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVariableType = exports.typeValidate = exports.isBoolean = exports.isArray = exports.isUndefined = exports.isObject = void 0;
const typeEnum = {
    "string": "[object String]",
    "number": "[object Number]",
    "boolean": "[object Boolean]",
    "undefined": "[object Undefined]",
    "null": "[object Null]",
    "object": "[object Object]",
    "function": "[object Function]",
    "array": "[object Array]",
    "date": "[object Date]",
    "reg": "[object RegExp]"
};
/**
 * Verify that a value is an object
 * @param {any} obj
 * @returns {boolean}
 * @author  chrislee
 * @Time 2020/7/12
 */
exports.isObject = (obj) => {
    let res = true;
    if (Object.prototype.toString.call(obj) === "[object Object]") {
        res = true;
    }
    else {
        res = false;
    }
    return res;
};
/**
 * Verify that a value is undefined
 * @param {any} obj
 * @returns {boolean}
 * @author chrislee
 * @Time 2020/7/12
 */
exports.isUndefined = (obj) => {
    let res;
    if (obj === undefined || Object.prototype.toString.call(obj) === typeEnum["undefined"]) {
        res = true;
    }
    else {
        res = false;
    }
    return res;
};
/**
 * Verify that a value is an array
 * @param {any} obj
 * @returns {boolean}
 * @author chrislee
 * @Time 2020/7/12
 */
exports.isArray = (obj) => {
    let res;
    if (obj instanceof Array || Object.prototype.toString.call(obj) === typeEnum["array"]) {
        res = true;
    }
    else {
        res = false;
    }
    return res;
};
/**
 * Verify that a value is an boolean
 * @param {any} obj
 * @returns {boolean}
 * @author chrislee
 * @Time 2020/7/12
 */
exports.isBoolean = (obj) => {
    let res;
    if (Object.prototype.toString.call(obj) === typeEnum["boolean"]) {
        res = true;
    }
    else {
        res = false;
    }
    return res;
};
exports.typeValidate = (obj, type, constant = "The value of target") => {
    let res;
    if (Object.prototype.toString.call(obj) === typeEnum[type]) {
        res = true;
    }
    else {
        let currentType = "undefined";
        for (const key in typeEnum) {
            if (typeEnum[key] === Object.prototype.toString.call(obj)) {
                currentType = key;
            }
        }
        throw TypeError(`${constant} expect a ${type},but got ${currentType}`);
    }
    return res;
};
/**
 * get variable type
 * @param {any} obj
 * @returns {string}
 * @author chrislee
 * @Time 2020/9/28
 */
exports.getVariableType = (obj) => {
    return Object.prototype.toString.call(obj);
};
