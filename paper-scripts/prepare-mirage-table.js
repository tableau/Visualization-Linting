const tsv = require('tsv');
const {getFile, writeFile} = require('hoopoe');
const toRow = (colorSuffix, name) => (row, idx, rows) => {
  const rotater = `\\multirow{${rows.length}}{0em}{\\hspace{-0.6cm}\\rotatebox{90}{\\normalsize{${name}}}}`;
  const rowTitle = row.Error.split('(checked)')[0];
  const rowContent = row['mirage-error'];
  const mirage = `${rowTitle} & ${rowContent} ${row.Citations}`;
  return ` \\rowcolor{color${colorSuffix}${idx % 2 ? '-opaque' : ''}}${
    idx ? '' : rotater
  }${mirage}`;
};
const CAPTION =
  'Examples of errors arising at each of the stages in our model along with the ways that those errors can manifest themselves as mirages. We do not try to be comprehensive in this list, only evocative, as a complete list would span a number of disciplines.';
const toBlock = (rows, name, colorSuffix) =>
  `${rows.map(toRow(colorSuffix, name)).join('\\\\\n')}\\\\`;
// % \\multirow{13}{1em}{\\hspace{-0.4cm}\\rotatebox{90}{\\normalsize{\\normalsize{Curation}}}}
const template = (curating, wrangling, visualizing, comprehending) => `
\\begin{table*}[ht!]
\\centering
\\caption{${CAPTION}}
\\small
\\begin{tabular}{p{2.5cm}p{14.5cm}}
\\normalsize{Error} & \\normalsize{Mirage}\\\\ \\hline
  ${toBlock(curating, 'Curating', 'a')}

  ${toBlock(wrangling, 'Wrangling', 'b')}

  ${toBlock(visualizing, 'Visualizing', 'c')}

  ${toBlock(comprehending, 'Reading', 'd')}
\\end{tabular}
\\label{table:mirage-table}
\\end{table*}
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
  // .then(d => tsv.parse(d).filter(x => !x.Hide))
  .then(d => tsv.parse(d).filter(x => x['MC Top 4'] === 'TRUE'))
  .then(d => {
    const groups = groupBy(d, 'Taxonomy (cause)');
    writeFile(
      './table.tex',
      template(
        groups.Curation,
        groups.Wrangling,
        groups.Visualization,
        groups.Comprehension
      )
    );
  });
