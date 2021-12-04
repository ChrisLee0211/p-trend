const typeEnum = {
    "string":"[object String]",
    "number":"[object Number]",
    "boolean":"[object Boolean]",
    "undefined":"[object Undefined]",
    "null":"[object Null]",
    "object":"[object Object]",
    "function":"[object Function]",
    "array":"[object Array]",
    "date":"[object Date]",
    "reg":"[object RegExp]"
};


/**
 * Verify that a value is an object
 * @param {any} obj 
 * @returns {boolean}
 * @author  chrislee
 * @Time 2020/7/12
 */
export const isObject:(obj:unknown)=>boolean = (obj) =>{
    let res = true;
    if(Object.prototype.toString.call(obj) === "[object Object]"){
        res = true;
    }else{
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
export const isUndefined:(obj:unknown)=>boolean = (obj) => {
    let res: boolean;
    if(obj === undefined||Object.prototype.toString.call(obj)===typeEnum["undefined"]){
        res = true;
    }else{
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
export const isArray:(obj:unknown)=>boolean = (obj) =>{
    let res:boolean;
    if(obj instanceof Array || Object.prototype.toString.call(obj)===typeEnum["array"]){
        res = true;
    }else{
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
export const isBoolean:(obj:unknown) => boolean = (obj) => {
    let res:boolean;
    if( Object.prototype.toString.call(obj)===typeEnum["boolean"]){
        res = true;
    }else{
        res = false;
    }
    return res;
};

export const typeValidate:(obj:unknown, type:keyof typeof typeEnum, constant?:string)=>boolean = (obj, type, constant="The value of target") =>{
    let res:boolean;
    if(Object.prototype.toString.call(obj)=== typeEnum[type]){
        res = true;
    }else{
        let currentType = "undefined";
        for(const key in typeEnum){
            if(typeEnum[key as keyof typeof typeEnum] === Object.prototype.toString.call(obj)){
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
export const getVariableType:(obj:any)=> string= (obj)=>{
    return Object.prototype.toString.call(obj);
};
