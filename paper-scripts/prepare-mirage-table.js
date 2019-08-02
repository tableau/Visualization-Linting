const tsv = require('tsv');
const {getFile, writeFile} = require('hoopoe');
const toRow = isGray => row =>
  `& ${isGray ? '\\rowcolor{Gray}' : ''} ${row.Error} & ${row['Taxonomy (Mirage)']} ${row.Citations}`;
const toBlock = (rows, name, isGray) => {
  return `\\multirow{${rows.length}}{1em}{\\rotatebox{90}{\\normalsize{${name}}}} ${rows.map(toRow(isGray)).join('\\\\\n')}\\\\`;
};
const template = (curating, preparing, visualizing, comprehending) => `
% \\multirow{13}{1em}{\\rotatebox{90}{\\normalsize{Curation}}}
\\begin{table*}[]
\\centering
\\caption{Examples of errors arising at each of the stages in our taxonomy along with the ways that those errors can manifest themselves as mirages.}
\\small
\\begin{tabular}{c|p{6cm}p{10cm}}
& \\normalsize{Error} & \\normalsize{Mirage}\\\\ \\hline
  ${toBlock(curating, 'Curating', false)}
  ${toBlock(preparing, 'Preparing', true)}
  ${toBlock(visualizing, 'Visualizing', false)}
  ${toBlock(comprehending, 'Comprehending', true)}
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
  .then(d => tsv.parse(d))
  .then(d => {
    const groups = groupBy(d, 'Taxonomy (cause)');
    writeFile('./table.tex',
      template(groups.Curation, groups.Preparation, groups.Visualization, groups.Comprehension));
  });
