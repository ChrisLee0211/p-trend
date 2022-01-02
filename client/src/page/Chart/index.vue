<template>
  <div class="chart">
    <header class="chart-header">Chart Analysis</header>
    <div class="chart-helper" v-show="filePath.length>0">当前文件: {{ filePath }}</div>
    <section class="chart-content">
      <div class="chart-content-item">
        <size-chart @handleClick="setFilePath" />
      </div>
      <div class="chart-content-item">
        <deps-chart  @handleClick="setFilePath" />
      </div>
      <div class="chart-content-item">
        <reference-chart  @handleClick="setFilePath" />
      </div>
      <div class="chart-content-item">
        <types-chart />
      </div>
    </section>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import fileSizeChart from "./components/fileSizeChart.vue";
import fileDepChart from "./components/dependenceChart.vue";
import referenceChart from "./components/referenceChart.vue";
import typesChart from "./components/typesChart.vue";

export default defineComponent({
  name: "Chart",
  components: {
    "size-chart": fileSizeChart,
    "deps-chart": fileDepChart,
    "reference-chart": referenceChart,
    "types-chart": typesChart,
  },
  setup() {
    const filePath = ref("");
    const setFilePath = (path:string) => {
        filePath.value = path
    }
    return { filePath, setFilePath };
  },
});
</script>
<style lang="scss">
.chart {
  display: flex;
  flex-flow: column;
  width: 100%;
  height: 100%;
  &-header {
    width: 100%;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 40px;
  }
  &-helper {
      width: 100%;
      padding: 0 20px;
  }
  &-content {
    width: 100%;
    flex: 1;
    display: grid;
    padding: 20px;
    box-sizing: border-box;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 20px;
    &-item {
      width: 100%;
      height: 100%;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0px 0px 17px 1px #8080802e;
      flex-flow: column;
      display: flex;
      align-items: center;
    }
  }
}
</style>
