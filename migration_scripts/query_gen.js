const fs = require('fs');

if (process.argv[2] === undefined) {
    console.error('Please provide filename');
    return 1;
}

const data = JSON.parse(fs.readFileSync(process.argv[2]));
const columns = Object.keys(data[0]);

let valuesString = '';

data.forEach(entry => {
    valuesString += '(';
    columns.forEach(column => {
        valuesString += (typeof entry[column] === 'string') ? '"' + entry[column] + '"' : entry[column];
        valuesString += ', ';
    });
    valuesString = valuesString.slice(0, -2) + '), ';
});

const sqlQuery = `INSERT IGNORE INTO ${ process.argv[2].split('.')[1].slice(1) } (${ columns.join(', ') }) VALUES ${ valuesString.slice(0, -2) };`;

console.log(sqlQuery);
