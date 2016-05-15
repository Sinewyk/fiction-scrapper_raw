const request = require('superagent');
const Promise = require('bluebird');

module.exports = function(uri) {
    return new Promise((resolve, reject) => {
        request.get(uri).timeout(15000).end((err, res) => {
            // resolving to null, it's not an error, it's that we have to stop =D
            // will probably have to move this in host config later :o ...
            if (err && err.status === 404) {
                return resolve(null);
            }
            // 4** and 5** are errors by default with superagent
            if (err) {
                return reject(err);
            }
            return resolve(res.text);
        });
    });
};
