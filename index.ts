require('any-promise/register/bluebird');

import {getHostConfig} from './hostsConfig';
const headerTemplate = require('./headerTemplate');
const chapterTemplate = require('./chapterTemplate');
const fetcher = require('./fetcher');
const writer = require('./writer');
const co = require('co');
const async = require('bluebird').promisifyAll(require('async'));

function* _main(uri, options) { // eslint-disable-line spaced-comment
    const limit = options.limit || 5;
    const hostConfig = yield getHostConfig(uri);
    const infos = yield hostConfig.getInfos(uri);

    // override some stuff to just not worry too much about meta data when we don't want to
    if (options.title) {
        infos.title = options.title;
    }

    let contents = headerTemplate(infos);
    let currentChapter = 1;

    while (true) { // eslint-disable-line no-constant-condition
        const urisP = [];
        for (let i = 0; i < limit; ++currentChapter, ++i) {
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
        // @FIXME (sinewyk): good time for progress tracking ... use Observables instead of Promises
        console.log(`Progress on ${uri}, around chapter ${currentChapter - 1}`); // eslint-disable-line no-console
        if (results.length !== nullFiltered.length) {
            break;
        }
    }

    const filename = `${infos.title}${infos.book ? ` - Book ${infos.book}` : ''}.html`;
    yield writer(filename, contents);
    console.log(`Output written to ${filename}`); // eslint-disable-line no-console
    return filename;
}

function main(...options) {
    return co.wrap(_main)(...options);
}

module.exports = main;
