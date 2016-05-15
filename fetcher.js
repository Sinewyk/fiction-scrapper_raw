const request = require('superagent');
const Promise = require('bluebird');

module.exports = function(uri) {
    return new Promise((resolve, reject) => {
        request.get(uri).end((err, res) => {
            // 4** and 5** are errors by default with superagent
            if (err) {
                return reject(err);
            }
            return resolve(res.text);
        });
    });
};
