import * as assert from 'assert';

// const dateFormat = 'dddd D MMMM YYYY'
interface Header {
    title: string
    author: string
    status: string
    summary: string
    genre: string
    category: string
}

module.exports = ({
    title,
    author = 'Unknown author',
    status = 'In progress',
    summary = '',
    genre = '',
    category = '',
}: Header): string => {
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
