import dayjs from "dayjs";

export const formatTime = (timeStr:string|Date) => {
    return dayjs(timeStr).format('YYYY-MM-DD');
}

export const formatFileSize = (val:string|number) => {
    return `${(Number(val) / 1024).toFixed(2)}kb`
}