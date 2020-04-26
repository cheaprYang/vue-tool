const path = require('path')
const rimraf=require('rimraf')
const execa = require('execa');
const chalk = require('chalk');
const {targets}=require('./utils');
const log = console.log;
const time= Date.now()
async function buildAll() {
    for (const target of targets) {
        await build(target)
    }
    await execa.command(`rollup -c --environment NODE_ENV:production,librarys:${targets.join('_')}`,{ stdio: 'inherit' })
    log(chalk.green(`All packages packed successfully, time:${Date.now()-time}ms`));
}
async function build(target) {
    const pkgDir = path.resolve(`packages/${target}`);
    rimraf.sync(`${pkgDir}/dist`);


}
buildAll()