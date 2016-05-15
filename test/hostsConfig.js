/* eslint-env mocha */

const hostsConfig = require('../hostsConfig');
const getHostConfig = hostsConfig.getHostConfig;
const _ = require('lodash');
const assert = require('power-assert');
const assertIsPromise = obj => assert.equal(typeof obj.then, 'function');

const TEST_SUPPORTED_HOSTS = [{
    host: 'www.wuxiaworld.com',
    https: true,
}, {
    host: 'www.no-https.com',
    https: false,
}, {
    host: 'www.test.com',
    https: false,
}];

describe('hostsConfig', function() {
    context('#getHostConfig()', function() {
        const hostNotSupported = 'Host not supported';

        it('returns a promise', function() {
            assertIsPromise(getHostConfig('http://www.test.com', TEST_SUPPORTED_HOSTS));
        });

        it('needs full uri with protocol', function*() {
            try {
                yield getHostConfig('www.test.com', TEST_SUPPORTED_HOSTS);
            } catch (e) {
                assert.equal(e.message, hostNotSupported);
            }
        });

        it('needs explicit https support', function*() {
            try {
                yield getHostConfig('https://www.no-https.com', TEST_SUPPORTED_HOSTS);
            } catch (e) {
                assert.equal(e.message, hostNotSupported);
            }
        });

        it('resolves promise if supported uri', function*() {
            yield getHostConfig('https://www.wuxiaworld.com', TEST_SUPPORTED_HOSTS);
        });
    });

    context('#supportedHosts', function() {
        [{
            host: 'www.wuxiaworld.com',
            baseUri: 'http://www.wuxiaworld.com/a/a-chapter-1/',
            expectedChapterUri: 'http://www.wuxiaworld.com/a/a-chapter-2',
            expectedInfos: {
                title: 'a',
            },
        }].forEach(opt => {
            context(`host: ${opt.host}`, function() {
                context(`#getChapterUri()`, function() {
                    it('returns a promise', function*() {
                        assertIsPromise(_.find(hostsConfig.supportedHosts, {host: opt.host}).getChapterUri(opt.baseUri, 2));
                    });

                    it('generate proper chapter link', function*() {
                        const chapterLink = yield _.find(hostsConfig.supportedHosts, {host: opt.host}).getChapterUri(opt.baseUri, 2);
                        assert.equal(chapterLink, opt.expectedChapterUri);
                    });
                });

                context('#getInfos()', function() {
                    it('returns a promise', function*() {
                        assertIsPromise(_.find(hostsConfig.supportedHosts, {host: opt.host}).getInfos(opt.baseUri));
                    });

                    it('generate correct infos', function*() {
                        const infos = yield _.find(hostsConfig.supportedHosts, {host: opt.host}).getInfos(opt.baseUri);
                        assert.deepEqual(infos, opt.expectedInfos);
                    });
                });
            });
        });

        after(() => {
            assert.equal(this.suites.length, hostsConfig.supportedHosts.length, 'assert we test each domain');
        });
    });
});
