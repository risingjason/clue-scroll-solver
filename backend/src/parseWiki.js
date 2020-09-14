import wtf from 'wtf_wikipedia';
import formatTable from './helpers/formatTable';

wtf.extend((models, templates) => {
  // old school wiki has an {{SCP|Skill|Number|Link}} format
  templates.scp = function (text, data) {
    const [template, skill, level] = text.replace(/\{+|\}/gm, '').split('|');
    data.push({ template, skill, level });
    return `Level ${level} ${skill}`;
  };
});

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
    {
      domain: 'oldschool.runescape.wiki',
      noOrigin: true,
    }
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

(async () => {
  console.log(await getAnagramClues());
})();

// get all solutions from charlie the tramp
// for beginner clues
async function getCharlieTrampClues() {
  let charlieTrampPage = await wtf.fetch('Charlie_the_Tramp/Tasks', {
    domain: 'oldschool.runescape.wiki',
    noOrigin: true,
  });

  return { title: 'Charlie The Tramp', table: formatTable(charlieTrampPage) };
}

(async () => {
  console.log(await getCharlieTrampClues());
})();
