import {
  uniqueKeysAsBoolMap
} from '../utils';

/* eslint-disable max-len */
const nonLinearScales = {
  log: true,
  pow: true,
  sqrt: true,
  symlog: true
};
const quantScales = {
  ...nonLinearScales,
  linear: true,
  time: true,
  utc: true,
  sequential: true
};
const filterForScale = scaleName => (_, __, view) => {
  // not a valid spec to check for this scale name if that scale doesn't exisit
  if (!uniqueKeysAsBoolMap(view._runtime.scales)[scaleName]) {
    return false;
  }

  const scale = view.scale(scaleName);
  return scale && quantScales[scale.type];
};

const noReversedAxes = [
  {key: 'x', shouldReverse: false},
  {key: 'y', shouldReverse: true}
].map(({key, shouldReverse}) => ({
  name: `deception-vis-no-reversed-axes-${key}`,
  type: 'stylistic',
  evaluator: (view, spec, render) => {
    const scale = view.scale(key);
    const domainIncreasing = (([lD, uD]) => lD < uD)(scale.domain());
    const rangeIncreasing = (([lR, uR]) => lR < uR)(scale.range());
    return shouldReverse ?
      (domainIncreasing && !rangeIncreasing) :
      (domainIncreasing && rangeIncreasing);
  },
  filter: filterForScale(key),
  explain: `Axes should generally point in a direction which is familiar to most readers. The direction of your ${key} axis is out of line with the common usage. Make sure that it is intentional.`
}));

const noZeroScale = ['x', 'y'].map(key => ({
  name: `deception-vis-no-zero-scales-${key}`,
  type: 'stylistic',
  evaluator: (view, spec, render) =>
    (([lb, ub]) => lb !== ub)(view.scale(key).domain()),
  filter: filterForScale(key),
  explain: `Scales with zero extent (as your ${key} axis has) mask all information contained within them. Give your axis a non-zero domain.`
}));

const visScaleFromZero = ['x', 'y'].map(key => ({
  name: `deception-vis-scale-should-start-at-zero-${key}`,
  type: 'stylistic',
  evaluator: (view, spec, render) => {
    return view.scale(key).domain()[0] === 0;
  },
  filter: (spec, data, view) => {
    if (!filterForScale(key)(spec, data, view)) {
      return false;
    }
    const type = view.scale(key).type;
    return type !== 'utc' && type !== 'time';
  },
  explain: `It is often the case that quantitative scales should start at zero. Your ${key} axis does not! Make sure this is the right choice for your audience.`
}));

const barChartsAreUsuallyAggregates = ['x', 'y'].map(key => ({
  name: `deception-vis-bar-chart-are-usually-aggregates--${key}-axis`,
  type: 'stylistic',
  evaluator: (view, spec, render) => {
    const field = spec.encoding[key];
    return Boolean(field.aggregate);
  },
  filter: (spec, data, view) => {
    const field = spec.encoding[key];
    return filterForScale(key)(spec, data, view) && spec.mark === 'bar' && !field.bin;
  },
  explain: `Bar charts usually contain aggregates, make sure that you intended to not have an aggregate for this ${key} axis.`
}));

const dontUseNonLinearScales = ['x', 'y'].map(key => ({
  name: `deception-vis-dont-use-non-linear-scales--${key}-axis`,
  type: 'stylistic',
  evaluator: (view, spec, render) => {
    const scale = view.scale(key);
    return scale && !nonLinearScales[scale.type];
  },
  filter: filterForScale(key),
  explain: `Unless they are clearly marked users tend assume that axes are scaled using linear scales, make sure that your ${key} axis is meaningfully demarked.`
}));

const rules = [
  ...dontUseNonLinearScales,
  ...barChartsAreUsuallyAggregates,
  ...noReversedAxes,
  ...noZeroScale,
  ...visScaleFromZero
];
export default rules;
/* eslint-enable max-len */
