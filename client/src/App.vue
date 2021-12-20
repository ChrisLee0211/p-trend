<template>
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
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import PageLoading from "./components/PageLoading.vue";
import Layout from "./page/Layout/index.vue";
import { NDialogProvider, NNotificationProvider } from "naive-ui";

export default defineComponent({
  name: "App",
  components: {
    PageLoading,
    Layout,
    NDialogProvider,
    NNotificationProvider,
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
