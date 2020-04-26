#!/usr/bin/env node
const program = require('commander')
const pkg = require('../package.json')
program.version(pkg.version, '-v, --version').description('版本')
program
    .command('create <projectName>')
    .option('-t, --template <templateName>')
    .description('创建 veronica 模块')
    .action(async (projectName = 'business', options) => {
        console.warn(projectName,options)
    })

program.parse(process.argv)