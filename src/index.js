import outliers from 'outliers';
import {
  clone,
  getDataset,
  generateVegaRendering,
  generateVegaView,
  shuffle
} from './utils';
import {dropRow, randomizeColumns} from './dirty';

const expectSame = (oldRendering, newRendering) => oldRendering === newRendering;
const expectDifferent = (oldRendering, newRendering) => oldRendering !== newRendering;
const quantScales = {
  linear: true,
  log: true,
  pow: true,
  sqrt: true,
  symlog: true,
  time: true,
  utc: true,
  sequential: true
};

function getXYFieldNames(spec) {
  // not a sustainable version of this encoding grab:
  // what if we encounter univariate specs?
  const {transform, encoding: {x, y}} = spec;
  // later this can be abstracted probably into a getRelevantColumns op i guess
  const foldTransform = transform && transform.find(d => d.fold);
  return foldTransform ? foldTransform.fold : [x.field, y.field];
}

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
  // NOT WELL TESTED
  ...[
    {name: 'x', shouldReverse: false},
    {name: 'y', shouldReverse: true}
  ].map(({name, shouldReverse}) => ({
    name: `deception-vis-no-reversed-axes-${name}`,
    type: 'stylistic',
    evaluator: (view, spec, render) => {
      const scale = view.scale(name);
      if (!quantScales[scale.type]) {
        return true;
      }
      const [lD, uD] = scale.domain();
      const domainIncreasing = lD < uD;
      const [lR, uR] = scale.range();
      const rangeIncreasing = lR < uR;
      return shouldReverse ?
        (domainIncreasing && !rangeIncreasing) :
        (domainIncreasing && rangeIncreasing);
    }
  })),
  // NOT TESTED
  ...['x', 'y'].map(key => ({
    name: `deception-vis-no-zero-scales-${key}`,
    type: 'stylistic',
    evaluator: (view, spec, render) => {
      const scale = view.scale(key);
      if (!quantScales[scale.type]) {
        return true;
      }
      const [lb, ub] = scale.domain();
      return lb !== ub;
    }
  })),
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
  // add automatic inclusion
].map(d => ({filter: () => true, ...d}));

const evalMap = {
  'algebraic-container': evaluateAlgebraicContainerRule,
  stylistic: evaluateStylisticRule
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

function evaluateStylisticRule(rule, spec, dataset) {
  const {evaluator, name} = rule;

  return Promise.all([generateVegaView(spec), generateVegaRendering(spec, 'svg')])
  .then(([view, render]) => {
    const passed = evaluator(view, spec, render);
    const failedRender = {type: 'svg', render};
    return {name, passed, failedRender: !passed ? failedRender : null};
  });
}
