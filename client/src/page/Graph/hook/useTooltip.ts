import {ref, onMounted} from 'vue';
import {Tooltip} from '@antv/g6';
import dayjs from 'dayjs';


export const useTooltip = (id:string) => {
    const tooltipPlugin= ref();
    onMounted(() => {
        tooltipPlugin.value = new Tooltip({
            container: document.getElementById(id) as HTMLDivElement,
            offsetX: 10,
            offsetY: 10,
            getContent(evt) {
                const nodeInfo = evt?.item?._cfg?.model;
                if (nodeInfo) {
                    const filePath = nodeInfo.path as string || 'none';
                    const name = nodeInfo.name as string;
                    const startTemp = `<div style="max-width:200px;word-break: break-all;">`;
                    const endTemp = `</div>`;
                    const basicTemp = `
                    <p>模块名称:  ${name}</p>
                    <p>路径:  ${filePath}</p> 
                    `;
                    let extraTemp = ``;
                    const depNodeProps = ['utime', 'ctime', 'fileSize', 'importTimes'];
                    const depNodePropsMap = {
                        utime:{
                            label: '最近修改时间',
                            getValue(val:string){
                                return dayjs(val).format('YYYY-MM-DD');
                            }
                        },
                        ctime:{
                            label: '创建时间',
                            getValue(val:string){
                                return dayjs(val).format('YYYY-MM-DD');
                            }
                        },
                        fileSize: {
                            label: '文件大小',
                            getValue(val:any){
                                return `${(Number(val) / 1024).toFixed(2)}kb`;
                            }
                        },
                        importTimes: {
                            label: '被引用次数',
                            getValue(val:string|number) {
                                return `${val}`;
                            }
                        }
                    };
                    for (const key in nodeInfo) {
                        if (depNodeProps.includes(key) && nodeInfo[key]) {
                            const label = depNodePropsMap[key as keyof typeof depNodePropsMap].label;
                            const value = depNodePropsMap[key as keyof typeof depNodePropsMap].getValue(nodeInfo[key] as string);
                            extraTemp = extraTemp + `<p>${label}: ${value}</p>`;
                        }
                    }
                    const basicTemplate = startTemp + basicTemp + extraTemp + endTemp;
                    return basicTemplate;
                } 
                return `<h1></h1>`;
            },
            itemTypes: ['node']
        });
    });
    
    return [tooltipPlugin];
};