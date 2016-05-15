const assert = require('assert');

module.exports = ({
    number,
    name,
    content,
}) => {
    assert(number);
    assert(content);

    return `<h1>Chapter ${number}${name ? `: ${name}` : ''}</h1>${content}<br>`;
};
