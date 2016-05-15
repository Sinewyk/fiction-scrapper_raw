const fs = require('mz/fs');

module.exports = (outputPath, contents) => fs.open(outputPath, 'w').then(fd => fs.write(fd, contents, 0, 'utf8'));
