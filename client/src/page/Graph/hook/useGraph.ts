import G6, { Item, NodeConfig, TreeGraph, TreeGraphData } from '@antv/g6';
import {markRaw, nextTick, Ref, ref} from 'vue';

export const useGraph = (containerRef: Ref<HTMLDivElement | null>) => {
    const readOnlyIns = markRaw<{graphIns:TreeGraph | null}>({graphIns:null});
    // const graphIns = ref<TreeGraph | null>(null);
    const isFirstRender = ref(true);
    const loading = ref(true);
    const initGraph = (data: TreeGraphData, plugins:any[]) => {
        if(data&& isFirstRender.value) {
            nextTick(() => {
                readOnlyIns.graphIns = new G6.TreeGraph({
                  container: containerRef.value as HTMLDivElement,
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
                      {
                          type: "zoom-canvas",
                          enableOptimize: false,
                      }
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
                  plugins,
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
                readOnlyIns.graphIns.node((node): Partial<NodeConfig> => {
                  let baseConfig: Partial<NodeConfig> = {
                    label: node.name as string,
                    labelCfg: {
                      offset: 10,
                      position:
                        node.children && node.children.length > 0 ? "left" : "right",
                    },
                  };
                  if (node?.isDep) {
                    baseConfig = {
                      ...baseConfig,
                      style: {
                        shadowBlur: 10,
                        fill: "#1a414e",
                        stroke: "black",
                      },
                    };
                  }
                  return baseConfig;
                });
                readOnlyIns.graphIns.on("afterlayout", (evt) => {
                  isFirstRender.value = false;
                  loading.value = false;
                });
                readOnlyIns.graphIns.data(data as unknown as TreeGraphData);
                readOnlyIns.graphIns.render();
                readOnlyIns.graphIns.fitView();
              });
        }
    };

    return {
        graphRaw: readOnlyIns,
        initGraph,
        loading
    };
};