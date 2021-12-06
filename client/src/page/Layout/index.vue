<template>
        <n-space vertical>
    <n-layout :content-style="{height:'100vh'}" has-sider>
      <n-layout-sider
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        :collapsed="collapsed"
        show-trigger
        @collapse="collapsed = true"
        @expand="collapsed = false"
      >
      <Menu :collapsed="collapsed" />
      </n-layout-sider>
      <n-layout embedded>
        <router-view />
      </n-layout>
    </n-layout>
  </n-space>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import {NSpace,NLayout,NLayoutSider} from 'naive-ui';
import Menu from '../../components/Menu.vue';
export default defineComponent({
    name:'Layout',
    components:{
        NSpace,NLayout,Menu, NLayoutSider
    },
    setup() {
        const collapsed = ref(true);
        return {
            collapsed
        }
    },
})
</script>
