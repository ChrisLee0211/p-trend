/**
 * 格式化文件大表示，自动根据1024换算
 * @param size : 文件大小值;
 * @author Chris lee
 * @Time 2021/09/12
 */
export const normalizeFileSize = (size?:number) => {
    if(!size) return 0 + 'b';
    let result = size + 'b';
    let prevData = [size as number];
    let formatTimes = 0;
    let sizeMap = ['B', 'KB', 'MB', 'GB', 'TB'];
    while(prevData.length) {
        const curValue = prevData.pop();
        const newValue = Number(curValue)/1024;
        formatTimes = formatTimes + 1;
        result = newValue.toFixed(2) + sizeMap[formatTimes];
        if (newValue > 1024) {
            prevData.push(newValue);
        }
    }
    return result;
}