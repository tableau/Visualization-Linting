import {
  getDataset,
  generateVegaRendering,
  generateVegaView,
  checkIfSpecIsSupported,
} from './utils';
import {
  buildPixelDiff,
  concatImages,
  overlayImages,
  makeBlank,
  toPng,
} from './image-manipulation';
import lintRules from './rules';
import {SPEC_NOT_SUPPORTED, CRASH, OK} from './codes';

const evalMap = {
  'algebraic-spec': evaluateAlgebraicSpecRule,
  'algebraic-data': evaluateAlgebraicDataRule,
  stylistic: evaluateStylisticRule,
  'algebraic-stat-data': evaluateStatisticalAlgebraicRule,
};

export function lint(spec, options = {}) {
  if (!checkIfSpecIsSupported(spec)) {
    return Promise.resolve({code: SPEC_NOT_SUPPORTED, lints: []});
  }
  return Promise.all([getDataset(spec), generateVegaView(spec)])
    .then(([dataset, view]) => {
      return Promise.all(
        lintRules
          .filter(({filter}) => filter(spec, dataset, view))
          .map(rule => evalMap[rule.type](rule, spec, dataset, view, options)),
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
        msg: e,
      };
    });
}

const ruleOutput = ({name, explain}) => ({name, explain, failRender: null});

// TODO: refactor this function and the next one to be instances of a HOF
function evaluateAlgebraicSpecRule(rule, spec, dataset, oldView, options) {
  const evaluator = rule.selectEvaluator(spec);
  const perturbedSpec = rule.operation(spec);
  return Promise.all([
    generateVegaRendering(spec, 'raster'),
    generateVegaRendering(perturbedSpec, 'raster'),
    generateVegaView(perturbedSpec),
  ]).then(([oldRendering, newRendering, newView]) => {
    const passed = evaluator(
      oldRendering,
      newRendering,
      spec,
      perturbedSpec,
      oldView,
      newView,
    );
    return {...ruleOutput(rule), passed};
  });
}

function perturbSpec(dataset, spec, oldView, rule) {
  return {
    ...spec,
    data: {values: rule.operation(dataset, spec, oldView)},
  };
}

function prepConcatOutput(oldRendering, newRendering) {
  const failRender = buildPixelDiff(oldRendering, newRendering).diffStr;
  // type is there to allow for svg renders, still to come
  return {
    type: 'raster',
    render: concatImages([oldRendering, newRendering, failRender]),
  };
}

function evaluateAlgebraicDataRule(rule, spec, dataset, oldView, options) {
  const {noVisualExplain} = options;
  const evaluator = rule.selectEvaluator(spec);
  const perturbedSpec = perturbSpec(dataset, spec, oldView, rule);
  return Promise.all([
    generateVegaRendering(spec, 'raster'),
    generateVegaRendering(perturbedSpec, 'raster'),
    generateVegaView(perturbedSpec),
  ]).then(([oldRendering, newRendering, newView]) => {
    const passed = evaluator(
      oldRendering,
      newRendering,
      spec,
      perturbedSpec,
      oldView,
      newView,
    );

    return {
      ...ruleOutput(rule),
      passed,
      failedRender:
        !noVisualExplain && !passed
          ? prepConcatOutput(oldRendering, newRendering)
          : null,
    };
  });
}

function evaluateStylisticRule(rule, spec, dataset, oldView, options) {
  return generateVegaRendering(spec, 'svg').then(([view, render]) => ({
    ...ruleOutput(rule),
    passed: rule.evaluator(oldView, spec, render),
  }));
}

function prepOverlayOutput(allRenderings, oldRendering) {
  const oldPng = toPng(oldRendering);
  const toImg = ({newRendering}) => newRendering;
  const opacity = 0.9 - 1 / allRenderings.length;

  const passing = allRenderings.filter(({passed}) => passed).map(toImg);
  const passedOverlays = overlayImages(passing, opacity);
  const failing = allRenderings.filter(({passed}) => !passed).map(toImg);
  const failingOverlays = overlayImages(failing, opacity);

  const allOverlays = overlayImages(allRenderings.map(toImg), opacity);

  const imagesToConcat = [allOverlays, passedOverlays, failingOverlays]
    .map(d => d.data || makeBlank(oldPng.height, oldPng.width).data)
    .filter(d => d);
  return {
    type: 'raster',
    render: concatImages(imagesToConcat),
  };
}

function generateMorphEval(rule, dataset, spec, oldView, oldRendering) {
  const evaluator = rule.selectEvaluator(spec);
  return (_, idx) => {
    const perturbedSpec = perturbSpec(dataset, spec, oldView, rule);
    return Promise.all([
      generateVegaRendering(perturbedSpec, 'raster'),
      generateVegaView(perturbedSpec),
    ]).then(([newRendering, newView]) => {
      const passed = evaluator(
        oldRendering,
        newRendering,
        spec,
        perturbedSpec,
        oldView,
        newView,
      );
      return {
        passed,
        newView,
        newRendering,
      };
    });
  };
}

import {variance} from 'datalib';
function evaluateStatisticalAlgebraicRule(
  rule,
  spec,
  dataset,
  oldView,
  options,
) {
  const {noVisualExplain} = options;
  const {
    generateNumberOfIterations,
    // statisticalEval
  } = rule;
  return generateVegaRendering(spec, 'raster').then(oldRendering => {
    const numIterations = generateNumberOfIterations(dataset, spec, oldView);
    // run a bunch of evaluations at once
    return Promise.all(
      [...new Array(numIterations)].map(
        generateMorphEval(rule, dataset, spec, oldView, oldRendering),
      ),
    )
      .then(results => ({
        // passed: results.reduce((x, {passed}) => x + (passed ? 1 : 0), 0),
        // passed: results.reduce((x, {passed}) => x + passed, 0) / results.length,
        passed: variance(results.map(({passed}) => passed)),
        results,
      }))
      .then(({passed, results}) => {
        return {
          ...ruleOutput(rule),
          passed,
          failedRender: !noVisualExplain
            ? prepOverlayOutput(results, oldRendering)
            : null,
        };
      });
  });
}
