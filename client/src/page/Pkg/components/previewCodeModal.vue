<template>
  <n-modal v-model:show="visible" preset="dialog" title="代码预览">
    <template #header>
      <div>代码预览</div>
    </template>
    <div class="preview">
      <section class="head"></section>
      <section class="body"></section>
    </div>
    <template #action>
      <n-button>关闭</n-button>
    </template>
  </n-modal>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { NModal, NButton, NSkeleton, NSpace, useNotification } from "naive-ui";
import axios from "axios";

export default defineComponent({
  components: {
    NModal,
    NButton,
    NSkeleton,
    NSpace,
  },
  props: {
    visible: {
      type: Boolean,
      require: true,
      default: false,
    },
    path: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const code = ref("");
    const loading = ref(true);
    const isFetching = ref(false);
    const notice = useNotification();

    const init = (path: string) => {
      if(isFetching.value) return 
      loading.value = true;
      isFetching.value = true;
      axios
        .post(`http://localhost:${window.preloadState.port}/pkg/readContent`, {
          path,
        })
        .then((res) => {
          if (res.data) {
            code.value = res.data;
            loading.value = false;
          } else {
            throw new Error();
          }
        })
        .catch((err) => {
          notice.error({
            meta: "提示",
            content: "加载文件失败",
          });
        });
    };

    watch(props, (newValue, oldValue) => {
      if (newValue.visible === true && newValue.path) {
        init(newValue.path);
      }
    });
  },
});
</script>
