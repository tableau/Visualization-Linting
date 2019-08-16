const tsv = require('tsv');
const {getFile, writeFile} = require('hoopoe');
// const toRow = isGray => row =>
//   `& ${isGray ? '\\rowcolor{Gray}' : ''} ${row.Error} & ${row['Taxonomy (Mirage)']} ${row.Citations}`;
const toRow = (colorSuffix, name) => (row, idx, rows) => {
  const mirage = `${row.Error} & ${row['mirage-error']} ${row.Citations}`;
  return ` \\rowcolor{color${colorSuffix}${idx % 2 ? '-opaque' : ''}}${mirage}`;
};

const toBlock = (rows, name, colorSuffix) => `${rows.map(toRow(colorSuffix, name)).join('\\\\\n')}\\\\`;
// % \\multirow{13}{1em}{\\hspace{-0.4cm}\\rotatebox{90}{\\normalsize{\\normalsize{Curation}}}}
const template = (curating, wrangling, visualizing, comprehending) => `
\\begin{longtable}{p{5cm}p{12cm}}
\\normalsize{Error} & \\normalsize{Mirage}\\\\ \\hline
  ${toBlock(curating, 'Curating', 'a')}

  ${toBlock(wrangling, 'Wrangling', 'b')}

  ${toBlock(visualizing, 'Visualizing', 'c')}

  ${toBlock(comprehending, 'Reading', 'd')}
\\end{longtable}
\\label{table:mirage-table}
`;

function groupBy(data, key) {
  return data.reduce((acc, row) => {
    if (!acc[row[key]]) {
      acc[row[key]] = [];
    }
    acc[row[key]].push(row);
    return acc;
  }, {});
}
getFile('./paper-scripts/lint-rules.tsv')
  .then(d => tsv.parse(d).filter(x => x.Hide !== 'TRUE'))
  .then(d => {
    const groups = groupBy(d, 'Taxonomy (cause)');
    writeFile('./long-table.tex',
      template(groups.Curation, groups.Wrangling, groups.Visualization, groups.Comprehension));
  });
