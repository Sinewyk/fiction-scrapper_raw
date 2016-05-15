/* eslint no-console: 0, no-process-exit: 0 */

require('any-promise/register/bluebird');

const hostsConfig = require('./hostsConfig');
const getHostConfig = hostsConfig.getHostConfig;
const headTemplate = require('./templates/head');
const chapterTemplate = require('./templates/chapter');
const fetcher = require('./fetcher');
const writer = require('./writer');
const co = require('co');
const async = require('bluebird').promisifyAll(require('async'));

// tweak this via command line between 3-8
// with a message concerning open sockets & shit
const LIMIT = 5;

function* _main(uri/*, options */) { // eslint-disable-line spaced-comment
    const hostConfig = yield getHostConfig(uri);
    const infos = yield hostConfig.getInfos(uri);
    let contents = headTemplate(infos);
    let currentChapter = 316;

    while (true) { // eslint-disable-line no-constant-condition
        const urisP = [];
        for (let i = 0; i < LIMIT; ++currentChapter, ++i) {
            urisP.push(hostConfig.getChapterUri(uri, currentChapter));
        }
        const uris = yield urisP;
        const tasksArray = uris.map(_uri => callback => { // eslint-disable-line no-loop-func
            fetcher(_uri)
            .then(val => callback(null, val))
            .catch(err => callback(err));
        });
        const results = yield async.parallelAsync(tasksArray);
        const nullFiltered = results.filter(res => res !== null);
        // inspect results, if all not empty => continue, if one or more is empty => mean we reached end of line =D
        const currentContents = yield nullFiltered.map(hostConfig.getChapterContent);
        contents = currentContents.reduce((prev, content) => prev + chapterTemplate({content}), contents); // eslint-disable-line no-loop-func
        if (results.length !== nullFiltered.length) {
            break;
        }
    }

    const filename = `${infos.title}${infos.book ? ` - Book ${infos.book}` : ''}.html`;
    yield writer(filename, contents);
    console.log(`Output written to ${filename}`);
    return filename;
}

function main(...options) {
    return co.wrap(_main)(...options);
}

module.exports = main;
