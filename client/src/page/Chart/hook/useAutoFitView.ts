import {Ref} from 'vue';
import { Plot } from "@antv/g2plot";
import { useResizeObserver, useDebounceFn } from "@vueuse/core";

export const useAutoFitView = <O ,T extends Plot<O>>(chartIns:Ref<T | undefined>, chartRef:Ref<HTMLElement|undefined>) => {
    const autoFitView = useDebounceFn((w:number,h:number) => {
        if (chartIns.value) {
            chartIns.value.changeSize(w,h)
        }
    });
    useResizeObserver(chartRef, (entries) => {
        const entry = entries[0]
        const { width, height } = entry.contentRect
        autoFitView(width, height);
    })
}