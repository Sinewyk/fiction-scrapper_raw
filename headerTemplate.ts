import * as assert from 'assert';

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

    return `<div>
    <div>Story: ${title}</div>
    <div>Author: ${author}</div>
    <div>Status: ${status}</div>
    <div>Summary: ${summary}</div>
    <div>Genre: ${genre}</div>
    <div>Category: ${category}</div>
</div>`;
};
