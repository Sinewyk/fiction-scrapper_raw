import * as request from 'superagent';
import * as Promise from 'bluebird';

export default function(uri: string) {
    return new Promise<string | null>((resolve, reject) => {
        request.get(uri).timeout(15000).end((err, res) => {
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
