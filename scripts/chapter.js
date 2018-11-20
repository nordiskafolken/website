#!/usr/bin/env node --harmony

const program = require('commander');
const fs = require('fs');

const bookNames = [
  'Om lefnadsförhållandena, naturbeskaffenheten och krigsbruken hos de nordiska folken',
  'Om Nordens underbara naturföreteelser',
  'Om vidskepelse och afgudadyrkan hos de nordiska folken',
  'Om krig och sedvänjor hos de hedniska skogsborna och deras grannar',
  'Om jättar',
  'Om grufvor och bergverk',
  'Om krigsredskap, krigsbruk, anledningar till och försiktighetsmått i krig',
  'Om konungamakten, ämbetsmännen och krigsväsendet',
  'Om krig till lands',
  'Om sjökrig',
  'Om strider på isen',
  'Om byggnaderna i Norden',
  'Om åkerbruk och lefnadsförhållanden',
  'Om allahanda seder och bruk bland de nordiska folken',
  'Om allehanda öfningar och idrotter',
  'Om kyrkliga ordningar',
  'Om husdjuren',
  'Om de vilda djuren',
  'Om fåglarna',
  'Om fiskarna',
  'Om de vidunderliga fiskarna',
  'Om insekterna'
];

function readOutTitleAndContent (string) {
  const content = [];
  let chapterName;

  const rows = string.split('\n');
  const tags = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    if (row.split('')[0] === '[') {
      tags.push(row.split(']')[1].trim());
    }
  }

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    if (i === 0) {
      chapterName = row;
      content.push(`<h1>${row}</h1>`);
    } else if (
      row !== "" &&
      row.substr(0, 1) !== '['
    ) {
      let modifiableRow = row;

      const matches = row.match(/\[(\d+)\]/g);

      if (matches !== null) {
        for (let j = 0; j < matches.length; j++) {
          const match = matches[j];
          const tagNumber = parseInt(match.match(/\[(\d+)\]/)[1], 10);
          const regex = new RegExp(`\\[${tagNumber}\\]`);

          modifiableRow = modifiableRow.replace(regex, `<ins aria-hidden="true">${tags[tagNumber - 1]}</ins>`);
        }
      }

      content.push(`<p>${modifiableRow}</p>`);
    }
  }

  return { chapterName, content: content.join('\n') };
}

const templateFileBuffer = fs.readFileSync('./template/chapter.html');
const htmlTemplate = templateFileBuffer.toString();

program
  .arguments('<file>')
  .action(file => {
    if (file.match(/B\d+K\d+.txt/) === null) {
      console.log(`Processerar inte ${file}.`);
      process.exit(0);
    }

    console.log(`Processerar ${file}`);
    console.time('Total tid');
    console.time('Läser in text fil');
    const fileBuffer = fs.readFileSync(file);
    console.timeEnd('Läser in text fil');

    console.time('Läser ut information från textfil');
    const { chapterName, content } = readOutTitleAndContent(fileBuffer.toString());
    console.timeEnd('Läser ut information från textfil');

    const [bookNumber, chapterNumber] = file.split('B')[1].split('.txt')[0].split('K');

    const bookName = bookNames[bookNumber - 1]

    console.time('Injicerar data i HTML-mallen');
    const fileContent = String(htmlTemplate)
      .replace(/\$\{bookNumber\}/gi, bookNumber)
      .replace(/\$\{bookName\}/gi, bookName)
      .replace(/\$\{chapterNumber\}/gi, chapterNumber)
      .replace(/\$\{chapterName\}/gi, chapterName)
      .replace(/\$\{content\}/gi, content);
    console.timeEnd('Injicerar data i HTML-mallen');

    console.time('Skriver HTML-fil');
    fs.writeFileSync(`./build/${file.split('/src/')[1].replace('txt', 'html')}`, fileContent, { encoding: 'utf-8' });
    console.timeEnd('Skriver HTML-fil');
    console.timeEnd('Total tid');
  })
  .parse(process.argv);