const {
  generateVegaRendering,
  sanitizeDatasetReference,
  checkIfSpecIsSupported
} = require('../src/utils');
const {writeFile, getFile} = require('hoopoe');

function checkIfSpecIsResteraunt(spec) {
  if (spec.transform) {
    const foundtransform = JSON.stringify(spec.transform, null, 2);
    const knowntransform = JSON.stringify(
      [{filter: 'datum._vgsid_<=25'}],
      null,
      2
    );
    const knowntransform2 = JSON.stringify(
      [
        {
          filter: {
            field: '_vgsid_',
            range: [null, 25]
          }
        }
      ],
      null,
      2
    );
    // console.log(foundtransform, knowntransform);
    if (
      foundtransform === knowntransform ||
      foundtransform === knowntransform2
    ) {
      console.log('DUPPPPPP');
      return true;
    }
  }

  if (JSON.stringify(spec, null, 2).includes('datum._vgsid_')) {
    console.log('UGHHHH');
    return true;
  }
  return false;
}

// const dups = {};
// const ignoreResteraunt = {};
// getFile('../gh-specs/gh-specs-index.json')
//   .then(d => JSON.parse(d)['vegalite-with-dups'])
//   .then(files => {
//     // d.vegalite
//     Promise.all(
//       files.map((file, idx) => {
//         return getFile(`../gh-specs/vegalite-modified/${file}`)
//           .then(d => JSON.parse(d))
//           .then(spec => {
//             const specKey = JSON.stringify({...spec, data: null});
//             if (!dups[specKey]) {
//               dups[specKey] = [];
//             }
//             dups[specKey].push(file);
//             if (checkIfSpecIsResteraunt(spec)) {
//               ignoreResteraunt[file] = true;
//             }
//           });
//       })
//     ).then(() => {
//       const rejected = Object.values(dups)
//         .filter(d => d.length > 1)
//         .reduce((acc, row) => {
//           row.slice(1).forEach(file => {
//             acc[file] = true;
//           });
//           return acc;
//         }, {});
//       const reducedList = files.filter(
//         file => !rejected[file] && !ignoreResteraunt[file]
//       );
//       console.log(JSON.stringify(reducedList, null, 2));
//     });
//   });

getFile('../gh-specs/gh-specs-index.json')
  .then(d => JSON.parse(d).vegalite)
  .then(files => {
    // d.vegalite
    Promise.all(
      files.map((file, idx) => {
        return getFile(`../gh-specs/vegalite-modified/${file}`)
          .then(d => JSON.parse(d))
          .then(spec => {
            // uncomment to get pictures of all of the charts
            const cleanedSpec = sanitizeDatasetReference(spec);
            if (!checkIfSpecIsSupported(cleanedSpec)) {
              console.log('rejected', idx);
              return;
            }
            return generateVegaRendering(cleanedSpec, 'svg').then(data => {
              writeFile(`../gh-specs-output/${file.split('.')[0]}.svg`, data);
            });
          });
      })
    );
  });
