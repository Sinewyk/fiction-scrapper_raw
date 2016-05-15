#!/usr/bin/env node

/* eslint no-process-exit: 0, no-console: 0 */

const program = require('commander');
const pkg = require('../package.json');
const main = require('../index');

function exit(err) {
    console.err(err);
    process.exit(1);
}

program
    .version(pkg.version)
    .arguments('<uri>')
    .option('-t, --title', 'Personalize title')
    .action((uri, options) => {
        if (!uri) {
            exit(new Error('No uri given'));
        }
        main(uri, options).catch(err => {
            exit(err);
        });
    })
    .parse(process.argv);
