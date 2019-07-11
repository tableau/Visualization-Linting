/* eslint-disable max-len */
import outliers from 'outliers';
import {
  buildPixelDiff,
  clone,
  shuffle,
  uniqueKeysAsBoolMap
} from '../utils';
import {dropRow, randomizeColumns} from '../dirty';

// pure string based
// const expectSame = (oldRendering, newRendering) => oldRendering === newRendering;
// const expectDifferent = (oldRendering, newRendering) => oldRendering !== newRendering;
// sanity checkers
// const expectSame = () => false;
// const expectDifferent = () => false;
const expectSame = (oldRend, newRend) => {
  const {delta} = buildPixelDiff(oldRend, newRend);
  return delta < 10;
};
const expectDifferent = (oldRend, newRend) => {
  const {delta} = buildPixelDiff(oldRend, newRend);
  return delta > 10;
};

const getScaleFileds = (spec, data, view) => Object.keys(uniqueKeysAsBoolMap(view._runtime.scales)).sort();
// if a spec doesn't have x and y, don't try to use that one
const filterForXandY = (spec, data, view) => {
  const [xExpect, yExpect] = getScaleFileds(spec, data, view);
  return xExpect === 'x' && yExpect === 'y';
};

function getXYFieldNames(spec) {
  // not a sustainable version of this encoding grab:
  // what if we encounter univariate specs?
  const {transform, encoding: {x, y}} = spec;
  // later this can be abstracted probably into a getRelevantColumns op i guess
  const foldTransform = transform && transform.find(d => d.fold);
  return foldTransform ? foldTransform.fold : [x.field, y.field];
}

const rules = [
  // {
  //   name: 'rescaleData',
  //   type: 'algebraic-ground',
  //   operation: d => d * 1000,
  //   // todo need to only operate on the right columns
  //   evaluator: (oldRendering, newRendering) => {
  //
  //   }
  // },
  {
    name: 'algebraic-outliers-should-matter',
    type: 'algebraic-container',
    operation: (container, spec) => getXYFieldNames(spec)
      .reduce((acc, column) => acc.filter(outliers(column)), clone(container)),
    evaluator: expectDifferent,
    filter: filterForXandY,
    explain: 'After deleting the outliers the chart remained unchanged, this suggests that extreme values may not be detected. Make sure that it is behaving as expected'
  },
  {
    name: 'algebraic-permute-relevant-columns',
    type: 'algebraic-container',
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
  },
  {
    name: 'algebraic-shuffle-input-data',
    type: 'algebraic-container',
    operation: (container) => shuffle(clone(container)),
    evaluator: expectSame,
    explain: ' After shuffling the input data randomly, the resulting image was detected as being different than when it was in the original order.  This may suggest that there is overplotting in your data or that visual aggregation is removing some information from the rendering.'
  },
  {
    name: 'algebraic-randomly-delete-rows',
    type: 'algebraic-container',
    operation: (container) => {
      const clonedData = clone(container);
      for (let i = 0; i < container.length * 0.3; i++) {
        dropRow(clonedData);
      }
      return clonedData;
    },
    evaluator: expectDifferent,

    explain: 'After randomly deleting a third of the rows the image has remained the same. This suggests that there is an aggregator that is doing too much work, be careful.'
  }
];

export default rules;
