const formatTable = (doc) => {
  const rawTable = doc.tables()[0].json();

  const formattedTable = rawTable.reduce((acc, wikiRow) => {
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

  return formattedTable;
};

export default formatTable;
