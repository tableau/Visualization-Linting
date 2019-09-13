const CAPTION =
  'An expanded collection of examples of errors resulting in mirages along different stages of our analytics pipeline. Just as we highlight in the table in the main paper, this list is not exhaustive. Instead it presents examples of how decision-making at various stages of analysis can damage the credibility or reliability of the messages in charts.';

const tsv = require('tsv');
const {getFile, writeFile} = require('hoopoe');
const toRow = (colorSuffix, name) => (row, idx, rows) => {
  const rowTitle = row.Error.replace(/LINEBREAK/g, '').split('(checked)')[0];
  const rowColor = `rowcolor{color${colorSuffix}${idx % 2 ? '-opaque' : ''}}`;
  const mirage = `${rowTitle} & ${row['mirage-error']} ${row.Citations}`;
  return ` \\${rowColor}${mirage}`;
};

const toBlock = (rows, name, colorSuffix) =>
  `${rows.map(toRow(colorSuffix, name)).join('\\\\\n')}\\\\`;

const renderSection = ({sectionName, content, colorCode}) => {
  return `
  \\\\\\hbox{\\normalsize{\\textbf{${sectionName.toUpperCase()} ERRORS}}}&\\\\ \\\\
  \\normalsize{Error} & \\normalsize{Mirage}\\\\ \\hline
  ${toBlock(content, sectionName, colorCode)}
  `;
};

const colors = {
  curating: 'a',
  wrangling: 'b',
  visualizing: 'c',
  reading: 'd',
};
// if you want to add more sections add em here
const sectionOrder = [
  'curating',
  'curating,wrangling',
  'wrangling',
  'visualizing,wrangling',
  'visualizing',
  'visualizing,reading',
  'reading',
  'reading,wrangling',
];

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
const template = groups => {
  const sections = sectionOrder
    .map(key => {
      return {
        sectionName: key
          .split(',')
          .map(capitalize)
          .join(' + '),
        content: groups[key],
        // color by whatever thing is first
        colorCode: colors[key.split(',')[0]],
      };
    })
    .filter(d => d.content)
    .map(renderSection)
    .join('\n');
  return `
  \\begin{longtable}{>{\\raggedright\\arraybackslash}p{3cm}p{14cm}}
    \\caption{${CAPTION}}

    ${sections}
  \\end{longtable}
  \\label{table:mirage-table}
  `;
};

const gerandify = {
  curation: 'curating',
  comprehension: 'reading',
  visualization: 'visualizing',
};

function groupBy(data, key, backup) {
  return data.reduce((acc, row) => {
    const preppedKey = (row[key] || row[backup])
      .split(',')
      .map(d => d.trim().toLowerCase())
      .map(d => gerandify[d] || d)
      .filter(d => d.length)
      .sort()
      .join(',');
    if (!acc[preppedKey]) {
      acc[preppedKey] = [];
    }
    acc[preppedKey].push(row);
    return acc;
  }, {});
}
getFile('./paper-scripts/lint-rules.tsv')
  .then(d =>
    tsv
      .parse(d)
      .filter(x => x.Hide !== 'TRUE')
      .filter(x => (x['mirage-error'] || '').trim().length > 1),
  )
  .then(d => {
    writeFile(
      './long-table.tex',
      template(groupBy(d, 'Taxonomy (MC)', 'Taxonomy (cause)')),
    );
  });
