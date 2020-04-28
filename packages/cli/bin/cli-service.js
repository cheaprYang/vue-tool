#!/usr/bin/env node
const program = require('commander')
const pkg = require('../package.json')
const Service=require('../dist/service').default
const service = new Service(process.cwd())
program.version(pkg.version, '-v, --version').description('版本')
program
    .command('serve')
    .description('开发环境')
    .action(async (projectName = 'business', options) => {
        console.warn(service.run())
    })

program.parse(process.argv)