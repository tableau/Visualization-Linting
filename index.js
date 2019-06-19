import {parse, View} from 'vega';
import {compile} from 'vega-lite';
import {shuffle} from './src/utils';
// import {writeFile} from './test/test-utils';

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
  return Promise.all(lintRules.map(rule => evalMap[rule.type](rule, spec)))
    .then(results => {
      return results;
    });
}

function evaluateAlgebraicContainerRule(rule, spec) {
  const {values} = spec.data;
  const {operation, evaluator} = rule;
  return Promise.all([
    spec,
    {...spec, data: {values: operation(values)}}
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

/**
 * generateVegaRendering, takes in a vega lint spec and returns an svg rendering of it
 */
function generateVegaRendering(spec) {
  return new Promise((resolve, reject) => {
    const runtime = parse(compile(spec).spec, {renderer: 'none'});
    const view = new View(runtime, {renderer: 'none'}).initialize();
    view
      .runAsync()
      .then(() => {
        view.toCanvas(2)
        .then(x => resolve(x.toDataURL()))
        /* eslint-disable no-console */
        .catch(e => console.log(e));
        /* eslint-enable no-console */
      });
  });
}
