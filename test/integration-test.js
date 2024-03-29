/* eslint-disable no-console */
import tape from 'tape';
import {lint} from '../src';
import {executePromisesInSeries, getFile, writeFile} from 'hoopoe';
import {CRASH, SPEC_NOT_SUPPORTED, OK} from '../src/codes';
import {shamefulDeepCopy} from '../src/utils';

export function sanitizeDatasetReference(spec) {
  if (
    !spec ||
    !spec.data ||
    !spec.data.url ||
    typeof spec.data.url !== 'string'
  ) {
    return spec;
  }
  if (spec.data.url.startsWith('data/')) {
    const copy = shamefulDeepCopy(spec);
    copy.data.url = `./example-specs/${copy.data.url}`;
    return copy;
  }
  return spec;
}

function integrationTest(directory, dirPresent) {
  const startTime = new Date().getTime();
  let failedSpecs = 0;
  let specCounter = 0;
  const codeCounts = {};
  const resultGroups = {};
  const evalSpec = fileNames => spec => {
    specCounter += 1;
    const fileName = fileNames[specCounter - 1];
    console.log(`Linting ${specCounter} ${fileName}`);
    return lint(sanitizeDatasetReference(spec))
      .then(d => {
        console.log(
          `LINT RESULTS IN A ${d.code}${d.msg ? `: ${d.msg}` : ''}\n`
        );
        // codeCounts[d.code] = (codeCounts[d.code] || 0) + 1;
        codeCounts[d.code] = (codeCounts[d.code] || []).concat(fileName);
        d.lints.forEach(({name, passed}) => {
          if (passed) {
            return;
          }
          resultGroups[name] = (resultGroups[name] || []).concat(fileName);
        });
      })
      .catch(e => {
        console.log(`OH NO A ${fileName} FAILED`);
        failedSpecs += 1;
      });
  };
  let totalSpecs = 0;
  return getFile(directory)
    .then(d => JSON.parse(d))
    .then(vlExamples => {
      const subslice = vlExamples.vegalite;
      totalSpecs = subslice.length;
      return executePromisesInSeries(
        subslice.map(fileName => {
          return () =>
            getFile(dirPresent(fileName))
              .then(d => JSON.parse(d))
              .then(evalSpec(subslice))
              .catch(e => console.log(e));
        })
      );
    })
    .then(() => {
      const endTime = new Date().getTime();
      console.log(`${Math.round((endTime - startTime) / 1000)} total seconds`);
      console.log(
        `${totalSpecs - failedSpecs} / ${totalSpecs} completely executed specs`
      );
      const summary = Object.entries(codeCounts).map(([code, files]) => ({
        code,
        count: files.length
      }));
      console.table(summary);
      console.log(`Crashed specs: ${codeCounts[CRASH]}`);
      console.log(JSON.stringify(resultGroups, null, 2));
      return {summary, resultGroups};
    });
}

const SUITES = {
  GH_EXAMPLES: {
    index: './gh-specs/gh-specs-index.json',
    fileNameAppend: fileName => `./gh-specs/vegalite-modified/${fileName}`,
    recordedKey: 'gh-specs'
  },
  VEGALITE_EXAMPLES: {
    index: './example-specs/examples-index.json',
    fileNameAppend: fileName => `./example-specs/vegalite/${fileName}`,
    recordedKey: 'example-specs'
  },
  BY_HAND_EXAMPLES: {
    index: './by-hand-examples/index.json',
    fileNameAppend: fileName => `./by-hand-examples/vegalite/${fileName}`,
    recordedKey: 'by-hand'
  }
};
const WRITE_TO_FILE = true;
tape('INTEGRATION TEST', t => {
  const target = SUITES.GH_EXAMPLES;
  integrationTest(target.index, target.fileNameAppend).then(
    ({summary, resultGroups}) => {
      getFile('./test/integration-task-log.json')
        .then(d => JSON.parse(d))
        .then(d => {
          d[target.recordedKey] = resultGroups;
          if (WRITE_TO_FILE) {
            writeFile(
              './test/integration-task-log.json',
              JSON.stringify(d, null, 2)
            );
          }
        });
      const expectedSummary = [
        {code: SPEC_NOT_SUPPORTED, count: 154},
        {code: OK, count: 248}
      ];
      t.deepEqual(
        summary,
        expectedSummary,
        'should find the expected integration test run'
      );
      t.end();
    }
  );
});
// integrationTest('./gh-specs/gh-specs-index.json', fileName => `./gh-specs/vegalite/${fileName}`);

/* eslint-enable no-console */
