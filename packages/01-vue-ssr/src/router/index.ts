import Vue from 'vue';
import Router from 'vue-router';
import Main from '@/views/main';
Vue.use(Router);
export  default ()=>{
    return new Router({
        mode: 'history',
        routes:[
            {
                path:'/',
                name: 'login',
                component:Main,
                meta:{title:"登录"},
            },

        ]
    })
}