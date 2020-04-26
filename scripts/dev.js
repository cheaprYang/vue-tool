const execa = require('execa');
const chalk = require('chalk');
const {targets}=require('./utils');
const log = console.log;
async function build() {
    await execa.command(`rollup -wc --environment NODE_ENV:development,librarys:${targets.join('_')}`,{ stdio: 'inherit' })
    log(chalk.green(`Dev is build success`));
}
build()