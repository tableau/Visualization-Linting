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
const cleanResultsToPassFail = ({lints}) =>
  lints.map(({name, passed}) => ({name, passed}));

const TEST_SPECS = [
  {
    spec: BAR_CHART_SPEC,
    expected: [
      {name: 'algebraic-outliers-should-matter', passed: true},
      {name: 'algebraic-shuffle-input-data', passed: true},
      {name: 'algebraic-randomly-delete-rows', passed: true},
      {name: 'deception-vis-no-reversed-axes-y', passed: true},
      {name: 'deception-vis-no-zero-scales-y', passed: true},
      {name: 'deception-vis-scale-should-start-at-zero-y', passed: true},
      {name: 'deception-vis-bar-chart-are-usually-aggregates--y-axis', passed: true}
    ],
    groupName: 'BAR CHART'
  },
  {
    spec: HISTOGRAM,
    expected: [
      {name: 'algebraic-outliers-should-matter', passed: true},
      {name: 'algebraic-shuffle-input-data', passed: true},
      {name: 'algebraic-randomly-delete-rows', passed: true},
      {name: 'deception-vis-no-reversed-axes-x', passed: true},
      {name: 'deception-vis-no-reversed-axes-y', passed: true},
      {name: 'deception-vis-no-zero-scales-x', passed: true},
      {name: 'deception-vis-no-zero-scales-y', passed: true},
      {name: 'deception-vis-scale-should-start-at-zero-x', passed: false},
      {name: 'deception-vis-scale-should-start-at-zero-y', passed: true},
      {name: 'deception-vis-bar-chart-are-usually-aggregates--y-axis', passed: true},
      {name: 'deception-vis-bar-chart-are-usually-aggregates--x-axis', passed: false}
    ],
    groupName: 'HISTOGRAM'
  },
  {
    spec: COLORED_SCATTERPLOT,
    expected: [
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
      {name: 'algebraic-shuffle-input-data', passed: true},
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
      {name: 'algebraic-destroy-variance--y-axis', passed: true},
      {name: 'algebraic-outliers-should-matter', passed: true},
      {name: 'algebraic-shuffle-input-data', passed: true},
      {name: 'algebraic-randomly-delete-rows', passed: true},
      {name: 'deception-vis-no-reversed-axes-y', passed: true},
      {name: 'deception-vis-no-zero-scales-y', passed: true},
      {name: 'deception-vis-scale-should-start-at-zero-y', passed: true},
      {name: 'algebraic-aggregates-should-have-a-similar-number-of-input-records--y-axis', passed: false},
      {name: 'deception-vis-bar-chart-are-usually-aggregates--y-axis', passed: true},
      {name: 'algebraic-contract-to-single-record--y-axis', passed: true}
    ],
    groupName: 'BAD CHART: MISSING_RECORDS_BAR_CHART'
  },
  {
    spec: MISSING_QUARTER_LINESERIES,
    expected: [
      {name: 'algebraic-destroy-variance--y-axis', passed: true},
      // MISSING QUARTER SHOULD NOT RUN have algebraic-outliers-should-matter bc it doesn't have outliers
      {name: 'algebraic-permute-relevant-columns', passed: true},
      {name: 'algebraic-shuffle-input-data', passed: true},
      {name: 'algebraic-randomly-delete-rows', passed: true},
      {name: 'deception-vis-no-reversed-axes-x', passed: true},
      {name: 'deception-vis-no-reversed-axes-y', passed: false},
      {name: 'deception-vis-no-zero-scales-x', passed: true},
      {name: 'deception-vis-no-zero-scales-y', passed: true},
      {name: 'deception-vis-scale-should-start-at-zero-y', passed: false},
      {name: 'algebraic-aggregates-should-have-a-similar-number-of-input-records--y-axis', passed: false},
      {name: 'algebraic-contract-to-single-record--y-axis', passed: true}
    ],
    groupName: 'BAD CHART: MISSING_QUARTER_LINESERIES'
  },
  {
    spec: OUTLIER_SCATTERPLOT,
    expected: [
      {name: 'algebraic-outliers-should-matter', passed: true},
      {name: 'algebraic-permute-relevant-columns', passed: true},
      {name: 'algebraic-shuffle-input-data', passed: true},
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
      {name: 'algebraic-shuffle-input-data', passed: true},
      {name: 'algebraic-randomly-delete-rows', passed: true},
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

function toMap(arr) {
  return arr.reduce((acc, row) => {
    acc[row.name] = row;
    return acc;
  }, {});
}

function buildTest({spec, expected, groupName, only}) {
  const test = t => {
    lint(adjustFileRoot(spec))
    .then(result => {
      // flip to map, order of lints doesn't matter and shouldn't be tested
      const expectedMap = toMap(expected);
      const results = cleanResultsToPassFail(result);
      const resultsNames = toMap(results);

      t.deepEqual(
        Object.keys(resultsNames).sort(),
        Object.keys(expectedMap).sort(), 'should find the the same lint considerations');
      results.forEach((row, idx) => {
        const testName = `${row.name} should evaluate correctly`;
        t.deepEqual(row, expectedMap[row.name], testName);
      });
    })
    .then(() => t.end());
  };
  const msg = `${groupName} Linting Tests`;
  // allow testing to be zeroed in on a single test
  if (only) {
    tape.only(msg, test);
  } else {
    tape(msg, test);
  }
}

TEST_SPECS.forEach(buildTest);
