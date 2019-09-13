const tsv = require('tsv');
const {getFile, writeFile} = require('hoopoe');
const toRow = (colorSuffix, name) => (row, idx, rows) => {
  const rotater = `\\multirow{${rows.length}}{0em}{\\hspace{-0.6cm}\\rotatebox{90}{\\normalsize{${name}}}}`;
  const rowTitle = row.Error.replace(/LINEBREAK/g, '').split('(checked)')[0];
  const rowContent = row['mirage-error'];
  const mirage = `${rowTitle} & ${rowContent} ${row.Citations}`;
  return ` \\rowcolor{color${colorSuffix}${idx % 2 ? '-opaque' : ''}}${
    idx ? '' : rotater
  }${mirage}`;
};
const CAPTION =
  'Examples of errors resulting in mirages along different stages of our analytics pipeline. This list is not exhaustive, but presents examples of how decision-making at various stages of analysis can damage the credibility or reliability of the messages in charts. A longer version of this table with additional mirages is included in our supplemental materials.';
const toBlock = (rows, name, colorSuffix) =>
  `${rows.map(toRow(colorSuffix, name)).join('\\\\\n')}\\\\`;
// % \\multirow{13}{1em}{\\hspace{-0.4cm}\\rotatebox{90}{\\normalsize{\\normalsize{Curation}}}}
const template = (curating, wrangling, visualizing, comprehending) => `
\\begin{table*}[ht!]
\\centering
\\caption{${CAPTION}}
\\ssmall
\\begin{tabular}{>{\\raggedright\\arraybackslash}p{1.8cm}p{14.7cm}}
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
        groups.Comprehension,
      ),
    );
  });
