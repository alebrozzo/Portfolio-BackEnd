// const wordListPath = require('word-list');
const path = require('path');

const promisifications = require('../helpers/promisifications');
const arrays = require('../helpers/arrays');

const structure = require('./structure');
const functionality = require('./functionality');

function getCrossword(gridStructure) {

    return new Promise(function (resolve, reject) {

        const startUsage = process.cpuUsage();

        // set the initial crossword.
        let crossword;
        //   if structure received by parameter gridStructure, use it.
        if (gridStructure && (gridStructure.length > 0 && gridStructure[ 0 ].length > 0)) {
            // create an empty crossword object structure, the actual grid does not matter as it will be overwritten by the received grid.
            crossword = structure.createEmptyCrossword(1, 1);
            crossword.grid = JSON.parse(JSON.stringify(gridStructure));
        }
        else { //  else create a new random structure
            crossword = structure.createEmptyCrossword(4, 5); // TODO: make random numbers and complete functionality of fillRandomBlackBoxes.
            crossword.grid = structure.fillRandomBlackBoxes(crossword.grid, 4);
        }

        // set the word numbers based on black boxes location.
        crossword = structure.setWordNumbers(crossword);

        // get the dictionary and fill the crossword object.
        promisifications.readFilePromisified(path.resolve(__dirname, 'wordList.js'))
            .then(wordList => {
                console.log('file first line: ', wordList.split('\r\n')[0]);
                const wordListSplit = arrays.shuffleFlatArray(wordList.split('\r\n'));
                crossword = functionality.fillCrossword(crossword, wordListSplit);
                console.log('execution cpu usage: ', process.cpuUsage(startUsage));
                resolve(crossword);
            })
            .catch(error => {
                console.log('file attempted: ', path.resolve(__dirname, 'wordList.js'));
                console.log('error at execution:', error);
                reject(error);
            });

    }); // end promise

}

module.exports.getCrossword = getCrossword;
