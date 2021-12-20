<template>
  <div class="graph">
    <n-spin size="large" :show="loading">
      <div class="graph-main-wrapper">
        <div class="graph-tools">
          <div class="graph-tools-panel">
            <div class="graph-tools-panel-item">
              <div class="graph-tools-panel-item-main" >
                  图类型：
                  <n-radio-group v-model:value="selectGraphType" name="radiogroup">
                    <n-space>
                      <n-radio v-for="item in graphType" :key="item.value" :value="item.value">
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
import { defineComponent, ref, nextTick, watch, computed } from "vue";
import G6, {
  Item,
  TreeGraph,
  TreeGraphData,
  NodeConfig,
} from "@antv/g6";
import { useFetch } from "@vueuse/core";
import { NSpin,NRadio, NRadioGroup,NSwitch, NTreeSelect, useNotification } from "naive-ui";
import { useMiniMap } from "./hook/useMiniMap";
import { useTooltip } from "./hook/useTooltip"; 
import { useResizeObserver, useDebounceFn } from "@vueuse/core";
import { formatDepsData, formatNodesData, formatTreeDate, formatDirOptions, findGraphNode} from './helpers'

interface TreeOpts {
  label: string;
  key: string;
  children:Array<TreeOpts>;
  [key:string]: any;
}

export default defineComponent({
  name: "Graph",
  components: { NSpin,NRadio, NRadioGroup, NSwitch, NTreeSelect },
  setup() {
    const notice = useNotification();

    const loading = ref(true);
    const isFirstRender = ref(true);
    const graphRef = ref<HTMLDivElement | null>(null);
    const graphIns = ref<TreeGraph | null>(null);
    const [miniMap] = useMiniMap("miniMap",'miniMap');
    const [tooltip] = useTooltip('tooltip');
    const graphData = ref<TreeGraphData | null>(null);
    const dirOpts = ref<TreeOpts[]>([]);
    const dirSrc = ref('');
    const { onFetchResponse, data } = useFetch<{
      nodes: FileNode[];
      entry: string;
      tree: FileTree;
    }>(`http://localhost:${window.preloadState.port}/graph`, { method: "GET" }).json();

    onFetchResponse((res) => {
      if (res.status === 200) {
        graphData.value = formatTreeDate(data.value.tree, data.value.entry);
        dirOpts.value = formatDirOptions(data.value.tree) as unknown as TreeOpts[];
        if (dirOpts.value.length) {
          dirSrc.value = dirOpts.value[0].key
        }
      }
    });

    watch(graphData, (target) => {
      if (target !== null && isFirstRender.value) {
        nextTick(() => {
          graphIns.value = new G6.TreeGraph({
            container: graphRef.value as HTMLDivElement,
            modes: {
              default: [
                {
                  type: "collapse-expand",
                  onChange: function onChange(item, collapsed) {
                    const data = (item as Item).getModel();
                    data.collapsed = collapsed;
                    return true;
                  },
                },
                "drag-canvas",
                "zoom-canvas",
              ],
            },
            defaultNode: {
              size: 26,
              anchorPoints: [
                [0, 0.5],
                [1, 0.5],
              ],
            },
            defaultEdge: {
              type: "cubic-horizontal",
            },
            plugins: [miniMap.value, tooltip.value],
            layout: {
              type: "compactBox",
              direction: "LR",
              getId: function getId(d: any) {
                return d.id;
              },
              getHeight: function getHeight() {
                return 20;
              },
              getWidth: function getWidth() {
                return 20;
              },
              getVGap: function getVGap() {
                return 10;
              },
              getHGap: function getHGap() {
                return 100;
              },
            },
          });
          graphIns.value.node((node): Partial<NodeConfig> => {
            let baseConfig: Partial<NodeConfig> = {
              label: node.name as string,
              labelCfg: {
                offset: 10,
                position:
                  node.children && node.children.length > 0 ? "left" : "right",
              },
            }
            if (node?.isDep) {
              baseConfig = {
                ...baseConfig,
                style: {
                  shadowBlur: 10,
                  fill: '#1a414e',
                  stroke: 'black'
                },
              }
            }
            return baseConfig;
          });
          graphIns.value.on('afterlayout', evt => {
            loading.value = false;
            isFirstRender.value = false;
          })
          graphIns.value.data(graphData.value as unknown as TreeGraphData);
          graphIns.value.render();
          graphIns.value.fitView();
        });
      }
    });
    const autoFitView = useDebounceFn((w:number,h:number) => {
      if (graphIns.value) {
        graphIns.value.changeSize(w,h);
        graphIns.value.fitView(20)
      }
    }, 100)
    useResizeObserver(graphRef, (entries) => {
      const entry = entries[0]
      const { width, height } = entry.contentRect
      autoFitView(width, height);
    })

    const selectGraphType = ref('project');
    const graphType = [
      {
        label: '项目结构',
        value: 'project'
      },
      {
        label: '模块结构',
        value: 'module'
      }
    ]
    watch(selectGraphType, (newVal,oldVal) => {
      if (newVal === 'project') {
        graphIns.value?.changeData(formatTreeDate(data.value.tree, data.value.entry))
      }
      if (newVal === 'module') {
        graphIns.value?.changeData(formatNodesData(data.value.nodes, data.value.entry));
        showDeps.value = false;
      }
      graphIns.value?.fitView()
    })


    const showDeps = ref(false);
    const disableShowDeps = computed(() => {
      return selectGraphType.value !== 'project'
    })
    watch(showDeps, (newVal) => {
      let targetTreeData = graphIns.value?.save();
      if(newVal === true) {
        targetTreeData = formatDepsData(targetTreeData as unknown as FileTree, data.value.deps, data.value.entry)
      } else {
        targetTreeData = formatTreeDate(targetTreeData as unknown as FileTree, data.value.entry)
      }
      console.log('targetTreeData ===>', targetTreeData);
      graphIns.value?.changeData(targetTreeData);
      graphIns.value?.fitView()
    })

  const handleChangeDir = (val:string) => {
    try {
      if (graphData.value && graphIns.value) {
        const newData = findGraphNode(val,graphData.value);
        if (newData) {
          graphIns.value.changeData(newData)
        } else {
          throw new Error();
        }
      } else {
        throw new Error();
      }
    }catch(e) {
      notice.error({
        meta: '警告',
        content: '无法解析该目录'
      })
    }
  }
    return {
      loading,
      graphRef,
      graphType,
      selectGraphType,
      showDeps,
      disableShowDeps,
      dirOpts,
      dirSrc,
      handleChangeDir
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
        height:90%;
        align-items: flex-start;
        box-shadow: 0px 0px 17px 1px #8080802e;
        display: flex;
        padding: 10px;
        flex-flow: column;
        border-radius: 10px;
        box-sizing: border-box;
        &-item{
          margin: 4px 0px;
          display: flex;
          width: 100%;
          align-items: center;
          &-main {
            margin: 0 4px;
            display: flex;
            flex:1;
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
        right:0px;
        top:0px;
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
