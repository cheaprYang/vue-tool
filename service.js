import Config from 'webpack-chain';
import WebpackCore from './config/webpack.core';
import WebpackClient from './config/webpack.client';
import path from "path";
import webpack from 'webpack';
export default class Service {
    constructor() {
        this.context = './';
        this.mode = 'test';
        this.webpackConfig = new Config();
        this.publicDir = path.resolve(this.context, 'public');
        this.outDir = path.resolve(this.context, 'dist');
        WebpackCore(this);
        WebpackClient(this);
        return this;
    }
    async run() {
        const serverCompiler = webpack(this.webpackConfig.toConfig());
    }
}
const test = new Service();
