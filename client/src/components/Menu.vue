<template>
    <n-menu
          :collapsed="collapsed"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          :options="menuOptions"
          :render-icon="renderMenuIcon"
          @update:value="handleClick"
        />
</template>
<script lang="ts">
import { defineComponent, ref, PropType, Ref, onBeforeMount, h} from 'vue'
import {NMenu, MenuOption, NIcon} from 'naive-ui';
import {AnalyticsOutline,BarChart,List, LogoNpm} from '@vicons/ionicons5';
import { routes } from '../router/index';
import { useRouter } from 'vue-router';

export default defineComponent({
    name:"Menu",
    components:{
        'n-menu': NMenu,
    },
    props:{
        collapsed: {
            type: Boolean,
            require:true,
        }
    },
    setup(props, ctx) {
        const menuOptions:Ref<MenuOption[]> = ref([]);
        const router = useRouter();
        onBeforeMount(() => {
            const root = routes.find(route => route.name === 'Layout');
            if (root && root.children?.length) {
                menuOptions.value = root.children.map((route) => {
                    return {
                        label: route.meta?.title as string,
                        key: route.path
                    }
                })
            }
        })
       const renderMenuIcon  = (opt:MenuOption) => {
        if (opt.key === '/graph') return h(NIcon, null, { default: () => h(AnalyticsOutline) })
        if (opt.key === '/chart') return h(NIcon, null, { default: () => h(BarChart) })
        if (opt.key === '/table') return h(NIcon, null, { default: () => h(List) })
        return h(NIcon, null, { default: () => h(LogoNpm) })
      }
      const handleClick = (key: string, item: MenuOption) => {
        router.push({path:key})
      }
        return {
            menuOptions,
            renderMenuIcon,
            handleClick
        }
    },
})
</script>
