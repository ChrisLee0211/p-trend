<template>
  <div class="graph">
    <n-spin size="large" :show="loading">
      <div class="graph-main-wrapper">
        <div class="graph-tools">
          <div class="graph-tools-panel">
            <div class="graph-tools-panel-item">
              <div class="graph-tools-panel-item-main">
                图类型：
                <n-radio-group
                  v-model:value="selectGraphType"
                  name="radiogroup"
                >
                  <n-space>
                    <n-radio
                      v-for="item in graphType"
                      :key="item.value"
                      :value="item.value"
                    >
                      {{ item.label }}
                    </n-radio>
                  </n-space>
                </n-radio-group>
              </div>
              <div class="graph-tools-panel-item-main">
                当前目录：
                <n-tree-select
                  :options="dirOpts"
                  virtual-scroll
                  :value="dirSrc"
                  :show-path="true"
                  :separator="''"
                  @update:value="handleChangeDir"
                />
              </div>
            </div>
            <div class="graph-tools-panel-item">
              依赖标记：
              <n-switch v-model:value="showDeps" :disabled="disableShowDeps" />
            </div>
          </div>
        </div>
        <div id="graph-root">
          <div class="graph-container" ref="graphRef"></div>
          <div id="miniMap"></div>
          <div id="tooltip" class="tooltip-wrap" ref="tooltipRef"></div>
        </div>
      </div>
    </n-spin>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch, computed } from "vue";
import { TreeGraphData } from "@antv/g6";
import { useFetch } from "@vueuse/core";
import {
  NSpin,
  NRadio,
  NSpace,
  NRadioGroup,
  NSwitch,
  NTreeSelect,
  useNotification,
} from "naive-ui";
import { useMiniMap } from "./hook/useMiniMap";
import { useTooltip } from "./hook/useTooltip";
import { useResizeObserver, useDebounceFn } from "@vueuse/core";
import {
  formatDepsData,
  formatNodesData,
  formatTreeDate,
  formatDirOptions,
  findGraphNode,
} from "./helpers";
import { useGraph } from "./hook/useGraph";

interface TreeOpts {
  label: string;
  key: string;
  children: Array<TreeOpts>;
  [key: string]: any;
}

export default defineComponent({
  name: "Graph",
  components: { NSpin, NRadio, NRadioGroup, NSwitch, NTreeSelect, NSpace },
  setup() {
    const notice = useNotification();

    /** 初始化图相关逻辑 */
    const graphRef = ref<HTMLDivElement | null>(null);
    const [miniMap] = useMiniMap("miniMap", "miniMap");
    const [tooltip] = useTooltip("tooltip");
    const graphData = ref<TreeGraphData | null>(null);
    const { initGraph, graphRaw, loading } = useGraph(graphRef);
    const { onFetchResponse, data } = useFetch<{
      nodes: FileNode[];
      entry: string;
      tree: FileTree;
    }>(`http://localhost:${window.preloadState.port}/graph`, {
      method: "GET",
    }).json();
    onFetchResponse((res) => {
      if (res.status === 200) {
        graphData.value = formatTreeDate(data.value.tree, data.value.entry);
        initGraph(graphData.value, [miniMap.value, tooltip.value]);
      }
    });
    const autoFitView = useDebounceFn((w: number, h: number) => {
      if (graphRaw.graphIns) {
        graphRaw.graphIns.changeSize(w, h);
        graphRaw.graphIns.fitView(20);
      }
    }, 100);
    useResizeObserver(graphRef, (entries) => {
      const entry = entries[0];
      const { width, height } = entry.contentRect;
      autoFitView(width, height);
    });

    /** 视图维度类型 */
    const selectGraphType = ref("project");
    const graphType = [
      {
        label: "项目结构",
        value: "project",
      },
      {
        label: "模块结构",
        value: "module",
      },
    ];
    watch(selectGraphType, (newVal, oldVal) => {
      if (newVal === "project") {
        graphRaw.graphIns?.changeData(
          formatTreeDate(data.value.tree, data.value.entry)
        );
      }
      if (newVal === "module") {
        graphRaw.graphIns?.changeData(
          formatNodesData(data.value.nodes, data.value.entry)
        );
        showDeps.value = false;
      }
      graphRaw.graphIns?.fitView();
    });

    /** 依赖标记 */
    const showDeps = ref(false);
    const disableShowDeps = computed(() => {
      return selectGraphType.value !== "project";
    });
    watch(showDeps, (newVal) => {
      setTimeout(() => {
        let targetTreeData = graphData.value as TreeGraphData;
        if (newVal === true) {
          targetTreeData = formatDepsData(
            targetTreeData as unknown as FileTree,
            data.value.deps,
            data.value.entry
          );
        }
        graphRaw.graphIns?.changeData(targetTreeData);
        graphRaw.graphIns?.fitCenter();
      }, 300);
    });

    /** 目录选择器 */
    const dirOpts = ref<TreeOpts[]>([]);
    const dirSrc = ref("");
    watch(graphData, () => {
      if (graphData.value) {
        dirOpts.value = formatDirOptions(
          data.value.tree
        ) as unknown as TreeOpts[];
        if (dirOpts.value.length) {
          dirSrc.value = dirOpts.value[0].key;
        }
      }
    });
    const handleChangeDir = (val: string, opt: TreeOpts) => {
      try {
        if (graphData.value && graphRaw.graphIns) {
          let targetTreeData = findGraphNode(val, graphData.value);
          // 是否开启依赖标记
          if (targetTreeData) {
            if (showDeps.value) {
              targetTreeData = formatDepsData(
                targetTreeData as unknown as FileTree,
                data.value.deps,
                data.value.entry
              );
            }
            graphRaw.graphIns.changeData(targetTreeData);
            graphRaw.graphIns?.fitView();
            dirSrc.value = val;
          } else {
            throw new Error();
          }
        } else {
          throw new Error();
        }
      } catch (e) {
        console.log(e);
        notice.error({
          meta: "警告",
          content: "无法解析该目录",
        });
      }
    };
    return {
      loading,
      graphRef,
      graphType,
      selectGraphType,
      showDeps,
      disableShowDeps,
      dirOpts,
      dirSrc,
      handleChangeDir,
    };
  },
});
</script>
<style lang="scss">
.graph {
  width: 100%;
  height: 100%;
  &-main-wrapper {
    width: 100%;
    height: 100vh;
    .graph-tools {
      width: 100%;
      height: 15%;
      display: flex;
      justify-content: center;
      align-items: center;
      &-panel {
        width: 98%;
        height: 90%;
        align-items: flex-start;
        box-shadow: 0px 0px 17px 1px #8080802e;
        display: flex;
        padding: 10px;
        flex-flow: column;
        border-radius: 10px;
        box-sizing: border-box;
        &-item {
          margin: 4px 0px;
          display: flex;
          width: 100%;
          align-items: center;
          &-main {
            margin: 0 4px;
            display: flex;
            flex: 1;
            white-space: nowrap;
            align-items: center;
          }
        }
      }
    }
    #graph-root {
      width: 98%;
      height: 85%;
      position: relative;
      margin: 0 auto;
      border-radius: 10px;
      box-shadow: 0px 0px 17px 1px #8080802e;
      .graph-container {
        position: absolute;
        left: 0px;
        right: 0px;
        top: 0px;
        bottom: 0px;
      }
      #miniMap {
        position: absolute;
        left: 2%;
        bottom: 0px;
        border-radius: 10px;
        box-shadow: 0px 0px 17px 1px #8080802e;
      }
      .tooltip {
        max-width: 200px;
        font-size: 12px;
        word-break: break-all;
        border-radius: 6px;
        box-shadow: 0px 0px 17px 1px #8080802e;
      }
    }
  }
}
</style>
