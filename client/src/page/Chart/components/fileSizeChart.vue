<template>
    <div class="chart-title">文件大小</div>
    <div class="chart-main" id="size-chart" ref="chartRef"></div>
    <div class="chart-tool">
        <n-space>
        <n-radio-group v-model:value="chartType" name="">
            <n-space>
            <n-radio v-for="type in chartTypes" :key="type.value" :value="type.value">
                {{ type.label }}
            </n-radio>
            </n-space>
        </n-radio-group>
        <n-select size="small" v-model:value="limit" :options="limitOptions" />
        </n-space>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed, watch, } from 'vue'
import { useFetch } from "@vueuse/core";
import { NSpace, NRadio, NRadioGroup, NSelect} from 'naive-ui';
import { Column, ColumnOptions } from '@antv/g2plot';
import { normalizeFileSize } from '../../../utils';
import { useLimitSelect } from '../hook/useLimitSelect';
import { useAutoFitView } from '../hook/useAutoFitView';

interface FileSizeChartItem {
    fileName: string,
    filePath: string,
    fileSize: number
}

export default defineComponent({
    name: 'fileSizeChart',
    components: {
        NSpace,
        NRadio,
        NRadioGroup,
        NSelect
    },
    setup(props,{emit}) {
        const chartRef = ref<HTMLElement>();
        const chartIns = ref<Column>();
        const chartType = ref<'folder' | 'module'>('folder')
        const fileSizeCacheMap = ref<Record<number,string>>({})
        const countFileSize = (size:number) => {
            if (Number(size) in fileSizeCacheMap.value) {
                return fileSizeCacheMap.value[size]
            } else {
                const value = normalizeFileSize(size);
                fileSizeCacheMap.value[size] = value;
                return value;
            }
        }
        const sortFileSize = (nodes:FileSizeChartItem[]) => {
            return nodes.slice(0).sort((a,b) => { return b.fileSize - a.fileSize});
        }
        const {value: limit, limitOptions} = useLimitSelect();
        const getFileSizeUrl = computed(() => `http://localhost:${window.preloadState.port}/chart/size?limit=${limit.value}`)
        const { onFetchResponse, data, isFetching } = useFetch(getFileSizeUrl, { refetch:true }).json<{nodes:FileSizeChartItem[],tree: FileSizeChartItem[]}>();
        onFetchResponse(() => {
            if (data.value === null) return;
            const chartData = chartType.value === 'folder'? data.value.tree :data.value.nodes;
            if (chartIns.value) {
                chartIns.value.changeData(sortFileSize(chartData));
            } else {
                chartIns.value = new Column(chartRef.value as HTMLElement, {
                    data:sortFileSize(chartData),
                    width: chartRef.value?.offsetWidth??0,
                    height: chartRef.value?.offsetHeight??0,
                    xField: 'fileName',
                    yField: 'fileSize',
                    padding:'auto',
                    color: '#a3a3c2',
                    appendPadding: 10,
                    tooltip: {
                        showTitle:true,
                        title: '点击柱体以查看文件路径',
                        formatter(data){
                            return { name: '文件大小', value: `${countFileSize(data.fileSize)}` };
                        }
                    }
                });
                chartIns.value.render();
                chartIns.value.on('element:click',(param: any) => {
                    const data = param.data;
                    if (data.data) {
                        const path = data.data?.filePath;
                        emit('handleClick', path);
                    }
                })
            }
        });
        useAutoFitView<ColumnOptions, Column>(chartIns, chartRef);

        const chartTypes = [
            {
                value: 'folder',
                label: '目录'
            },
            {
                value: 'module',
                label: '模块'
            },
        ];
        watch(chartType, (newVal) => {
            if (data.value === null) return;
            const chartData = newVal === 'folder'? data.value.tree :data.value.nodes;
            if(chartIns.value) {
                chartIns.value.changeData(sortFileSize(chartData))
            }
        })

        return {
            chartRef,
            chartTypes,
            chartType,
            limitOptions,
            limit
        }
    },
})
</script>
<style lang="scss" scoped>
.chart-title{
    font-size: 15px;
    box-sizing: border-box;
    padding: 5px;
    font-weight: bolder;
    box-shadow: 0px 1px 5px -2px #8080805c;
}
.chart-main {
    width: 100%;
    flex:1;
}
.chart-tool,.chart-title {
    height: 50px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
