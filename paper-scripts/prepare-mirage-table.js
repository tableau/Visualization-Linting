const tsv = require('tsv');
const {getFile, writeFile} = require('hoopoe');
// const toRow = isGray => row =>
//   `& ${isGray ? '\\rowcolor{Gray}' : ''} ${row.Error} & ${row['Taxonomy (Mirage)']} ${row.Citations}`;
const toRow = colorSuffix => (row, idx) =>
  `& \\rowcolor{color${colorSuffix}${idx % 2 ? '-opaque' : ''}} ${row.Error} & ${row['mirage-error']} ${row.Citations}`;
const toBlock = (rows, name, colorSuffix) => {
  return `\\multirow{${rows.length}}{1em}{\\rotatebox{90}{\\normalsize{${name}}}} ${rows.map(toRow(colorSuffix)).join('\\\\\n')}\\\\`;
};
const template = (curating, wrangling, visualizing, comprehending) => `
% \\multirow{13}{1em}{\\rotatebox{90}{\\normalsize{Curation}}}
\\begin{table*}[]
\\centering
\\caption{Examples of errors arising at each of the stages in our taxonomy along with the ways that those errors can manifest themselves as mirages. This list does not try to be comprehensive, only evocative.}
\\small
\\begin{tabular}{c|p{6cm}p{10cm}}
& \\normalsize{Error} & \\normalsize{Mirage}\\\\ \\hline
  ${toBlock(curating, 'Curating', 'a')}
  ${toBlock(wrangling, 'Wrangling', 'b')}
  ${toBlock(visualizing, 'Visualizing', 'c')}
  ${toBlock(comprehending, 'Reading', 'd')}
\\end{tabular}
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
  .then(d => tsv.parse(d).filter(x => !x.Hide))
  .then(d => {
    const groups = groupBy(d, 'Taxonomy (cause)');
    writeFile('./table.tex',
      template(groups.Curation, groups.Wrangling, groups.Visualization, groups.Comprehension));
  });
