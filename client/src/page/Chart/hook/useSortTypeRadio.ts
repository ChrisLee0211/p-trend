import { ref } from 'vue';

export const useSortTypeRadio = () => {
    const sortType = ref<'up' | 'down'>('down');
    const sortTypeOptions:Array<{label:string, value: 'up'| 'down'}> = [
        {
            label: '升序',
            value: 'up'
        },
        {
            label: '倒序',
            value: 'down'
        }
    ];
    return {
        value:sortType,
        sortOptions: sortTypeOptions
    };

};