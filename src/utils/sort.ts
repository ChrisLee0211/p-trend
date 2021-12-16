/**
 * 功能：根据一组数组对象中的某一可排序字段进行排序
 * @param arr:要进行操作的数组
 * @param target:作为排序条件的属性
 * @param sort:排序的顺序 up => 升序 | down => 降序
 * @returns {array}
 */
 export type sortConfig = 'up' |'down'
 export const sortObject = <T extends any[]>(arr:T,target:string,sort:sortConfig):T => {
     let result:T;
     const targetArr:Array<any> = [...arr];
     //判断是否数组
     if(targetArr instanceof Array){
         //判断数组是否为空
         if(targetArr.length < 1){
             console.error('数组为空！');
             result = arr;
         }else{
             //判断数组中每一项是否对象
             const isObj:boolean = targetArr.every(v => v instanceof Object);
             //判断传入的属性是否在数组的每个对象中，且为可排序类型
             const isRealKey:boolean = targetArr.every( v => {
                 const keysArr:Array<string> = Object.keys(v);
                 return keysArr.includes(target);
             });
             if(isObj&&isRealKey){
                 const len:number = targetArr.length;
                 for(let i=0;i<len-1;i++){
                     if (sort === 'up') {
                         let min:number = i;
                         for(let j:number = i+1;j<len;j++){
                             if(targetArr[j][target] < targetArr[min][target] ){
                                 min = j;
                             }
                             [targetArr[i],targetArr[min]] = [targetArr[min],targetArr[i]];
                         }
                     } else {
                         let max:number = i;
                         for(let j:number = i+1; j < len; j++) {
                            if(targetArr[j][target] > targetArr[max][target] ){
                                max = j;
                            }
                            [targetArr[i],targetArr[max]] = [targetArr[max],targetArr[i]];
                         }
                     }
                 }
                 result = [...targetArr] as T;
             }else{
                 console.error('传入的目标属性无法在每个对象中找到');
                 result = arr;
             }
         }
     }else{
         result = arr;
     }
     return result;
  };
 