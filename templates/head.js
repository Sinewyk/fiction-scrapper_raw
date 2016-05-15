const assert = require('assert');

// const dateFormat = 'dddd D MMMM YYYY'

module.exports = ({
    title,
    author = 'Unknown author',
    status = 'In progress',
    summary = '',
    genre = '',
    category = '',
}) => {
    assert(title);
    assert(author);

    return `<div>
    <div>Story: ${title}</div>
    <div>Author: ${author}</div>
    <div>Status: ${status}</div>
    <div>Summary: ${summary}</div>
    <div>Genre: ${genre}</div>
    <div>Category: ${category}</div>
</div>`;
};

// <div>{t.sprintf(t.ngettext('Chapter : %d', 'Chapters : %d',$ chaptersCount),$ chaptersCount)}</div>
// <div>Published: ${moment$(published).format(dateFormat)}</div>
// <div>Last updated: ${moment$(lastUpdated).format(dateFormat)}</div>
