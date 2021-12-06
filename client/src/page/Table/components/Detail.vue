<template>
   <n-modal 
   v-model:show="visible" 
   preset="card" 
   size="medium" 
   :style="{width:'60vw'}"
   title="详情信息"
   :bordered="false"
   mask-closable
   @update-show="setDetailVisible"
   >
       <n-skeleton v-if="!detail" text :repeat="5" />
       <section v-else class="table-detail">
           <n-space :vertical="true">
           <div class="table-detail-path">路径：{{detail?.path??''}}</div>
           <div class="table-detail-deps-list">
               <div class="table-detail-deps-list-title">内部依赖：{{detail.deps.length}} 个</div>
               <n-list bordered>
                   <n-list-item v-for="(item) in detail.deps" :key="item.path">
                       {{item.path}}
                   </n-list-item>
               </n-list>
           </div>
           </n-space>
       </section>
   </n-modal>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import {NModal, NList, NListItem, NSkeleton, NSpace} from 'naive-ui';

export default defineComponent({
    name:'fileNodeDetail',
    props:{
        detail:{
            type: Object as PropType<FileNode> | null,
            default: () => null
        },
        visible: {
            type:Boolean,
            default: false
        },
        setDetailVisible: {
            type: Function as PropType<(val:boolean)=>void>,
            default:() => {}
        }
    },
    components:{
        NModal,
        NList,
        NListItem,
        NSkeleton,
        NSpace
    },
    setup() {
        
    },
})
</script>
<style lang="scss" scoped>
.table {
    &-detail{

    }
}
</style>

