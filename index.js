/* eslint no-console: 0, no-process-exit: 0 */

require('any-promise/register/bluebird');

const hostsConfig = require('./hostsConfig');
const getHostConfig = hostsConfig.getHostConfig;
const headTemplate = require('./templates/head');
const chapterTemplate = require('./templates/chapter');
const fetcher = require('./fetcher');
const writer = require('./writer');
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
    let currentChapter = 1;

    const chapter = chapterTemplate({
        number: currentChapter,
        content: yield hostConfig.getChapterUri(uri, currentChapter)
            .then(fetcher)
            .then(hostConfig.getChapterContent),
    });
    contents += chapter;

    currentChapter++;

    const filename = `${infos.title}${infos.book ? ` - Book ${infos.book}` : ''}.html`;
    yield writer(filename, contents);
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
