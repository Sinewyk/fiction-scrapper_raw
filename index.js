/* eslint no-console: 0, no-process-exit: 0 */

require('any-promise/register/bluebird');

const hostsConfig = require('./hostsConfig');
const getHostConfig = hostsConfig.getHostConfig;
const headTemplate = require('./templates/head');
const chapterTemplate = require('./templates/chapter');
const fetcher = require('./fetcher');
const writer = require('./writer');
const co = require('co');

function* _main(uri/*, options */) {
    const hostConfig = yield getHostConfig(uri);
    const infos = yield hostConfig.getInfos(uri);
    let contents = headTemplate(infos);
    let currentChapter = 1;

    const chapter = chapterTemplate({
        content: yield hostConfig.getChapterUri(uri, currentChapter)
            .then(fetcher)
            .then(hostConfig.getChapterContent),
    });
    contents += chapter;

    currentChapter++;

    const filename = `${infos.title}${infos.book ? ` - Book ${infos.book}` : ''}.html`;
    yield writer(filename, contents);

    return filename;
}

function main(...options) {
    return co.wrap(_main)(...options);
}

module.exports = main;

// debug, link this to command cli later ...
main('https://www.wuxiaworld.com/tdg-index/tdg-chapter-1')
.then(filename => console.log(`Output written to ${filename}`))
.catch(err => {
    console.error(err);
    process.exit(1);
});
