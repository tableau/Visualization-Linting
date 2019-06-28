import {shuffle, getDataset, generateVegaRendering} from './utils';

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
    name: 'shuffleInputData',
    type: 'algebraic-container',
    operation: (container) => {
      return shuffle(container.map(d => ({...d})));
    },
    evaluator: (oldRendering, newRendering) => {
      return oldRendering === newRendering;
    }
  }
];

const evalMap = {
  'algebraic-container': evaluateAlgebraicContainerRule
};

export function lint(spec) {
  return getDataset(spec)
    .then(dataset => {
      return Promise.all(lintRules.map(rule => evalMap[rule.type](rule, spec, dataset)))
      .then(results => {
        return results;
      });
    });
}

function evaluateAlgebraicContainerRule(rule, spec, dataset) {
  const {operation, evaluator} = rule;
  return Promise.all([
    spec,
    {...spec, data: {values: operation(dataset)}}
  ].map(generateVegaRendering))
  .then(([oldRendering, newRendering]) => {
    const passed = evaluator(oldRendering, newRendering);
    // if (!passed) {
    //   writeFile(`${rule.name}-old.png`, oldRendering);
    //   writeFile(`${rule.name}-new.png`, newRendering);
    // }
    return {name: rule.name, passed};
  });
}
