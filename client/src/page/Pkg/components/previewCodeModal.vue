<template>
  <n-modal 
  v-model:show="visible" 
  display-directive="if"  
  preset="dialog" 
  @update-show="onTogle"
  title="代码预览">
    <template #header>
      <div>代码预览</div>
    </template>
        <div class="preview">
        <section class="head" :title="path"> 文件路径: {{path}}</section>
        <section class="body">
                <n-skeleton v-if="loading" text :repeat="8" />
                <n-code :hljs="hljs" v-else :code="code" :language="codeType" word-wrap ></n-code>
        </section>
        </div>
    <template #action>
      <n-button>关闭</n-button>
    </template>
  </n-modal>
</template>
<script lang="ts">
import { defineComponent, ref, watch, PropType } from "vue";
import { NModal, NButton, NSkeleton, NSpace, useNotification,NCode } from "naive-ui";
import axios from "axios";
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import css from 'highlight.js/lib/languages/css';
import less from 'highlight.js/lib/languages/less';
import scss from 'highlight.js/lib/languages/scss';
import typescript from 'highlight.js/lib/languages/typescript';
import markdown from 'highlight.js/lib/languages/markdown';

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('css', css)
hljs.registerLanguage('less', less)
hljs.registerLanguage('scss', scss)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('markdown', markdown)

const codeTypeMap = {
    'js':'javascript',
    'css':'css',
    'less':'less',
    'scss':'scss',
    'ts':'typescript',
    'tsx': 'typescript',
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
    onTogle: {
        type: Function as PropType<(val:boolean)=>void>,
        default: () => {}
    }
  },
  setup(props) {
    const code = ref("");
    const loading = ref(true);
    const isFetching = ref(false);
    const notice = useNotification();
    const codeType = ref<string>('javascript')

    const init = (path: string) => {
      if(isFetching.value) return 
      loading.value = true;
      isFetching.value = true;
      const pathSplitArr = path.split('.');
      const extname = pathSplitArr[pathSplitArr.length - 1];
      console.log(' extname ===>', extname);
      if (extname in codeTypeMap) {
          codeType.value = codeTypeMap[extname as keyof typeof codeTypeMap]
      } else {
          codeType.value = 'markdown'
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

    watch(codeType, () => {
        console.log(codeType.value)
    })
    return {
        codeType,
        code,
        loading,
        hljs
    }
  },
});
</script>
<style lang="scss" scoped>
.preview {
    height: 70vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    .head {
        text-overflow: ellipsis;
        height: 30px;
        white-space: nowrap;
        overflow: hidden;
    }
    .body {
        flex:1;
        overflow-y: scroll;
        min-height: 50vh;
        background: rgb(223, 222, 219);
    }
}
</style>
