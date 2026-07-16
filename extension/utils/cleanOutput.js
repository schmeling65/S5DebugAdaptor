const fs = require('fs');

const folderName = 'out'; 

fs.rm(folderName, { recursive: true, force: false }, (err) => {
  if (err.code !== 'ENOENT') {
    return console.error(`Error on deleting: ${err.message}`);
  }
  console.log('No output directory exisiting anymore.');
});