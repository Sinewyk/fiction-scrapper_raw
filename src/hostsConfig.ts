import * as Promise from 'bluebird';
import * as url from 'url';
import {find} from 'lodash';
import * as cheerio from 'cheerio';

// non immutable method
// replace a with span and strip script tags
function defaultFilter(root: cheerio.Cheerio) {
    root.find('a').each(function() {
        const $this = cheerio.load(this).root();
        const innerHtml = $this.html();
        $this.replaceWith(`<span>${innerHtml}</span>`);
    });
    root.find('script').remove();
};

export interface HostConfig {
    host: string;
    https: boolean;
    test: RegExp;
    description: string;
    getChapterUri: Function;
    getChapterContent: (html: string) => Promise<string>;
    getInfos: Function;
}

export interface HostInfos {
    title?: string
    book?: number
}

const _supportedHosts: Array<HostConfig> = [{
    host: 'www.wuxiaworld.com',
    https: true,
    test: /chapter/,
    description: `You need to directly send a uri to a chapter and we'll do the rest`,
    getChapterUri: (uri: string, neededChapter: number) => new Promise<string>(resolve => {
        return resolve(uri.split('-').slice(0, -1).concat(neededChapter.toString()).join('-'));
    }),
    getChapterContent(html: string) {
        return new Promise<string>(resolve => {
            const root = cheerio.load(html).root();
            defaultFilter(root);
            resolve(root.find('.entry-content').toString());
    })},
    getInfos: (uri: string) => new Promise<HostInfos>(resolve => {
        const temp = uri.split('-chapter').shift();
        const title = temp && temp.split('/').pop();
        const infos: HostInfos = {
            title,
        };
        return resolve(infos);
    }),
}];

const getHostConfig = (uri: string, supportedHosts = _supportedHosts) => new Promise<HostConfig>((resolve, reject) => {
    const parsedUri = url.parse(uri);
    const match = {
        host: parsedUri.host,
        https: parsedUri.protocol === 'https:',
    };
    if (!parsedUri.protocol) {
        return reject(new Error(`No protocol`));
    }
    const found = find(supportedHosts, match);
    if (found) {
        return resolve(found);
    }
    return reject(new Error(`Host not supported "${uri}"`));
});

export {
    _supportedHosts as supportedHosts,
    getHostConfig,
}
