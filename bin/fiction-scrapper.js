#!/usr/bin/env node

/* eslint no-process-exit: 0, no-console: 0 */

const program = require('commander');
const pkg = require('../package.json');
const fictionScrapper = require('../');

function exit(err) {
    console.error(err);
    process.exit(1);
}

program
    .version(pkg.version)
    .description('Scrap a fiction')
    .arguments('[uris...]')
    .option('-t, --title [title]', 'Personalize title')
    .option('-l, --limit <n>', '# of requests in parallel, defaults to 5', parseInt)
    .action((uris, options) => {
        uris.forEach(uri => {
            fictionScrapper(uri, options)
            .catch(err => exit(err));
        });
    })
    .parse(process.argv);

if (!program.args.length) {
    program.help();
}
