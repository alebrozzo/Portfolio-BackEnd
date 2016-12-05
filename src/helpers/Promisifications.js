// from http://exploringjs.com/es6/ch_promises.html#readFilePromisified
const fs = require('fs');

function readFilePromisified(filename) {
    return new Promise(
        (resolve, reject) => {
            fs.readFile(filename, { encoding: 'utf8' },
                (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
        });
}

// export { readFilePromisified };
module.exports.readFilePromisified = readFilePromisified;
