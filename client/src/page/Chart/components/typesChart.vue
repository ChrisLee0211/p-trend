<template>
  <div class="chart-title">类型比例</div>
  <div class="chart-main" id="types-chart" ref="chartRef"></div>
  <!-- <div class="chart-tool"></div> -->
</template>
<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useFetch } from "@vueuse/core";
import { NSpace, NSelect } from "naive-ui";
import { Pie, PieOptions } from "@antv/g2plot";
import { useAutoFitView } from "../hook/useAutoFitView";

interface typesNode {
  fileType: string;
  num: number;
}

export default defineComponent({
  name: "typesChart",
  components: {
    NSpace,
    NSelect,
  },
  setup() {
    const chartRef = ref<HTMLElement>();
    const chartIns = ref<Pie>();
    const getFileTypesUrl = computed(
      () => `http://localhost:${window.preloadState.port}/chart/types`
    );
    const { onFetchResponse, data, onFetchError } = useFetch<{
      types: typesNode[];
    }>(getFileTypesUrl.value, { refetch: true }).json<{ types: typesNode[] }>();
    const chartData = computed(() => {
     return data.value?.types ?? [];
    });
    onFetchError((param) => {
      console.log(param);
    });
    onFetchResponse(() => {
      if (chartIns.value) {
        chartIns.value.changeData(chartData.value);
      } else {
        chartIns.value = new Pie(chartRef.value as HTMLElement, {
          data: chartData.value,
          width: chartRef.value?.offsetWidth ?? 0,
          height: chartRef.value?.offsetHeight ?? 0,
          angleField: "num",
          colorField: "fileType",
          padding:16,
          label: {
            type: "inner",
            offset: "-30%",
            content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
            style: {
              fontSize: 14,
              textAlign: "center",
            },
          },
          interactions: [{ type: "element-active" }],
        });
        chartIns.value.render();
      }
    });
    useAutoFitView<PieOptions, Pie>(chartIns, chartRef);

    return {
      chartRef,
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
