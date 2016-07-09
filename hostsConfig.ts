const Promise = require('bluebird');
const url = require('url');
const _ = require('lodash');
import {load} from 'cheerio';

// non immutable method
// replace a with span and strip script tags
function defaultFilter(root): void {
    root.find('a').each(function() {
        const $this = load(this).root();
        const innerHtml = $this.html();
        $this.replaceWith(`<span>${innerHtml}</span>`);
    });
    root.find('script').remove();
};

interface HostConfig {
    host: string;
    https: boolean;
    test: RegExp;
    description: string;
    getChapterUri: Function;
    getChapterContent: Function;
    getInfos: Function;
}

interface HostInfos {
    title: string;
}

const _supportedHosts: Array<HostConfig> = [{
    host: 'www.wuxiaworld.com',
    https: true,
    test: /chapter/,
    description: `You need to directly send a uri to a chapter and we'll do the rest`,
    getChapterUri: (uri: string, neededChapter: number) => new Promise(resolve => {
        return resolve(uri.split('-').slice(0, -1).concat(neededChapter.toString()).join('-'));
    }),
    getChapterContent(html: string): Promise<string> {
        return new Promise(resolve => {
            const root = load(html).root();
            defaultFilter(root);
            resolve(root.find('.entry-content').toString());
    })},
    getInfos: (uri: string): Promise<HostInfos> => new Promise(resolve => {
        const infos: HostInfos = {
            title: uri.split('-chapter').shift().split('/').pop(),
        };
        return resolve(infos);
    }),
}];

const getHostConfig = (uri, supportedHosts = _supportedHosts) => new Promise((resolve, reject) => {
    const parsedUri = url.parse(uri);
    const match = {
        host: parsedUri.host,
    };
    if (!parsedUri.protocol) {
        return reject(new Error(`No protocol`));
    }
    if (parsedUri.protocol === 'https:') {
        match.https = true;
    }
    const found = _.find(supportedHosts, match);
    if (found) {
        return resolve(found);
    }
    return reject(new Error(`Host not supported "${uri}"`));
});

export {
    _supportedHosts as supportedHosts,
    getHostConfig,
}
