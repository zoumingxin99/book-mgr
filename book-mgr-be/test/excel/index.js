const xlsx = require('node-xlsx');

// Parse a file
const workSheet = xlsx.parse(`${__dirname}/test.xlsx`);

console.log(workSheet[0].data);