import {shuffle, getDataset, generateVegaRendering, clone} from './utils';
import {dropRow, randomizeColumns} from './dirty';

const expectSame = (oldRendering, newRendering) => oldRendering === newRendering;
const expectDifferent = (oldRendering, newRendering) => oldRendering !== newRendering;
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
      const foldTransform = transform.find(d => d.fold);
      const columns = foldTransform ? foldTransform.fold : [x.field, y.field];

      const data = clone(container);
      randomizeColumns(data, columns);
      console.log(data, columns)
      return data;
    },
    evaluator: expectDifferent
  },
  {
    name: 'shuffleInputData',
    type: 'algebraic-container',
    operation: (container) => shuffle(clone(container)),
    evaluator: expectSame
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
    evaluator: expectDifferent
  }
];

const evalMap = {
  'algebraic-container': evaluateAlgebraicContainerRule
};

export function lint(spec) {
  // const report = getTypeAndImportantColumns(spec);
  // // unclear if its right to fail silently
  // if (!report) {
  //   return [];
  // }
  return getDataset(spec)
    .then(dataset => {
      return Promise.all(
        // TODO: synth rules appropriate to this spec
        lintRules.map(rule => evalMap[rule.type](rule, spec, dataset))
      ).then(results => {
        // TODO top level report?
        return results;
      });
    });
}

function evaluateAlgebraicContainerRule(rule, spec, dataset) {
  const {operation, evaluator, name} = rule;
  const perturbedSpec = {...spec, data: {values: operation(dataset, spec)}};

  return Promise.all([spec, perturbedSpec].map(generateVegaRendering))
  .then(([oldRendering, newRendering]) => {
    const passed = evaluator(oldRendering, newRendering, spec);
    // if (!passed) {
    //   writeFile(`${rule.name}-old.png`, oldRendering);
    //   writeFile(`${rule.name}-new.png`, newRendering);
    // }
    return {name, passed};
  });
}
