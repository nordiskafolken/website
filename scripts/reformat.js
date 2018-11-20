#!/usr/bin/env node --harmony

const program = require('commander');
const fs = require('fs');

function reformat (fileContent) {
  const rows = fileContent.split('\n');

  const newRows = [
    rows[0],
    '\n\n'
  ];

  let removeFromNextRow = 0;

  for (let i = 2; i< rows.length; i++) {
    const rawRow = rows[i];
    const row = removeFromNextRow > 0 ? rawRow.substr(removeFromNextRow, rawRow.length) : rawRow;
    removeFromNextRow = 0;

    const lineEndsWithHyphen = row.substr(-1) === '-';
    const lineBeginsWithSquareBracket = row.substr(0, 1) === '[';
    const lineBeginsWithOneTab = row.match(/[\t]+/) !== null && row.match(/[\t]+/)[0] === '\t';

    if (lineEndsWithHyphen) {
      const newRowWithHalfWord = row.substr(0, row.length - 1);
      const nextRowsFirstHalfWord = rows[i + 1].split(' ')[0];

      newRows.push(newRowWithHalfWord + nextRowsFirstHalfWord)
      removeFromNextRow = nextRowsFirstHalfWord.length;
    } else if (lineBeginsWithOneTab) {
      newRows.push(row.replace(/\t/, '\n\n'));
    } else if (lineBeginsWithSquareBracket) {
      let lineBreaks = '\n';

      if (row.indexOf('[1]') !== -1) {
        lineBreaks += '\n';
      }

      newRows.push(lineBreaks + row);
    } else if (row !== '') {
      newRows.push(row + ' ');
    }
  }

  return newRows.join('');
}

program
  .arguments('<file>')
  .action(file => {
    if (file.match(/B\d+K\d+.txt/) === null) {
      console.log(`Processerar inte ${file}.`);
      process.exit(0);
    }

    console.log(`Formatterar om ${file}`);
    console.time('Total tid');
    const fileBuffer = fs.readFileSync(file);
    const fileContent = reformat(fileBuffer.toString());

    console.time('Skapade ny txt-fil');
    const fileName = 'B' + file.split('B')[1];
    fs.writeFileSync(`./src/${fileName}`, fileContent, { encoding: 'utf-8' });
    console.timeEnd('Skapade ny txt-fil');
    console.timeEnd('Total tid');
  })
  .parse(process.argv);
