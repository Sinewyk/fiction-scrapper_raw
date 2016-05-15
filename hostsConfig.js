const Promise = require('bluebird');
const url = require('url');
const _ = require('lodash');

const _supportedHosts = [{
    host: 'www.wuxiaworld.com',
    https: true,
    test: /chapter/,
    description: `You need to directly send a uri to a chapter and we'll do the rest`,
    getChapterUri: (uri, neededChapter) => new Promise(resolve => {
        return resolve(uri.split('-').slice(0, -1).concat(neededChapter).join('-'));
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
    if (parsedUri.protocol === 'https:') {
        match.https = true;
    }
    const found = _.find(supportedHosts, match);
    if (found) {
        return resolve(found);
    }
    return reject(new Error('Host not supported'));
});
exports.getHostConfig = getHostConfig;
