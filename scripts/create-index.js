#!/usr/bin/env node --harmony
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

const chapterNames = {
  1: [
    'Om Bjarmaland, dess läge och beskaffenhet',
    'Om finnmarken och dess inbyggare',
    'Om sju främmande bröder',
    'Om Skrickfinnarnas(Skridfinnarnas) land',
    'Ytterligare om landets läge och natur',
    'Om vindarnas namn och verkningar',
    'Om nödvändigheten att studera vindarna',
    'Om förutsägelser angående vindarnas beskaffenhet',
    'Om nödvändigheten af vindkännedom',
    'Om den våldsamma vinden Circuis',
    'Om hvirfelstormars och orkaners våldsamhet',
    'Om olika verkningar af åskslag, blixtar, kornblixtar o.d.',
    'Om underbara verkningar af åskslag o.d.',
    'Om ringar som vintertiden te sig på himlen samt om dess verkningar',
    'Om plötsligt framträdande ringar samt om kometers verkningar',
    'Om ringar som om våren te sig på himlavalfvet',
    'Om solens afspeglingar',
    'Om mångårdar och ännu något om solens afspeglingar',
    'Om köldens stränghet',
    'Om ringfrost och snöfall',
    'Om isens växlande former',
    'Om snöns växlande former',
    'Om ungdomens snöfästningar',
    'Om kapplöpning med hästar på isen',
    'Om kapplöpning mellan män på isen',
    'Om härbärgen på isen för resande',
    'Om isfärder mellan råkar',
    'Om isredskap',
    'Om Götars bautastenar och runstenar',
    'Om grafstenar',
    'Om minnesstenar öfver två bröder',
    'Om ur',
    'Om tidmätare medelst skuggor',
    'Om runstafvar',
    'Om åskvädrens betydelse i hvarje särskild månad',
    'Om götarnas alfabet'
  ]
};

fs.readdir('./build', (err, files) => {
  const chapterLinks = {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
    10: [],
    11: [],
    12: [],
    13: [],
    14: [],
    15: [],
    16: [],
    17: [],
    18: [],
    19: [],
    20: [],
    21: [],
    22: []
  };

  files
    .filter(a => a.match(/B\d+K\d+.html/g) !== null)
    .sort((a, b) => {
      const [, aChapterNumber] = a.match(/B(\d+)K(\d+).html/).slice(1, 3).map(Number);
      const [, bChapterNumber] = b.match(/B(\d+)K(\d+).html/).slice(1, 3).map(Number);

      return aChapterNumber - bChapterNumber;
    })
    .forEach(file => {
      const [bookNumber, chapterNumber] = file.match(/B(\d+)K(\d+).html/).slice(1, 3).map(Number);
      const chapterName = chapterNames[bookNumber][chapterNumber];

      chapterLinks[bookNumber].push(`
        <a href="./${file}">${chapterName}</a>
      `);
    });

  const indexHTMLContent = Object.keys(chapterLinks).map(bookNumber => {
    return `
      <h2>Bok ${bookNumber}. ${bookNames[bookNumber]}</h2>

      <ol>
        ${chapterLinks[bookNumber].map(a => `<li>${a}</li>`).join('')}
      </ol>
    `;
  }).join('');

  const finalMarkup = `
  <!DOCTYPE html>
  <html lang="sv">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Historia om de Nordiska Folken</title>
    <meta name="description" content="Historia om de nordiska folken, deras olika förhållanden och villkor, plägseder och idrotter, samhällsskick och lefnadssätt, krig, byggnader och redskap, grufvor och bergverk, underbara ting samt om nästan alla djur, som lefva i Norden, och deras natur. Ett verk med mångahanda kunskap och belyst dels med utländska exempel, dels med afbildningar af inhemska ting, tillika i hög grad ägnadt att roa och underhålla, lämnande säkerligen i läsarens håg en stor förnöjelse.">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="style.css" rel="stylesheet">
  </head>
  <body>
    <header>
      <h1>Historia om de nordiska folken</h1>
      <p>...deras olika förhållanden och villkor, plägseder och idrotter, samhällsskick och lefnadssätt, krig, byggnader och redskap, grufvor och bergverk, underbara ting samt om nästan alla djur, som lefva i Norden, och deras natur. Ett verk med mångahanda kunskap och belyst dels med utländska exempel, dels med afbildningar af inhemska ting, tillika i hög grad ägnadt att roa och underhålla, lämnande säkerligen i läsarens håg en stor förnöjelse.</p>
    </header>
    <main>
      ${indexHTMLContent}
    </main>
  </body>
  </html>
  `;

  fs.writeFileSync('./build/index.html', finalMarkup, 'utf-8');
})