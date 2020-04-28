import Vue from 'vue'
import { Route } from 'vue-router';
import {Store} from "vuex";

declare module '*.vue' {
    import Vue from 'vue';
    export default Vue;
}

declare module 'vue/types/options' {

    interface VueContext {
        route: Route;
        store: Store<any>;
    }
    interface ComponentOptions<V extends Vue> {
        asyncData?(context: VueContext): Promise<object>;
    }
}