import {ref, onMounted} from 'vue';
import G6, { Minimap } from '@antv/g6';

export const useMiniMap = (className: string, id:string) => {
    const MinimapPlugin = ref();
    onMounted(() => {
      MinimapPlugin.value = new Minimap({
          container: document.getElementById(id) as HTMLDivElement,
          className,
          type: 'delegate',
          size: [150,150]
        });
    })
    return [ MinimapPlugin];
}