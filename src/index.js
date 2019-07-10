import {
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
};

export function lint(spec) {
  return Promise.all([getDataset(spec), generateVegaView(spec)])
    .then(([dataset, view]) => {
      return Promise.all(
        lintRules
          .filter(({filter}) => filter(spec, dataset, view))
          .map(rule => evalMap[rule.type](rule, spec, dataset))
      );
    });
}

function evaluateAlgebraicContainerRule(rule, spec, dataset) {
  const {operation, evaluator, name, explain} = rule;
  const perturbedSpec = {...spec, data: {values: operation(dataset, spec)}};

  return Promise.all(
    [spec, perturbedSpec].map(generateVegaRendering)
      .concat(generateVegaRendering(perturbedSpec, 'svg'))
  )
  .then(([oldRendering, newRendering, failRender]) => {
    const passed = evaluator(oldRendering, newRendering, spec);
    // type is there to allow for svg renders, still to come
    const failedRender = {type: 'svg', render: failRender};
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
