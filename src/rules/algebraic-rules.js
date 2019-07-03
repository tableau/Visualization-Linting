import outliers from 'outliers';
import {
  clone,
  shuffle
} from '../utils';
import {dropRow, randomizeColumns} from '../dirty';

const expectSame = (oldRendering, newRendering) => oldRendering === newRendering;
const expectDifferent = (oldRendering, newRendering) => oldRendering !== newRendering;

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

  // NOT TESTED
  {
    name: 'algebraic-permute-outliers-should-matter',
    type: 'algebraic-container',
    operation: (container, spec) => getXYFieldNames(spec)
      .reduce((acc, column) => acc.filter(outliers(column)), clone(container)),
    evaluator: expectDifferent
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
    filter: (spec, data) => {
      const {transform} = spec;
      return !transform || transform && !transform.find(d => d.fold);
    }
  },
  {
    name: 'algebraic-shuffle-input-data',
    type: 'algebraic-container',
    operation: (container) => shuffle(clone(container)),
    evaluator: expectSame
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
    evaluator: expectDifferent
  }
];

export default rules;
