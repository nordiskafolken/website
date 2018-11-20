#!/usr/bin/env node --harmony

const program = require('commander');
const fs = require('fs');

function rewriteTags (fileContent) {
  const rows = fileContent.split('\n');
  const newRows = [];
  let hyphen =  1;

  for (let i = 0; i< rows.length; i++) {
    const row = rows[i];

    const lineBeginsWithHypen = row.substr(0, 2) === '- ';

    if (lineBeginsWithHypen) {
      newRows.push(`[${hyphen}] ${row.split('- ')[1]}`);
      hyphen++;
    } else {
      newRows.push(row);
    }
  }

  return newRows.join('\n');
}

program
  .arguments('<file>')
  .action(file => {
    if (file.match(/B\d+K\d+.txt/) === null) {
      console.log(`Processerar inte ${file}.`);
      process.exit(0);
    }

    console.log(`Formatterar om sidnoter i ${file}`);
    console.time('Total tid');
    const fileBuffer = fs.readFileSync(file);
    const fileContent = rewriteTags(fileBuffer.toString());

    fs.writeFileSync(file, fileContent, { encoding: 'utf-8' });

    console.timeEnd('Total tid');
  })
  .parse(process.argv);
