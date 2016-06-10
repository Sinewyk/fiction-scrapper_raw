const Promise = require('bluebird');
const url = require('url');
const _ = require('lodash');
const cheerio = require('cheerio');

// non immutable method
// replace a with span and strip script tags
const defaultFilter = root => {
    root.find('a').each(function() {
        const $this = cheerio(this);
        const innerHtml = $this.html();
        $this.replaceWith(`<span>${innerHtml}</span>`);
    });
    root.find('script').remove();
};

const _supportedHosts = [{
    host: 'www.wuxiaworld.com',
    https: true,
    test: /chapter/,
    description: `You need to directly send a uri to a chapter and we'll do the rest`,
    getChapterUri: (uri, neededChapter) => new Promise(resolve => {
        return resolve(uri.split('-').slice(0, -1).concat(neededChapter).join('-'));
    }),
    getChapterContent: html => new Promise(resolve => {
        const root = cheerio.load(html).root();
        defaultFilter(root);
        resolve(root.find('.entry-content').toString());
    }),
    getInfos: uri => new Promise(resolve => {
        const infos = {
            title: uri.split('-chapter').shift().split('/').pop(),
        };
        return resolve(infos);
    }),
}];
exports.supportedHosts = _supportedHosts;

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
exports.getHostConfig = getHostConfig;
