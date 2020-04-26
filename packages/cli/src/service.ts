import Config from 'webpack-chain';
import WebpackCore from './config/webpack.core';
import WebpackClient from './config/webpack.client';
import WebpackServer from './config/webpack.server';
import path from "path";
import webpack, {ICompiler} from 'webpack';
export interface ServiceI {
     context:string;
     publicDir:string;
     outDir:string;
     webpackConfig:Config;
        mode:string;
    serverCompiler?:ICompiler
    // [key:string]:any
}
export default class Service implements ServiceI{
    public context:string;
    public publicDir:string;
    public outDir:string;
    public webpackConfig:Config;
    public mode:string
    constructor() {
        this.context='./';
        this.mode='test'
        this.webpackConfig = new Config();
        this.publicDir= path.resolve(this.context, 'public')
        this.outDir= path.resolve(this.context, 'dist');
        WebpackCore(this)
        WebpackClient(this)
        // WebpackServer(this)
        return this
    }
    public async run(){
        const serverCompiler = webpack(this.webpackConfig.toConfig());
    }

}
const test=new Service()