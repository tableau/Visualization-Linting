import tape from 'tape';
import {lint} from '../src';
import {
  BAR_CHART_SPEC,
  HISTOGRAM,
  COLORED_SCATTERPLOT,
  OVERPLOT_SCATTERPLOT_REVERESED,
  MISSING_RECORDS_BAR_CHART,
  MISSING_QUARTER_LINESERIES,
  OUTLIER_SCATTERPLOT,
  OVERPLOT_SCATTERPLOT
} from './vega-examples';

const adjustFileRoot = spec => {
  const url = spec.data.url.slice(3);
  return {...spec, data: {url}};
};
const cleanResultsToPassFail = result =>
  result.map(({name, passed}) => ({name, passed}));

const TEST_SPECS = [
  {
    spec: BAR_CHART_SPEC,
    expected: [
      {name: 'algebraic-outliers-should-matter', passed: true},
      {name: 'algebraic-permute-relevant-columns', passed: true},
      {name: 'algebraic-shuffle-input-data', passed: true},
      {name: 'algebraic-randomly-delete-rows', passed: true},
      {name: 'deception-vis-no-reversed-axes-y', passed: true},
      {name: 'deception-vis-no-zero-scales-y', passed: true},
      {name: 'deception-vis-scale-should-start-at-zero-y', passed: true}
    ],
    groupName: 'BAR CHART'
  },
  {
    spec: HISTOGRAM,
    expected: [
      {name: 'algebraic-outliers-should-matter', passed: true},
      {name: 'algebraic-permute-relevant-columns', passed: false},
      {name: 'algebraic-shuffle-input-data', passed: true},
      {name: 'algebraic-randomly-delete-rows', passed: true},
      {name: 'deception-vis-no-reversed-axes-x', passed: true},
      {name: 'deception-vis-no-reversed-axes-y', passed: true},
      {name: 'deception-vis-no-zero-scales-x', passed: true},
      {name: 'deception-vis-no-zero-scales-y', passed: true},
      {name: 'deception-vis-scale-should-start-at-zero-x', passed: false},
      {name: 'deception-vis-scale-should-start-at-zero-y', passed: true}
    ],
    groupName: 'HISTOGRAM'
  },
  {
    spec: COLORED_SCATTERPLOT,
    expected: [
      {name: 'algebraic-outliers-should-matter', passed: true},
      {name: 'algebraic-permute-relevant-columns', passed: true},
      {name: 'algebraic-shuffle-input-data', passed: false},
      {name: 'algebraic-randomly-delete-rows', passed: true},
      {name: 'deception-vis-no-reversed-axes-x', passed: true},
      {name: 'deception-vis-no-reversed-axes-y', passed: true},
      {name: 'deception-vis-no-zero-scales-x', passed: true},
      {name: 'deception-vis-no-zero-scales-y', passed: true},
      {name: 'deception-vis-scale-should-start-at-zero-x', passed: true},
      {name: 'deception-vis-scale-should-start-at-zero-y', passed: true}
    ],
    groupName: 'COLORED_SCATTERPLOT'
  },
  {
    spec: OVERPLOT_SCATTERPLOT_REVERESED,
    expected: [
      {name: 'algebraic-outliers-should-matter', passed: true},
      {name: 'algebraic-permute-relevant-columns', passed: true},
      {name: 'algebraic-shuffle-input-data', passed: false},
      {name: 'algebraic-randomly-delete-rows', passed: true},
      {name: 'deception-vis-no-reversed-axes-x', passed: false},
      {name: 'deception-vis-no-reversed-axes-y', passed: true},
      {name: 'deception-vis-no-zero-scales-x', passed: true},
      {name: 'deception-vis-no-zero-scales-y', passed: true},
      {name: 'deception-vis-scale-should-start-at-zero-x', passed: false},
      {name: 'deception-vis-scale-should-start-at-zero-y', passed: true}
    ],
    groupName: 'BAD CHART: OVERPLOT_SCATTERPLOT_REVERESED'
  },
  {
    spec: MISSING_RECORDS_BAR_CHART,
    expected: [
      {name: 'algebraic-outliers-should-matter', passed: true},
      {name: 'algebraic-shuffle-input-data', passed: true},
      {name: 'algebraic-randomly-delete-rows', passed: true},
      {name: 'deception-vis-no-reversed-axes-y', passed: true},
      {name: 'deception-vis-no-zero-scales-y', passed: true},
      {name: 'deception-vis-scale-should-start-at-zero-y', passed: true}
    ],
    groupName: 'BAD CHART: MISSING_RECORDS_BAR_CHART'
  },
  {
    spec: MISSING_QUARTER_LINESERIES,
    expected: [
      {name: 'algebraic-outliers-should-matter', passed: false},
      {name: 'algebraic-permute-relevant-columns', passed: true},
      {name: 'algebraic-shuffle-input-data', passed: true},
      {name: 'algebraic-randomly-delete-rows', passed: true},
      {name: 'deception-vis-no-reversed-axes-x', passed: true},
      {name: 'deception-vis-no-reversed-axes-y', passed: false},
      {name: 'deception-vis-no-zero-scales-x', passed: true},
      {name: 'deception-vis-no-zero-scales-y', passed: true},
      {name: 'deception-vis-scale-should-start-at-zero-y', passed: false}
    ],
    groupName: 'BAD CHART: MISSING_QUARTER_LINESERIES',
  },
  {
    spec: OUTLIER_SCATTERPLOT,
    expected: [
      {name: 'algebraic-outliers-should-matter', passed: true},
      {name: 'algebraic-permute-relevant-columns', passed: true},
      {name: 'algebraic-shuffle-input-data', passed: false},
      {name: 'algebraic-randomly-delete-rows', passed: true},
      {name: 'deception-vis-no-reversed-axes-x', passed: true},
      {name: 'deception-vis-no-reversed-axes-y', passed: true},
      {name: 'deception-vis-no-zero-scales-x', passed: true},
      {name: 'deception-vis-no-zero-scales-y', passed: true},
      {name: 'deception-vis-scale-should-start-at-zero-x', passed: true},
      {name: 'deception-vis-scale-should-start-at-zero-y', passed: true}
    ],
    groupName: 'BAD CHART: OUTLIER_SCATTERPLOT'
  },
  {
    spec: OVERPLOT_SCATTERPLOT,
    expected: [
      {name: 'algebraic-outliers-should-matter', passed: true},
      {name: 'algebraic-permute-relevant-columns', passed: true},
      {name: 'algebraic-shuffle-input-data', passed: false},
      {name: 'algebraic-randomly-delete-rows', passed: false},
      {name: 'deception-vis-no-reversed-axes-x', passed: true},
      {name: 'deception-vis-no-reversed-axes-y', passed: true},
      {name: 'deception-vis-no-zero-scales-x', passed: true},
      {name: 'deception-vis-no-zero-scales-y', passed: true},
      {name: 'deception-vis-scale-should-start-at-zero-x', passed: true},
      {name: 'deception-vis-scale-should-start-at-zero-y', passed: true}
    ],
    groupName: 'BAD CHART: OVERPLOT_SCATTERPLOT'
  }
];

function buildTest({spec, expected, groupName, only}) {
  const test = t => {
    lint(adjustFileRoot(spec))
    .then(result => {
      const results = cleanResultsToPassFail(result);
      // full comparison of the test set with result set
      t.deepEqual(cleanResultsToPassFail(result), expected, 'INTEGRATION');
      // individual comparisons (for ledigibility)
      results.forEach((row, idx) => {
        const testName = `${row.name} should evaluate correctly`;
        t.deepEqual(row, expected[idx], testName);
      });
    })
    .then(() => t.end());
  };
  const msg = `${groupName} Linting Tests`;
  if (only) {
    tape.only(msg, test);
  } else {
    tape(msg, test);
  }
}

TEST_SPECS.forEach(buildTest);
