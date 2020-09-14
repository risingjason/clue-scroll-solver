import wtf from 'wtf_wikipedia';
import formatTable from './helpers/formatTable';

wtf.extend((models, templates) => {
  // old school wiki has an {{SCP|Skill|Number|Link}} format
  templates.scp = (text, data) => {
    const [template, skill, level] = text.replace(/\{+|\}/gm, '').split('|');
    data.push({ template, skill, level });
    return `Level ${level} ${skill}`;
  };

  // old school cryptics format is {{Cryptics|clue|note|task|image|level}}
  templates.cryptics = (text, data) => {
    const newLine = new RegExp('\n', 'g');
    const dblSingleQuote = new RegExp(/\'{2}/, 'g');
    const [template, clue, note, task, image, level] = text
      .replace(/\{+|\}+|\[+|\]/g, '')
      .replace(newLine, '')
      .replace(dblSingleQuote, '')
      .replace('Treasure Trails/Guide/Hot Cold', 'Hot Cold Clues')
      .replace(/(clue|note|task|image|level)=/g, '')
      .split('|');
    data.push({
      template,
      clue,
      note,
      task,
      image: `https://oldschool.runescape.wiki/w/Special:FilePath/${image}`,
      level,
    });
    return text;
  };
});

const wtfWikiOptions = {
  domain: 'oldschool.runescape.wiki',
  noOrigin: true,
  'User-Agent': 'testing <jzhang5137@gmail.com>',
};

const CLUE_LEVELS = ['Beginner', 'Easy', 'Medium', 'Hard', 'Elite', 'Master'];

// Charlie the Tramp/Tasks
async function getAnagramClues() {
  const getAnagramTableTitle = (doc) => {
    let result = '';
    doc.sections().forEach((section) => {
      if (section['_title'].includes('Anagram')) {
        result = section['_title'];
      }
    });
    return result;
  };

  let anagramPages = await wtf.fetch(
    CLUE_LEVELS.map((item) => `Treasure Trails/Guide/Anagrams/${item}`),
    wtfWikiOptions
  );

  const allAnagramTables = anagramPages.map((page) => {
    const title = getAnagramTableTitle(page);
    const table = formatTable(page);

    return {
      title,
      table,
    };
  });

  return allAnagramTables;
}

// (async () => {
//   console.log(await getAnagramClues());
// })();

async function getCrypticClues() {
  let crypticPages = await wtf.fetch(
    CLUE_LEVELS.map((item) => `Treasure_Trails/Guide/Cryptic_clues/${item}`),
    wtfWikiOptions
  );

  const getCrypticTableFromTemplate = (doc) => {
    const crypticTemplates = doc.json().sections[1].templates;

    const crypticTables = crypticTemplates.reduce(
      (acc, { clue, note, image }) => {
        if (acc.length === 0) {
          acc.push(['Clue', 'Solution', 'Location']);
        }

        acc.push([clue, note, image]);

        return acc;
      },
      []
    );

    return crypticTables;
  };

  const getCrypticTables = crypticPages.map((page) => {
    const title = page.json().sections[1].title;
    const table = getCrypticTableFromTemplate(page);

    return { title, table };
  });

  return getCrypticTables;
}

(async () => {
  console.log(await getCrypticClues());
})();

// get all solutions from charlie the tramp
// for beginner clues
async function getCharlieTrampClues() {
  let charlieTrampPage = await wtf.fetch(
    'Charlie_the_Tramp/Tasks',
    wtfWikiOptions
  );

  return { title: 'Charlie The Tramp', table: formatTable(charlieTrampPage) };
}

// (async () => {
//   console.log(await getCharlieTrampClues());
// })();
