const CAPTION = 'FILL IN CAPTION';

const tsv = require('tsv');
const {getFile, writeFile} = require('hoopoe');
const toRow = (colorSuffix, name) => (row, idx, rows) => {
  const rowTitle = row.Error.replace(/LINEBREAK/g, '\\newline').split(
    '(checked)',
  )[0];
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

// % \\multirow{13}{1em}{\\hspace{-0.4cm}\\rotatebox{90}{\\normalsize{\\normalsize{Curation}}}}
const template = groups => {
  console.log(Object.keys(groups));
  const sections = [
    {sectionName: 'Curating', content: groups.curating, colorCode: 'a'},
    {
      sectionName: 'Dirty-Data: Curating + Wrangling',
      content: groups['curating,wrangling'],
      colorCode: 'a',
    },
    {sectionName: 'Wrangling', content: groups.wrangling, colorCode: 'b'},
    {
      sectionName: 'Volatile Visualizations: Wrangling + Visualizing',
      content: groups['visualizing,wrangling'],
      colorCode: 'b',
    },
    {sectionName: 'Visualizing', content: groups.visualizing, colorCode: 'c'},
    {
      sectionName: 'Deceptive Visualization: Visualizing + Reading',
      content: groups['reading,wrangling'],
      colorCode: 'c',
    },
    {sectionName: 'Reading', content: groups.reading, colorCode: 'd'},
    {
      sectionName: 'Uncritical Vis: Reading + Curating',
      content: groups['curating,reading'] || [],
      colorCode: 'd',
    },
  ]
    .map(renderSection)
    .join('\n');
  return `
  \\begin{longtable}{p{3cm}p{14cm}}
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
