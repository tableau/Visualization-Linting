const tsv = require('tsv');
const {getFile, writeFile} = require('hoopoe');
const toRow = (colorSuffix, name) => (row, idx, rows) => {
  const rowTitle = row.Error.replace(/LINEBREAK/g, '\\newline').split(
    '(checked)'
  )[0];
  const rowColor = `rowcolor{color${colorSuffix}${idx % 2 ? '-opaque' : ''}}`;
  const mirage = `${rowTitle} & ${row['mirage-error']} ${row.Citations}`;
  return ` \\${rowColor}${mirage}`;
};

const toBlock = (rows, name, colorSuffix) =>
  `${rows.map(toRow(colorSuffix, name)).join('\\\\\n')}\\\\`;
// % \\multirow{13}{1em}{\\hspace{-0.4cm}\\rotatebox{90}{\\normalsize{\\normalsize{Curation}}}}
const template = (curating, wrangling, visualizing, comprehending) => `
\\begin{longtable}{p{3cm}p{14cm}}
\\normalsize{Error} & \\normalsize{Mirage}\\\\ \\hline

  \\hbox{\\textbf{CURATING ERRORS}}& \\\\
  ${toBlock(curating, 'Curating', 'a')}

  \\hbox{\\textbf{WRANGLING ERRORS}}& \\\\
  ${toBlock(wrangling, 'Wrangling', 'b')}

  \\hbox{\\textbf{VISUALIZING ERRORS}}& \\\\
  ${toBlock(visualizing, 'Visualizing', 'c')}

  \\hbox{\\textbf{READING ERRORS}}& \\\\
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
  .then(d =>
    tsv
      .parse(d)
      .filter(x => x.Hide !== 'TRUE')
      .filter(x => (x['mirage-error'] || '').trim().length > 1)
  )
  .then(d => {
    const groups = groupBy(d, 'Taxonomy (cause)');
    writeFile(
      './long-table.tex',
      template(
        groups.Curation,
        groups.Wrangling,
        groups.Visualization,
        groups.Comprehension
      )
    );
  });
