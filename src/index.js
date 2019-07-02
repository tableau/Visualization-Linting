import {shuffle, getDataset, generateVegaRendering, clone} from './utils';
import {dropRow, randomizeColumns} from './dirty';

const expectSame = (oldRendering, newRendering) => oldRendering === newRendering;
const expectDifferent = (oldRendering, newRendering) => oldRendering !== newRendering;
// todo should make the lint rules generate their own specs
const lintRules = [
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
    name: 'permuteRelevantColumns',
    type: 'algebraic-container',
    operation: (container, spec) => {
      // not a sustainable version of this encoding grab:
      // what if we encounter univariate specs?
      const {transform, encoding: {x, y}} = spec;
      // later this can be abstracted probably into a getRelevantColumns op i guess
      const foldTransform = transform && transform.find(d => d.fold);
      const columns = foldTransform ? foldTransform.fold : [x.field, y.field];
      const data = clone(container);
      randomizeColumns(data, ...columns);
      // console.log(...[data, container].map(xx => xx.map(d => columns.map(key => d[key]))))
      return data;
    },
    evaluator: expectDifferent,
    filter: (spec, data) => {
      const {transform} = spec;
      return !transform || transform && !transform.find(d => d.fold);
    }
  },
  {
    name: 'shuffleInputData',
    type: 'algebraic-container',
    operation: (container) => shuffle(clone(container)),
    evaluator: expectSame,
    filter: () => true
  },
  {
    name: 'randomlyDeletedRows',
    type: 'algebraic-container',
    operation: (container) => {
      const clonedData = clone(container);
      for (let i = 0; i < container.length * 0.3; i++) {
        dropRow(clonedData);
      }
      return clonedData;
    },
    evaluator: expectDifferent,
    filter: () => true
  }
];

const evalMap = {
  'algebraic-container': evaluateAlgebraicContainerRule
};

export function lint(spec) {
  return getDataset(spec)
    .then(dataset => {
      return Promise.all(
        lintRules
          .filter(({filter}) => filter(spec, dataset))
          .map(rule => evalMap[rule.type](rule, spec, dataset))
      );
    });
}

function evaluateAlgebraicContainerRule(rule, spec, dataset) {
  const {operation, evaluator, name} = rule;
  const perturbedSpec = {...spec, data: {values: operation(dataset, spec)}};

  return Promise.all(
    [spec, perturbedSpec].map(generateVegaRendering)
      .concat(generateVegaRendering(perturbedSpec, 'svg'))
  )
  .then(([oldRendering, newRendering, failRender]) => {
    const passed = evaluator(oldRendering, newRendering, spec);
    // type is there to allow for svg renders, still to come
    const failedRender = {type: 'svg', render: failRender};
    return {name, passed, failedRender: !passed ? failedRender : null};
  });
}
