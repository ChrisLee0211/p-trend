/**
 * 功能：根据一组数组对象中的某一可排序字段进行排序
 * @param arr:要进行操作的数组
 * @param target:作为排序条件的属性
 * @param sort:排序的顺序 up => 升序 | down => 降序
 * @returns {array}
 */
export declare type sortConfig = 'up' | 'down';
export declare const sortObject: <T extends any[]>(arr: T, target: string, sort: sortConfig) => T;
