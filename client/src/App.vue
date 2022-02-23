<template>
  <n-config-provider :hljs="hljs">
  <n-dialog-provider>
    <n-notification-provider>
      <div class="container">
        <div class="loading-wrappper" v-if="!isInitFinished">
          <p>还在初始化啊，等一下～</p>
          <PageLoading />
        </div>
        <div class="main-wrapper" v-else>
          <router-view />
        </div>
      </div>
    </n-notification-provider>
  </n-dialog-provider>
  </n-config-provider>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import PageLoading from "./components/PageLoading.vue";
import Layout from "./page/Layout/index.vue";
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import css from 'highlight.js/lib/languages/css';
import less from 'highlight.js/lib/languages/less';
import scss from 'highlight.js/lib/languages/scss';
import typescript from 'highlight.js/lib/languages/typescript';
import markdown from 'highlight.js/lib/languages/markdown';
import { NDialogProvider, NNotificationProvider, NConfigProvider } from "naive-ui";

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('css', css)
hljs.registerLanguage('less', less)
hljs.registerLanguage('scss', scss)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('markdown', markdown)

export default defineComponent({
  name: "App",
  components: {
    PageLoading,
    Layout,
    NDialogProvider,
    NNotificationProvider,
    NConfigProvider
  },
  setup() {
    const isInitFinished = ref(false);
    onMounted(() => {
      setTimeout(() => {
        isInitFinished.value = true;
      }, 2000);
    });
    return {
      isInitFinished,
      hljs
    };
  },
});
</script>

<style>
#app {
  margin: 0 0;
  padding: 0 0;
}
.container {
  width: 100vw;
  height: 100vh;
}
.loading-wrappper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
}
.main-wrapper {
  width: 100%;
  height: 100%;
}
</style>
