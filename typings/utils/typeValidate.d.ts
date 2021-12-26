declare const typeEnum: {
    string: string;
    number: string;
    boolean: string;
    undefined: string;
    null: string;
    object: string;
    function: string;
    array: string;
    date: string;
    reg: string;
};
/**
 * Verify that a value is an object
 * @param {any} obj
 * @returns {boolean}
 * @author  chrislee
 * @Time 2020/7/12
 */
export declare const isObject: (obj: unknown) => boolean;
/**
 * Verify that a value is undefined
 * @param {any} obj
 * @returns {boolean}
 * @author chrislee
 * @Time 2020/7/12
 */
export declare const isUndefined: (obj: unknown) => boolean;
/**
 * Verify that a value is an array
 * @param {any} obj
 * @returns {boolean}
 * @author chrislee
 * @Time 2020/7/12
 */
export declare const isArray: (obj: unknown) => boolean;
/**
 * Verify that a value is an boolean
 * @param {any} obj
 * @returns {boolean}
 * @author chrislee
 * @Time 2020/7/12
 */
export declare const isBoolean: (obj: unknown) => boolean;
export declare const typeValidate: (obj: unknown, type: keyof typeof typeEnum, constant?: string) => boolean;
/**
 * get variable type
 * @param {any} obj
 * @returns {string}
 * @author chrislee
 * @Time 2020/9/28
 */
export declare const getVariableType: (obj: any) => string;
export {};
