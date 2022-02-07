<template>
    <div>
        npm
    </div>
</template>
<script lang="ts">
import { useFetch } from '@vueuse/core';
import { defineComponent } from 'vue';


export default defineComponent({
    name:'package',
    setup() {
        const {onFetchResponse} = useFetch(`http://localhost:${window.preloadState.port}/pkg`);
        onFetchResponse((res) => {
            console.log(res);
        })
    },
})
</script>
