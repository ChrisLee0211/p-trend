"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortObject = void 0;
exports.sortObject = (arr, target, sort) => {
    let result;
    const targetArr = [...arr];
    //判断是否数组
    if (targetArr instanceof Array) {
        //判断数组是否为空
        if (targetArr.length < 1) {
            console.error('数组为空！');
            result = arr;
        }
        else {
            //判断数组中每一项是否对象
            const isObj = targetArr.every(v => v instanceof Object);
            //判断传入的属性是否在数组的每个对象中，且为可排序类型
            const isRealKey = targetArr.every(v => {
                const keysArr = Object.keys(v);
                return keysArr.includes(target);
            });
            if (isObj && isRealKey) {
                const len = targetArr.length;
                for (let i = 0; i < len - 1; i++) {
                    if (sort === 'up') {
                        let min = i;
                        for (let j = i + 1; j < len; j++) {
                            if (targetArr[j][target] < targetArr[min][target]) {
                                min = j;
                            }
                            [targetArr[i], targetArr[min]] = [targetArr[min], targetArr[i]];
                        }
                    }
                    else {
                        let max = i;
                        for (let j = i + 1; j < len; j++) {
                            if (targetArr[j][target] > targetArr[max][target]) {
                                max = j;
                            }
                            [targetArr[i], targetArr[max]] = [targetArr[max], targetArr[i]];
                        }
                    }
                }
                result = [...targetArr];
            }
            else {
                console.error('传入的目标属性无法在每个对象中找到');
                result = arr;
            }
        }
    }
    else {
        result = arr;
    }
    return result;
};
//# sourceMappingURL=sort.js.map