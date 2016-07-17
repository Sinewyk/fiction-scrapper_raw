interface Chapter {
    number: number,
    name: string,
    content: string,
}

module.exports = ({
    number,
    name,
    content,
}: Chapter) => {
    if (!content) {
        return '';
    }

    if (!number) {
        return content;
    }

    return `<h1>Chapter ${number}${name ? `: ${name}` : ''}</h1>${content}<br>`;
};
