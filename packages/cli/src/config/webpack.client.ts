import path from "path";
import {ServiceI} from "../service";
export default (api:ServiceI)=>{
    const clientTemplate=path.resolve(api.publicDir,'index.html')
    api.webpackConfig.output.filename('js/[name].[contenthash].js')
        .chunkFilename('js/[name].[chunkhash].js')
    api.webpackConfig.module
        .rule('typescript')
        .test(/\.tsx?$/)
        .exclude
        .add(/node_modules/)
        .end()
        .use('ts-loader')
        .loader('ts-loader');

    api.webpackConfig.plugin('clean').use(require('clean-webpack-plugin'))
    api.webpackConfig.plugin('html').use(require('html-webpack-template'), [{
        filename: 'index.html',
        template: clientTemplate,
        inject: true,
    }])
}

