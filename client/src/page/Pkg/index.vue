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
      <section class="content-list"></section>
    </div>
  </div>
</template>
<script lang="ts">
import { useFetch } from "@vueuse/core";
import { defineComponent, ref } from "vue";
import { WordCloud } from "@antv/g2plot";
import {
  NSpin,
} from "naive-ui";

interface NpmListItem {
  count: number;
  reference: string[];
  name: string;
}

export default defineComponent({
  name: "package",
  components:{NSpin},
  setup() {
    const chartIns = ref<WordCloud | null>(null);
    const chartData = ref<NpmListItem[]>()
    const chartLoading = ref(true);
    const { onFetchResponse, data } = useFetch<{deps:NpmListItem[]}>(
      `http://localhost:${window.preloadState.port}/pkg`
    ).json<{deps:NpmListItem[]}>();
    onFetchResponse((res) => {
        console.log('data ===>', data.value)
      if (data.value !== null) {
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
        chartLoading.value = false
      }
    });

    return {
      chartLoading,
    };
  },
});
</script>
<style lang="scss">
.pkg {
    width:100%;
    height:100%;
    display: flex;
    flex-direction: column;
    padding: 10px;
    .header {
        width:100%;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 30px;
        margin-bottom: 10px;
        border-radius: 5px;
        box-shadow: 0px 0px 4px 0px #8080805e;
    }
    .content{
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
            box-shadow: 0px 0px 4px 0px #8080805e;
            .loading-wrapper {
                position: absolute;
                top: 0px;
                bottom: 0px;
                left: 0px;
                right: 0px;
                display: flex;
                justify-content: center;
                align-items: center;
            };
            #word-cloud {
                width: 100%;
                height: 100%;
            }
        }
        &-list {
            width: 35%;
            height: 100%;
        }
    }
}
</style>
