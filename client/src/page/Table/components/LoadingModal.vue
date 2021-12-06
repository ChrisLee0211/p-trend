<template>
  <n-modal
    v-model:show="visible"
    preset="card"
    size="medium"
    :style="{ width: '40vw' }"
    title="任务进度"
    :bordered="false"
    :mask-closable="false"
  >
    <n-space :vertical="true">
        <div>正在删除啦，别急～～</div>
        <n-progress
            type="line"
            status="success"
            :height="24"
            :percentage="Number(percent)"
            border-radius="12px 12px 12px 12px"
            >
      {{percent}}%
    </n-progress>
    <div style="color:lightblue">已完成了{{success}}个</div>
    <div style="color:red">有{{fail}}个删除失败了！</div>
    </n-space>
  </n-modal>
</template>
<script lang="ts">
import { defineComponent, computed } from "vue";
import { NModal, NSpace, NProgress } from "naive-ui";
export default defineComponent({
  name: "LoadingModal",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    limit: {
      type: Number,
      default: 1,
    },
    success: {
      type: Number,
      default: 1,
    },
    fail: {
      type: Number,
      default: 0,
    }
  },
  components: {
    NModal,
    NSpace,
    NProgress
  },
  setup(props) {
      const percent = computed(() => {
          const res = Number(props.success+ props.fail)/Number(props.limit);
          return (res * 100).toFixed(0)
      })
      return {
          percent,
      }
  },
});
</script>
