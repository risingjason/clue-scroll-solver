import wtf from 'wtf_wikipedia';

const CLUE_LEVELS = ['Beginner', 'Easy', 'Medium', 'Hard', 'Elite', 'Master'];

async function getAnagramClues() {
  const getAnagramTable = (doc) => {
    const anagramClueRaw = doc.tables()[0].json();

    const anagramClueFormatted = anagramClueRaw.reduce((acc, wikiRow) => {
      // description row
      if (acc.length === 0) {
        const legendRow = Object.keys(wikiRow);
        acc.push(legendRow);
      }

      let newRow = [];
      Object.keys(wikiRow).forEach((item) => {
        newRow.push(wikiRow[item].text);
      });
      acc.push(newRow);

      return acc;
    }, []);

    return anagramClueFormatted;
  };

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
    const table = getAnagramTable(page);

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
