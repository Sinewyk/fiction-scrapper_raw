module.exports = ({
    number,
    name,
    content,
}) => {
    if (!content) {
        return '';
    }

    if (!number) {
        return content;
    }

    return `<h1>Chapter ${number}${name ? `: ${name}` : ''}</h1>${content}<br>`;
};
