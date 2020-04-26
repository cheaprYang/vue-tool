import path from 'path';
import ts from 'rollup-plugin-typescript2';
import auto from '@rollup/plugin-auto-install';
 import replace from '@rollup/plugin-replace';
 import json from '@rollup/plugin-json';
import nodeSesolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
const isProduction=process.env.NODE_ENV === 'production';
const librarys=process.env.librarys.split('_');
if (!librarys.length) {
    throw new Error('没有packages')
}
const VERSION = require('./package.json').version
const packagesDir = path.resolve(__dirname, 'packages')
const resolve = (name,p) => path.resolve(path.resolve(packagesDir, name),p)     //

// function  createPlugin(name) {
//    if (isProduction){
//        const { terser } = require('rollup-plugin-terser')
//        return [
//            terser({
//                module: /^esm/,
//                compress: {
//                    ecma: 2015,
//                    pure_getters: true
//                }
//            })
//        ]
//    }
//    return  []
// }
function createConfig(name) {
    const tsPlugin = ts({
        // check: !isProduction ,
          tsconfig: path.resolve(path.resolve(packagesDir, name), 'tsconfig.json'),
         // cacheRoot: path.resolve(__dirname, 'node_modules/.cache'),
          useTsconfigDeclarationDir:true
    })
   return  {
        input:resolve(name,'src/index.ts'),
        output: [
            {
                format: "cjs",
                file: resolve(name,`dist/${name}.cjs-bundler.js`),
                name
            },
            {
                format: "es",
                file:  resolve(name,`dist/${name}.esm-bundler.js`),
                name,
            }
        ],
       watch: {
           include: 'src/**',
       },
        plugins:[
            auto(),
            json(),
            tsPlugin,
            nodeSesolve(),
            commonjs(),
            replace({ NODE_ENV: process.env.NODE_ENV,VERSION })
        ]
    }
}
const rollupConfigs=librarys.map((name)=>createConfig(name))
console.warn(rollupConfigs)
export default rollupConfigs;