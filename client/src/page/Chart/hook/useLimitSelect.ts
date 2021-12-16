import { ref } from 'vue';

export const useLimitSelect = () => {
    const limitOptions = [
        {
            label: '前5',
            value:5,
        },
        {
            label: '前10',
            value:10,
        },
        {
            label: '前15',
            value:15,
        },
    ];
    const value = ref(limitOptions[0].value);
    return {
        value,
        limitOptions
    };
};