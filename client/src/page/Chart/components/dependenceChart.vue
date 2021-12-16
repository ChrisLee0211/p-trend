<template>
  <div class="chart-title">依赖数</div>
  <div class="chart-main" id="deps-chart" ref="chartRef"></div>
  <div class="chart-tool">
    <n-space>
      <n-select size="small" v-model:value="limit" :options="limitOptions" />
      <n-radio-group v-model:value="sortType" name="radiogroup">
        <n-space>
          <n-radio
            v-for="item in sortOptions"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </n-radio>
        </n-space>
      </n-radio-group>
    </n-space>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useFetch } from "@vueuse/core";
import { NSpace, NSelect, NRadio, NRadioGroup } from "naive-ui";
import { Column, ColumnOptions } from "@antv/g2plot";
import { useLimitSelect } from "../hook/useLimitSelect";
import { useSortTypeRadio } from "../hook/useSortTypeRadio";
import { useAutoFitView } from "../hook/useAutoFitView";

export default defineComponent({
  name: "dependenceChart",
  components: {
    NSpace,
    NSelect,
    NRadio,
    NRadioGroup,
  },
  setup() {
    const chartRef = ref<HTMLElement>();
    const chartIns = ref<Column>();
    const { value: limit, limitOptions } = useLimitSelect();
    const { value: sortType, sortOptions } = useSortTypeRadio();
    const getFileDepsUrl = computed(
      () =>
        `http://localhost:${window.preloadState.port}/chart/deps?limit=${limit.value}&sort=${sortType.value}`
    );
    const { onFetchResponse, data, onFetchError } = useFetch<{
      nodes: FileNode[];
    }>(getFileDepsUrl, { refetch: true }).json<{ nodes: FileNode[] }>();
    const chartData = computed(() => {
      if (data.value && data.value.nodes) {
        return data.value.nodes
          .map((node) => ({ ...node, depCount: node.deps.length }))
          .sort((a, b) => b.depCount - a.depCount);
      }
      return [];
    });
    onFetchError((param) => {
      console.log(param);
    });
    onFetchResponse(() => {
      if (chartIns.value) {
        chartIns.value.changeData(chartData.value);
      } else {
        chartIns.value = new Column(chartRef.value as HTMLElement, {
          data: chartData.value,
          width: chartRef.value?.offsetWidth ?? 0,
          height: chartRef.value?.offsetHeight ?? 0,
          xField: "fileName",
          yField: "depCount",
          padding: "auto",
          color: "#ff4d4d",
          appendPadding: 10,
          tooltip: {
            formatter(data) {
              return { name: "依赖数量", value: `${data.depCount}` };
            },
          },
        });
        chartIns.value.render();
      }
    });
    useAutoFitView<ColumnOptions, Column>(chartIns, chartRef);

    return {
      chartRef,
      limitOptions,
      limit,
      sortType,
      sortOptions,
    };
  },
});
</script>
<style lang="scss" scoped>
.chart-title {
  font-size: 15px;
  box-sizing: border-box;
  padding: 5px;
  font-weight: bolder;
  box-shadow: 0px 1px 5px -2px #8080805c;
}
.chart-main {
  width: 100%;
  flex: 1;
}
.chart-tool,
.chart-title {
  height: 50px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
