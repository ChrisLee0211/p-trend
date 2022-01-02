import {ref, h} from 'vue';
import {formatFileSize, formatTime} from './helpers';
import { DataTableColumn, NSpace, NButton } from 'naive-ui';
   
type effectFn = (record:FileNode)=>void
export const useTableColumn = (setDetailFn:effectFn, deleteFileFn:effectFn):DataTableColumn<FileNode>[] => {
    return [
        {
            type:'selection',
        },
        {
            title: '文件名',
            key: 'name',
            align:'center',
        },
        {
            title: '创建时间',
            key: 'ctime',
            align:'center',
            render(row) {
                const ctime = row?.ctime;
                return ctime? formatTime(ctime) : 'none';
            }
        },
        {
            title: '更新时间',
            key: 'utime',
            align:'center',
            render(row) {
                const utime = row?.utime;
                return utime? formatTime(utime) : 'none';
            }
        },
        {
            title: '文件大小',
            key: 'fileSize',
            align:'center',
            render(row) {
                const fileSize = row?.fileSize;
                return fileSize ? formatFileSize(fileSize) : 'none';
            }
        },
        {
            title: '依赖数',
            key: 'deps',
            align:'center',
            render(row) {
                return row.deps.length;
            }
        },
        {
            title: '操作',
            key: 'action',
            align:'center',
            render(row) {
                return h(
                    'div',
                    {
                        style:'width:100%;display:flex;justify-content:center'
                    },
                    [
                        h(
                            NButton,
                            {
                                text:true,
                                style:'margin-right:10px',
                                onClick:(r) => {
                                    setDetailFn(row);
                                }
                            },
                            {
                                default:()=>'详情'
                            }
                        ),
                        h(
                            NButton,
                            {
                                text:true,
                                textColor:'red',
                                onClick:() => {
                                    deleteFileFn(row);
                                }
                            },
                            {
                                default:()=>'删除'
                            }
                        ),
                    ]
                );
            }
        },
    ];
};