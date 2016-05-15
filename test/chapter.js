/* eslint-env mocha */

const chapterTemplate = require('../templates/chapter');
const assert = require('power-assert');

describe('chapterTemplate', function() {
    it('outputs content with some chapter wrapping', function() {
        assert.equal(chapterTemplate({
            number: 1,
            content: 'trololol',
        }), '<h1>Chapter 1</h1>trololol<br>');
    });

    it('outputs content with some chapter wrapping and name if name', function() {
        assert.equal(chapterTemplate({
            number: 1,
            name: 'waza',
            content: 'trololol',
        }), '<h1>Chapter 1: waza</h1>trololol<br>');
    });

    it('output content with no chapter wrapping if no number', function() {
        assert.equal(chapterTemplate({
            content: 'trololol',
        }), 'trololol');
    });

    it('returns empty string if no content', function() {
        assert.equal(chapterTemplate({}), '');
    });
});
