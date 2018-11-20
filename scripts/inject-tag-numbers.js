#!/usr/bin/env node --harmony

const program = require('commander');
const fs = require('fs');

function rewriteTags (fileContent) {
  const rows = fileContent.split('\n');
  const newRows = [];
  let tagNumber =  1;

  for (let i = 0; i< rows.length; i++) {
    const row = rows[i];

    const lineContainsTagPortal = row.indexOf('[!!]') !== -1;

    if (lineContainsTagPortal) {
      const rewrittenRow = row.replace('[!!]', `[${tagNumber}]`);
      newRows.push(rewrittenRow);
      tagNumber++;
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

    console.time('Total tid');
    const fileBuffer = fs.readFileSync(file);
    const rawFileContent = fileBuffer.toString();

    if (rawFileContent.indexOf('[!!]') === -1) {
      console.log(`Processerar inte ${file}.`);
      process.exit(0);
    }

    console.log(`Injicerar nummer i [!!] i ${file}...`);

    const fileContent = rewriteTags(fileBuffer.toString());

    fs.writeFileSync(file, fileContent, { encoding: 'utf-8' });

    console.timeEnd('Total tid');
  })
  .parse(process.argv);
