const request = require('superagent');
const Promise = require('bluebird');

module.exports = function(uri) {
    return new Promise((resolve, reject) => {
        request
        .get(uri)
        .set('Cookie', 'cf_clearance=146564a21f467c6fbf742d89242d113ccd192b1f-1468792087-604800')
        .set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36')
        .timeout(15000)
        .end((err, res) => {
            // return null if we have to stop
            // algorithm is kind of try to fetch more, if we hit a snag, just stop, it's not really an error
            // @TODO (sinewyk): finish handling the book step thing for wuxian ? how to handle these ?
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
