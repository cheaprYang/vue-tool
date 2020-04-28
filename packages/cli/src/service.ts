import Config from 'webpack-chain';
import path from "path";
import fs,{promises}  from 'fs';
import os  from 'os';
import  MFS from 'memory-fs'
import express from 'express'
import webpack, {ICompiler} from 'webpack';
import {createBundleRenderer}  from 'vue-server-renderer'
import WebpackCore from './config/webpack.core';
import WebpackClient from './config/webpack.client';
import WebpackServer from './config/webpack.server';

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
    private clientManifest:any=null;
    private bundle:any=null;
    private renderer:any=null;
    private resolve:any=null;
    private readyPromise:any=new Promise(r => { this.resolve = r });
    private template:any=null
    constructor(context:string) {
        this.context=context;
        this.mode='test'
        this.webpackConfig = new Config();
        this.publicDir= path.resolve(this.context, 'public')
        this.outDir= path.resolve(this.context, 'dist');
          WebpackCore(this)
          WebpackClient(this)
        // WebpackServer(this)
    }
    public  run(){
        const config=this.webpackConfig.toConfig()
         // const serverCompiler = webpack();
        return config
    }
    public clientConfig():any{
        const config=this.webpackConfig.toConfig();

        return config
    }
    public serverConfig():any{
        const config=this.webpackConfig.toConfig()
        return config
    }
    public async server(){
         // process.env.VUE_SSR = true;
         const app = express();
         const clientConfig=this.clientConfig()
         const serverConfig=this.serverConfig()
         const clientCompiler = webpack(clientConfig);
         const serverCompiler = webpack(serverConfig);
         this.template= await promises.readFile(path.resolve(this.publicDir,'index.html'),'utf-8');
         app.use('/public', express.static(this.publicDir));
         app.use('/', express.static(this.outDir));
         const devMiddleware = require('webpack-dev-middleware')(clientCompiler, {
            publicPath: clientConfig.output.publicPath,
            noInfo: true,
            stats: false,
            logLevel: 'silent',
            serverSideRender: true,
        })
        app.use(devMiddleware)
        clientCompiler.plugin('done', async (stats) => {
            stats = stats.toJson()
            stats.errors.forEach((err:any) => console.error(err))
            stats.warnings.forEach((err:any) => console.warn(err))
            if (stats.errors.length) return
            this.clientManifest = await this.readFile(devMiddleware.fileSystem, 'vue-ssr-client-manifest.json')
            this.update()
        })
        app.use(require('webpack-hot-middleware')(clientCompiler, {
            heartbeat: 1000,
            log: false,
            reload: true,
        }))
        const mfs = new MFS()
        serverCompiler.outputFileSystem = mfs
        serverCompiler.watch({}, async (err, stats:any) => {
            if (err) throw err
            stats = stats.toJson()
            if (stats.errors.length) return
            this.bundle =await this.readFile(mfs, 'vue-ssr-server-bundle.json')
            this.update()
        })
        app.get('*', async (req, res) => {
            const data= await this.readyPromise();
            await this.render(req, res)
        })
        const port = 3000;
        app.listen(port, () => {
            console.log(`server started at localhost:${port}`)
        })
    }
    public async readFile(fs:any,file:string){
        try {
           return JSON.parse(await promises.readFile(fs, 'utf-8'))
        } catch (e) {}
    }
    public update(){
        if (this.bundle && this.clientManifest) {
            this.resolve()
            this.createBundleRenderer()
        }
    }
    createBundleRenderer(){
        this.renderer = createBundleRenderer(this.bundle,{
            clientManifest:this.clientManifest,
            template: this.template,
            basedir: this.outDir,
            runInNewContext: 'once',
        } );
    }
    render(req:any,res:any){
        const s = Date.now()
        const context = {
            title:'', // default title
            url: req.url,
        }
        const handleError = (err:any) => {
            if (err.url) {
                res.redirect(err.url)
            } else if(err.code === 404) {
                // const path_404= resolve('../public/404.html')
                // const template = fs.readFileSync(path_404, 'utf-8')
                res.status(404).send('400')
            } else {
                // const path_500= resolve('../public/500.html')
                // const template_500 = fs.readFileSync(path_500, 'utf-8')
                res.status(500).send('500')
                console.error(`error during render : ${req.url}`)
                console.error(err.stack)
            }
        }
        this.renderer.renderToString(context, (err:any, html:string) => {
            //console.log(context,err,html)
            if (err) {
                return handleError(err)
            }
            //console.log(context.meta.inject().meta.text())
            res.send(html)
            console.log(`whole request: ${Date.now() - s}ms`)
        })
    }

}