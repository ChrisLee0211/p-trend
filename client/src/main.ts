import { createApp } from 'vue';
import router from './router';
import App from './App.vue';
// 通用字体
import 'vfonts/Lato.css';
// 等宽字体
import 'vfonts/FiraCode.css';
if(import.meta.env.DEV) {
    window.preloadState = {
        port: 8080
    };
}

createApp(App).use(router).mount('#app');