import 'any-promise/register/bluebird';

import {getHostConfig, HostConfig, HostInfos} from './hostsConfig';
const headerTemplate = require('./headerTemplate');
const chapterTemplate = require('./chapterTemplate');
import fetcher from './fetcher';
import writer from './writer';
import {wrap} from 'co';
import * as async from 'async';
import * as Promise from 'bluebird';
const Async = Promise.promisifyAll(async);

function* _main(uri: string, options: any = {}) { // eslint-disable-line spaced-comment
    const limit = options.limit || 5;
    const hostConfig: HostConfig = yield getHostConfig(uri);
    const infos: HostInfos = yield hostConfig.getInfos(uri);

    // override some stuff to just not worry too much about meta data when we don't want to
    if (options.title) {
        infos.title = options.title;
    }

    let contents: string = headerTemplate(infos);
    let currentChapter = 1;

    while (true) { // eslint-disable-line no-constant-condition
        const urisP: Promise<string>[] = [];
        for (let i = 0; i < limit; ++currentChapter, ++i) {
            urisP.push(hostConfig.getChapterUri(uri, currentChapter));
        }
        const uris: string[] = yield urisP;
        const tasksArray = uris.map(
            _uri => (callback: Function) => fetcher(_uri)
                .then(val => callback(null, val))
                .catch(err => callback(err))
        );
        const filterNull = (str: string): str is string => str !== null;
        const results: Array<string | null> = yield Async.parallelAsync(tasksArray);
        const nullFiltered = results.filter(filterNull);
        // inspect results, if all not empty => continue, if one or more is empty => mean we reached end of line =D
        const currentContents: string[] = yield nullFiltered.map(hostConfig.getChapterContent);
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

export default function main(...options: any[]) {
    return wrap(_main)(...options);
}
