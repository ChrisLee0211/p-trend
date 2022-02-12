<template>
  <div class="pkg">
    <div class="header">Packages</div>
    <div class="content">
      <!-- 依赖词云图 -->
      <section class="content-chart">
        <div v-show="chartLoading" class="loading-wrapper">
          <n-spin size="large" :show="chartLoading"></n-spin>
        </div>
        <div id="word-cloud"></div>
      </section>
      <!-- 依赖列表 -->
      <section class="content-list">
        <header>
          <div class="total">
              共 
              <n-number-animation ref="numberAnimationInstRef" :from="0" :to="chartData.length" />
              个第三方依赖</div>
          <dir class="sort">
            <n-radio-group v-model:value="sort" name="sort">
              <n-space>
                <n-radio value="down"> 倒序 </n-radio>
                <n-radio value="up"> 升序 </n-radio>
              </n-space>
            </n-radio-group>
          </dir>
        </header>
        <n-collapse>
          <n-collapse-item
            v-for="item in chartData"
            :key="item.name"
            :name="item.name"
            :title="`${item.name}`"
          >
            <template #header-extra>共被引用了{{ item.count }}次</template>
            <li
              class="reference-path"
              v-for="path in item.reference"
              :key="path"
            >
              <div class="reference-path-name">路径:{{ path }}</div>
              <n-button text quaternary type="primary">预览</n-button>
            </li>
          </n-collapse-item>
        </n-collapse>
      </section>
    </div>
  </div>
</template>
<script lang="ts">
import { useFetch } from "@vueuse/core";
import { defineComponent, ref, watchEffect } from "vue";
import { WordCloud } from "@antv/g2plot";
import { NSpin, NCollapse, NCollapseItem, NButton, NRadioGroup,NSpace,NRadio, NNumberAnimation } from "naive-ui";

interface NpmListItem {
  count: number;
  reference: string[];
  name: string;
}

export default defineComponent({
  name: "package",
  components: {
    NSpin,
    NCollapseItem,
    NCollapse,
    NButton,
    NRadioGroup,
    NSpace,
    NRadio,
    NNumberAnimation
  },
  setup() {
    const chartIns = ref<WordCloud | null>(null);
    const chartData = ref<NpmListItem[]>([]);
    const chartLoading = ref(true);
    const { onFetchResponse, data } = useFetch<{ deps: NpmListItem[] }>(
      `http://localhost:${window.preloadState.port}/pkg`
    ).json<{ deps: NpmListItem[] }>();
    onFetchResponse((res) => {
      if (data.value !== null) {
        chartData.value = data.value.deps;
        chartIns.value = new WordCloud("word-cloud", {
          data: data.value.deps,
          wordField: "name",
          weightField: "count",
          colorField: "name",
          wordStyle: {
            fontFamily: "Verdana",
            fontSize: [8, 32],
            rotation: 0,
          },
          // 返回值设置成一个 [0, 1) 区间内的值，
          // 可以让每次渲染的位置相同（前提是每次的宽高一致）。
          random: () => 0.5,
        });
        chartIns.value.update({
          theme: {
            styleSheet: {
              brandColor: "#5B8FF9",
              paletteQualitative10: [
                "#5B8FF9",
                "#61DDAA",
                "#65789B",
                "#F6BD16",
                "#7262fd",
                "#78D3F8",
                "#9661BC",
                "#F6903D",
                "#008685",
                "#F08BB4",
              ],
              paletteQualitative20: [
                "#5B8FF9",
                "#CDDDFD",
                "#61DDAA",
                "#CDF3E4",
                "#65789B",
                "#CED4DE",
                "#F6BD16",
                "#FCEBB9",
                "#7262fd",
                "#D3CEFD",
                "#78D3F8",
                "#D3EEF9",
                "#9661BC",
                "#DECFEA",
                "#F6903D",
                "#FFE0C7",
                "#008685",
                "#BBDEDE",
                "#F08BB4",
                "#FFE0ED",
              ],
            },
          },
        });
        chartIns.value.render();
        chartLoading.value = false;
      }
    });

    const sort = ref<"up" | "down">("down");
    watchEffect(() => {
      if (sort.value === "up") {
        chartData.value = chartData.value.sort((a, b) => {
          return a.count - b.count;
        });
      } else {
        chartData.value = chartData.value.sort((a, b) => {
          return b.count - a.count;
        });
      }
    });

    return {
      chartLoading,
      chartData,
      sort,
    };
  },
});
</script>
<style lang="scss">
.pkg {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px;
  box-sizing: border-box;
  .header {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
    margin-bottom: 10px;
    border-radius: 5px;
    box-shadow: 0px 0px 17px 1px #8080802e;
  }
  .content {
    width: 100%;
    flex: 1;
    min-height: 200px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-chart {
      width: 65%;
      height: 100%;
      position: relative;
      border-radius: 5px;
      box-shadow: 0px 0px 17px 1px #8080802e;
      .loading-wrapper {
        position: absolute;
        top: 0px;
        bottom: 0px;
        left: 0px;
        right: 0px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      #word-cloud {
        width: 100%;
        height: 100%;
      }
    }
    &-list {
      width: 35%;
      height: 100%;
      box-shadow: 0px 0px 17px 1px #8080802e;
      border-radius: 5px;
      overflow-y: scroll;
      margin-left: 10px;
      /* padding: 16px 0px; */
      box-sizing: border-box;
      & header {
        padding: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .total {
          font-size: 20px;
        }
        .sort {
        }
      }
      .n-collapse-item {
        content-visibility: auto;
      }
      .reference-path {
        padding: 5px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        &-name {
          margin-right: 10px;
        }
      }
    }
  }
}
</style>
