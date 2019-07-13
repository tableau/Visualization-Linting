/* eslint-disable max-len */
import outliers from 'outliers';
import {
  buildPixelDiff,
  clone,
  getXYFieldNames,
  shuffle,
  filterForXandY
} from '../utils';
import {dropRow, randomizeColumns} from '../dirty';

// pure string based
const expectSame = (oldRendering, newRendering) => oldRendering === newRendering;
const expectDifferent = (oldRendering, newRendering) => oldRendering !== newRendering;
// sanity checkers
// const expectSame = () => false;
// const expectDifferent = () => false;
// const expectSame = (oldRend, newRend) => {
//   const {delta} = buildPixelDiff(oldRend, newRend);
//   return delta < 10;
// };
// const expectDifferent = (oldRend, newRend) => {
//   const {delta} = buildPixelDiff(oldRend, newRend);
//   return delta > 10;
// };

const shouldHaveCommonNumberOfRecords = ['x', 'y'].map(name => ({
  name: `algebraic-aggregates-should-have-a-similar-number-of-input-records--${name}-axis`,
  type: 'algebraic-spec',
  evaluator: (oldRendering, newRendering, spec, perturbedSpec, oldView, newView) => {
    const measurements = newView._runtime.data.marks.values.value
      .map(d => d[name]);
    const allMeasuresSame = measurements.every(d => measurements[0] === d);
    // if there aren't enough observations to compute outliers dont
    if (measurements.length < 3) {
      return allMeasuresSame;
    }
    // otherwise use outliers as you wish
    return allMeasuresSame || outliers(measurements).length === 0;
  },
  operation: (spec) => {
    // i feel so dirty, string parsing for deep copy is bad
    const duppedSpec = JSON.parse(JSON.stringify(spec));
    duppedSpec.encoding[name].aggregate = 'count';
    return duppedSpec;
  },
  filter: (spec, data, view) => {
    // ignore the following commented garbage
    // console.log(view._runtime.data.source_0.output.source)
    // argval appears to contain the groupbys that are desired!!
    //    _argval: Parameters {
    //   groupby: [ [Function] ],
    //   ops: [ 'mean' ],
    //   fields: [ [Function] ],
    //   as: [ 'mean_Sales' ]
    // },
    // console.log(Object.entries(view._runtime.data.source_0.output.source.value).map(([key, v]) => ([key, v.agg[0]])))
    // source_0 > output > source
    // 1. identify relevant axes
    // 2. check those axes for aggregates
    const encodingField = spec.encoding && spec.encoding[name];
    const agg = encodingField && encodingField.aggregate;
    return !(!encodingField || !agg || agg === 'count');
  },
  explain: 'Encodings using aggregates to group records should probably have a common number of records in each of the bins.'
}));

const outliersShouldMatter = {
  name: 'algebraic-outliers-should-matter',
  type: 'algebraic-data',
  operation: (container, spec) => getXYFieldNames(spec)
    .reduce((acc, column) => acc.filter(outliers(column)), clone(container)),
  evaluator: expectDifferent,
  filter: filterForXandY,
  explain: 'After deleting the outliers the chart remained unchanged, this suggests that extreme values may not be detected. Make sure that it is behaving as expected'
};

const randomizingColumnsShouldMatter = {
  name: 'algebraic-permute-relevant-columns',
  type: 'algebraic-data',
  operation: (container, spec) => {
    const data = clone(container);
    randomizeColumns(data, ...(getXYFieldNames(spec)));
    return data;
  },
  evaluator: expectDifferent,
  filter: (spec, data, view) => {
    if (!filterForXandY(spec, data, view)) {
      return false;
    }
    const {transform} = spec;
    return !transform || transform && !transform.find(d => d.fold);
  },
  explain: 'After randomizing the relationship between the two data variables the chart remained the same. This suggests that your visualization is not showing their relationship in a discrenable manner.'
};

const shufflingDataShouldMatter = {
  name: 'algebraic-shuffle-input-data',
  type: 'algebraic-data',
  operation: (container) => shuffle(clone(container)),
  evaluator: expectSame,
  explain: ' After shuffling the input data randomly, the resulting image was detected as being different original order. This may suggest that there is overplotting in your data or that there a visual aggregation removing some information from the rendering.'
};

const deletingRowsShouldMatter = {
  name: 'algebraic-randomly-delete-rows',
  type: 'algebraic-data',
  operation: (container) => {
    const clonedData = clone(container);
    for (let i = 0; i < container.length * 0.3; i++) {
      dropRow(clonedData);
    }
    return clonedData;
  },
  evaluator: expectDifferent,

  explain: 'After randomly deleting a third of the rows the image has remained the same. This suggests that there is an aggregator that is doing too much work, be careful.'
};

const rules = [
  ...shouldHaveCommonNumberOfRecords,
  outliersShouldMatter,
  randomizingColumnsShouldMatter,
  shufflingDataShouldMatter,
  deletingRowsShouldMatter
];

export default rules;
