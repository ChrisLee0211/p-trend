<template>
    <div class="chart-title">被引用次数</div>
    <div class="chart-main" id="reference-chart" ref="chartRef"></div>
    <div class="chart-tool">
        <n-space>
        <n-select size="small" v-model:value="limit" :options="limitOptions" />
        </n-space>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed, watch, } from 'vue'
import { useFetch } from "@vueuse/core";
import { NSpace, NSelect} from 'naive-ui';
import { Column, ColumnOptions } from '@antv/g2plot';
import { useLimitSelect } from '../hook/useLimitSelect';
import { useAutoFitView } from '../hook/useAutoFitView';

interface ReferenceNode {
    fileName: string,
    filePath: string,
    reference: number,
}

export default defineComponent({
    name: 'referenceChart',
    components: {
        NSpace,
        NSelect
    },
    setup() {
        const chartRef = ref<HTMLElement>();
        const chartIns = ref<Column>();
        const {value: limit, limitOptions} = useLimitSelect();
        const getFileDepsUrl = computed(() => `http://localhost:${window.preloadState.port}/chart/reference?limit=${limit.value}`)
        const { onFetchResponse, data, onFetchError } = useFetch<{nodes:ReferenceNode[]}>(getFileDepsUrl, { refetch:true }).json<{nodes:ReferenceNode[]}>();
        const chartData = computed(() => {
            if(data.value && data.value.nodes) {
                return data.value.nodes.map((node) => ({...node})).sort((a,b) => b.reference - a.reference);
            }
            return [];
        })
        onFetchError((param) => {
            console.log(param)
        })
        onFetchResponse(() => {
            if (chartIns.value) {
                chartIns.value.changeData(chartData.value);
            } else {
                chartIns.value = new Column(chartRef.value as HTMLElement, {
                    data:chartData.value,
                    width: chartRef.value?.offsetWidth??0,
                    height: chartRef.value?.offsetHeight??0,
                    xField: 'fileName',
                    yField: 'reference',
                    padding:'auto',
                    appendPadding: 10,
                    color: '#40bf80',
                    tooltip: {
                        formatter(data){
                            return { name: '被引用次数', value: `${data.reference}` };
                        }
                    }
                });
                chartIns.value.render();
            }
        });
        useAutoFitView<ColumnOptions, Column>(chartIns, chartRef);

        return {
            chartRef,
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
