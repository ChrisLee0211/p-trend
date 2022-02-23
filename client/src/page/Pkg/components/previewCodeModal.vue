<template>
  <n-modal v-model:show="visible" preset="dialog" title="代码预览">
    <template #header>
      <div>代码预览</div>
    </template>
    <div class="preview">
      <section class="head"></section>
      <section class="body">
          <n-code :code="code" :lang="codeType"></n-code>
      </section>
    </div>
    <template #action>
      <n-button>关闭</n-button>
    </template>
  </n-modal>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { NModal, NButton, NSkeleton, NSpace, useNotification,NCode } from "naive-ui";
import axios from "axios";

const codeTypeMap = {
    'js':'javascript',
    'css':'css',
    'less':'less',
    'scss':'scss',
    'typescript':'typescript',
    'md': 'markdown'
}

export default defineComponent({
  components: {
    NModal,
    NButton,
    NSkeleton,
    NSpace,
    NCode
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
    const codeType = ref<string>('js')

    const init = (path: string) => {
      if(isFetching.value) return 
      loading.value = true;
      isFetching.value = true;
      const pathSplitArr = path.split('.');
      const extname = pathSplitArr[pathSplitArr.length - 1];
      if (extname in codeTypeMap) {
          codeType.value = codeTypeMap[extname as keyof typeof codeTypeMap]
      } else {
          codeType.value = 'md'
      }
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

    return {
        codeType,
        code,
    }
  },
});
</script>
