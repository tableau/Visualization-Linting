import {
  buildPixelDiff,
  getDataset,
  generateVegaRendering,
  generateVegaView
} from './utils';
import algebraicRules from './rules/algebraic-rules';
import deceptionRules from './rules/deception-rules';

// todo should make the lint rules generate their own specs
const lintRules = [
  ...algebraicRules,
  ...deceptionRules
  // add default inclusion
].map(d => ({filter: () => true, ...d}));

const evalMap = {
  'algebraic-container': evaluateAlgebraicContainerRule,
  stylistic: evaluateStylisticRule
  // TODO: data
};

export function lint(spec) {
  // TODO should link the size of these to the sizes in the other render path
  const specWithDefaults = {
    width: 200,
    height: 200,
    autosize: {
      type: 'fit',
      contains: 'padding'
    },
    ...spec
  };
  return Promise.all([getDataset(specWithDefaults), generateVegaView(specWithDefaults)])
    .then(([dataset, view]) => {
      return Promise.all(
        lintRules
          .filter(({filter}) => filter(specWithDefaults, dataset, view))
          .map(rule => evalMap[rule.type](rule, specWithDefaults, dataset))
      );
    });
}

function evaluateAlgebraicContainerRule(rule, spec, dataset) {
  const {operation, evaluator, name, explain} = rule;
  const perturbedSpec = {...spec, data: {values: operation(dataset, spec)}};
  return Promise.all(
    [spec, perturbedSpec].map(d => generateVegaRendering(d, 'raster'))
  )
  .then(([oldRendering, newRendering]) => {
    const failRender = buildPixelDiff(oldRendering, newRendering).diffStr;
    const passed = evaluator(oldRendering, newRendering, spec);
    // type is there to allow for svg renders, still to come
    const failedRender = {type: 'raster', render: failRender};
    return {name, explain, passed, failedRender: !passed ? failedRender : null};
  });
}

function evaluateStylisticRule(rule, spec, dataset) {
  const {evaluator, name, explain = 'todo'} = rule;

  return Promise.all([generateVegaView(spec), generateVegaRendering(spec, 'svg')])
  .then(([view, render]) => {
    const passed = evaluator(view, spec, render);
    return {name, explain, passed, failedRender: null};
  });
}
