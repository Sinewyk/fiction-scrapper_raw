import * as fs from 'mz/fs';

export default (outputPath: string, contents: string) => fs.open(outputPath, 'w').then(fd => fs.write(fd, contents, 0, 'utf8'));
