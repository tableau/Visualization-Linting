import {
  buildPixelDiff,
  getDataset,
  generateVegaRendering,
  generateVegaView,
  checkIfSpecIsSupported,
  concatImages
} from './utils';
import algebraicRules from './rules/algebraic-rules';
import deceptionRules from './rules/deception-rules';
import {SPEC_NOT_SUPPORTED, CRASH, OK} from './codes';

// todo should make the lint rules generate their own specs
const lintRules = [
  ...algebraicRules,
  ...deceptionRules
  // the map adds default inclusion
].map(d => ({filter: () => true, ...d}));

const evalMap = {
  'algebraic-spec': evaluateAlgebraicSpecRule,
  'algebraic-data': evaluateAlgebraicDataRule,
  stylistic: evaluateStylisticRule
};

export function lint(spec) {
  if (!checkIfSpecIsSupported(spec)) {
    return Promise.resolve({code: SPEC_NOT_SUPPORTED, lints: []});
  }
  return Promise.all([getDataset(spec), generateVegaView(spec)])
    .then(([dataset, view]) => {
      return Promise.all(
        lintRules
          .filter(({filter}) => filter(spec, dataset, view))
          .map(rule => evalMap[rule.type](rule, spec, dataset, view))
      );
    })
    .then(lints => ({code: OK, lints}))
    .catch(e => {
      /* eslint-disable no-console */
      console.log(e);
      /* eslint-enable no-console */
      return {
        code: CRASH,
        lints: [],
        msg: e
      };
    });
}

const ruleOutput = ({name, explain}) => ({name, explain, failRender: null});

// TODO: refactor this function and the next one to be instances of a HOF
function evaluateAlgebraicSpecRule(rule, spec, dataset, oldView) {
  const evaluator = rule.selectEvaluator(spec);
  const perturbedSpec = rule.operation(spec);
  return Promise.all([
    generateVegaRendering(spec, 'raster'),
    generateVegaRendering(perturbedSpec, 'raster'),
    generateVegaView(perturbedSpec)
  ]).then(([oldRendering, newRendering, newView]) => {
    const passed = evaluator(
      oldRendering,
      newRendering,
      spec,
      perturbedSpec,
      oldView,
      newView
    );
    return {...ruleOutput(rule), passed};
  });
}

function prepOutput(oldRendering, newRendering) {
  const failRender = buildPixelDiff(oldRendering, newRendering).diffStr;
  // type is there to allow for svg renders, still to come
  return {
    type: 'raster',
    render: concatImages([oldRendering, newRendering, failRender])
  };
}

function evaluateAlgebraicDataRule(rule, spec, dataset, oldView) {
  const evaluator = rule.selectEvaluator(spec);
  const perturbedSpec = {
    ...spec,
    data: {values: rule.operation(dataset, spec, oldView)}
  };
  return Promise.all([
    generateVegaRendering(spec, 'raster'),
    generateVegaRendering(perturbedSpec, 'raster'),
    generateVegaView(perturbedSpec)
  ]).then(([oldRendering, newRendering, newView]) => {
    const passed = evaluator(
      oldRendering,
      newRendering,
      spec,
      perturbedSpec,
      oldView,
      newView
    );

    return {
      ...ruleOutput(rule),
      passed,
      failedRender: !passed ? prepOutput(oldRendering, newRendering) : null
    };
  });
}

function evaluateStylisticRule(rule, spec, dataset, oldView) {
  return generateVegaRendering(spec, 'svg').then(([view, render]) => ({
    ...ruleOutput(rule),
    passed: rule.evaluator(oldView, spec, render)
  }));
}
