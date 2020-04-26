
import path from "path";
import {ServiceI} from "../service";

export default (api:ServiceI)=>{
    const rootDir = path.resolve(api.context, 'src')
    const resolve = (p:string):string => path.resolve(rootDir, p);
    api.webpackConfig
        // Interact with entry points
        .target('web')
        .mode( 'development')
        .entry('main')
        .add(resolve('main.ts'))
        .end()

        .output
        .path('dist')
        .filename('[name].bundle.js')
        .publicPath('/');

    api.webpackConfig.devtool('source-map');
    api.webpackConfig.resolve.extensions
        .merge([ '.ts', '.tsx', '.js', '.json', '.wasm','.scss', '.css'])
        .end()
        .modules
        .add('node_modules')
        .end()
        .alias
        .set('@', rootDir)
        .set(
            'vue$',
            'vue/dist/vue.esm.js'
        );
    api.webpackConfig.module.noParse(/^(vue|vue-router|vuex|vuex-router-sync)$/)

};
