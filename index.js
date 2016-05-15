/* eslint no-console: 0, no-process-exit: 0 */

require('any-promise/register/bluebird');

const hostsConfig = require('./hostsConfig');
const getHostConfig = hostsConfig.getHostConfig;
const headTemplate = require('./templates/head');
// const fetcher = require('./fetcher');
// const writer = require('./writer');
const co = require('co');
const tap = val => console.log(val);

/*
fetcher(URI).then(contents => console.log(contents)).catch(err => console.error(err));
writer('test.html', contents).catch(err => {
throw err;
});
*/

function* _main(uri/*, options */) {
    const hostConfig = yield getHostConfig(uri);
    const infos = yield hostConfig.getInfos(uri);
    let contents = headTemplate(infos);

    // fetch chapters and concatenate them into contents ... at the hand to avoid GC trashing ?

    return contents;
    /*
    let fileName = infos.title;
    if (infos.book) {
        fileName += ` - Book ${infos.book}`;
    }
    yield writer(fileName, contents);
    */
}

function main(...options) {
    return co.wrap(_main)(...options);
}

module.exports = main;

// debug, link this to command cli later ...
main('https://www.wuxiaworld.com/master-index/dkwss-chapter-1/')
.then(tap)
.catch(err => {
    console.error(err);
    process.exit(1);
});
