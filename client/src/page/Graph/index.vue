<template>
  <div class="graph">
    <n-spin size="large" :show="loading">
      <div class="graph-main-wrapper">
        <div class="graph-tools">
          <div class="graph-tools-panel">
            <div class="graph-tools-panel-item">
                图类型：
                <n-radio-group v-model:value="selectGraphType" name="radiogroup">
                  <n-space>
                    <n-radio v-for="item in graphType" :key="item.value" :value="item.value">
                      {{ item.label }}
                    </n-radio>
                  </n-space>
                </n-radio-group>
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
import { defineComponent, ref, onMounted, nextTick, watch, computed } from "vue";
import G6, {
  Item,
  TreeGraph,
  TreeGraphData,
  NodeConfig,
  Minimap,
  Tooltip,
} from "@antv/g6";
import { useFetch } from "@vueuse/core";
import { NSpin,NRadio, NRadioGroup,NSwitch } from "naive-ui";
import { useMiniMap } from "./hook/useMiniMap";
import { useTooltip } from "./hook/useTooltip"; 
import { useResizeObserver, useDebounceFn } from "@vueuse/core";


export default defineComponent({
  name: "Graph",
  components: { NSpin,NRadio, NRadioGroup, NSwitch },
  setup() {
    const loading = ref(true);
    const isFirstRender = ref(true);
    const graphRef = ref<HTMLDivElement | null>(null);
    const graphIns = ref<TreeGraph | null>(null);
    const [miniMap] = useMiniMap("miniMap",'miniMap');
    const [tooltip] = useTooltip('tooltip');
    const graphData = ref<TreeGraphData | null>(null);
    const { onFetchResponse, data } = useFetch<{
      nodes: FileNode[];
      entry: string;
      tree: FileTree;
    }>(`http://localhost:${window.preloadState.port}/graph`, { method: "GET" }).json();

    const formatDepsData = (tree:FileTree, deps:DependenceNode[], entry:string) => {
      let treeClone = {...tree}
      try {
         treeClone = JSON.parse(JSON.stringify(tree));
      }catch(e){
        console.error(e);
      }
      const depsMap:Record<string, number> = {};
      for(let i=0;i<deps.length;i++) {
        depsMap[deps[i].moduleId] = i;
      };
      const depsPath = Object.keys(depsMap);
      let root = {
        id: entry, 
        name:treeClone.name, 
        path: treeClone.path,
        isFolder:treeClone.isFolder, 
        children:treeClone.children} as unknown as TreeGraphData;
      const stack = [];
      let level = 0;
      stack.push(root);
      while(stack.length) {
        level = level+1;
        let curNode = stack.pop() as TreeGraphData;
        if (depsPath.includes(curNode.moduleId as string)) {
          const depIndex = depsMap[curNode.moduleId as string];
          const dep = deps[depIndex];
          curNode['fileSize'] = dep.fileSize || 0;
          curNode['ctime'] = dep.ctime;
          curNode['mtime'] = dep.utime;
          curNode['importTimes'] = dep?.reference?.length;
          curNode['isDep'] = true
        }
       if(curNode?.children?.length) {
         for( let i = 0; i < curNode.children.length; i++) {
          const child = curNode.children[i];
          child.id = `${child.path}-${level}`;
          stack.push(child)
         }
       } else {
        curNode.id = `${curNode.path}-${level}`;
       }
      };
      // console.log('root ===>', {...root});
      return root
    }

    /**
     * 格式化扁平数组为树结构方法，因为每个模块名称有可能相同，所以不能直接作为id，需要随机分配
     * @author chris lee
     * @Time 2021/08/17
     */
    const formatNodesData = (nodes: FileNode[], entry: string) => {
      const uniqueArray: string[] = [];
      const root: TreeGraphData = { id: entry, children: [], name: entry };
      const target = nodes.map((node, idx) => {
        let result: TreeGraphData = {
          id: node.path,
          children: [],
          name: node.name,
        };
        if (uniqueArray.includes(node.path)) {
          result.id = node.path + `${idx}`;
        } else {
          uniqueArray.push(node.path);
        }
        result = { ...result, ...node };
        if (node.deps.length) {
          result.children = node.deps.map((dep, i) => {
            let item = { id: dep.path, childen: [], name: dep.name };
            if (uniqueArray.includes(dep.path)) {
              item.id = `${Math.random() * 10}` + dep.path;
            } else {
              uniqueArray.push(dep.path);
            }
            item = { ...item, ...dep };
            return item;
          });
        }
        return result;
      });
      if (target.length) {
        root?.children?.push(...target);
      }
      return root;
    };

    /**
     * 递归生成树结构方法
     */
    const formatTreeDate = (tree: FileTree, entry: string) => {
      let treeClone = {...tree}
      try {
         treeClone = JSON.parse(JSON.stringify(tree));
      }catch(e){
        console.error(e);
      }
      let root = {
        id: entry, 
        name:treeClone.name, 
        path: treeClone.path, 
        isFolder:treeClone.isFolder, 
        children:treeClone.children} as unknown as TreeGraphData;
      const stack = [];
      let level = 0;
      stack.push(root);
      while(stack.length) {
        level = level+1;
        const curNode = stack.pop() as TreeGraphData;
       if(curNode?.children?.length) {
         const normalizeChildren = curNode.children.map(node => {
           return {
             ...node,
             id: `${node.path}-${level}`,
           }
         });
         stack.push(...normalizeChildren);
       } else {
        curNode.id = `${curNode.path}-${level}`
       }
      };
      return root
    }
    onFetchResponse((res) => {
      if (res.status === 200) {
        loading.value = false;
        graphData.value = formatTreeDate(data.value.tree, data.value.entry);
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
          graphIns.value.data(graphData.value as unknown as TreeGraphData);
          graphIns.value.render();
          graphIns.value.fitView();
          isFirstRender.value = false;
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
      let targetTreeData = graphData.value;
      if(newVal === true) {
        targetTreeData = formatDepsData(data.value.tree, data.value.deps, data.value.entry)
      } else {
        targetTreeData = formatTreeDate(data.value.tree, data.value.entry)
      }
      console.log('targetTreeData ===>', targetTreeData);
      graphIns.value?.changeData(targetTreeData);
      graphIns.value?.fitView()
    })

    return {
      loading,
      graphRef,
      graphType,
      selectGraphType,
      showDeps,
      disableShowDeps
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
