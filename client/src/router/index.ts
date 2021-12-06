import {RouteRecordRaw,createRouter,createWebHashHistory} from 'vue-router';
import App from '../App.vue';
import Graph from '../page/Graph/index.vue';
import Chart from '../page/Chart/index.vue';
import Table from '../page/Table/index.vue';
import Layout from '../page/Layout/index.vue';

export const routes:RouteRecordRaw[] = [
    {
        path:'/',
        component:Layout,
        name:'Layout',
        redirect(){return{name:'Graph'}},
        children:[
            {path:'/graph',component:Graph,name:'Graph',meta:{title:'依赖树'}},
            {path:'/chart',component:Chart,name:'Chart',meta:{title:'分析图'}},
            {path:'/table',component:Table,name:'Table',meta:{title:'表格分析'}},
            // {path:'/utils',component:Util,name:'utils',meta:{title:'工具'}},
    ]},
    // {path:'/login',component:Login,name:'Login'} 
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})


export default router