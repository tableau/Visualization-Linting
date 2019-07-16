import {
  uniqueKeysAsBoolMap
} from '../utils';

/* eslint-disable max-len */
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
const filterForScale = scaleName => (_, __, view) => {
  // not a valid spec to check for this scale name if that scale doesn't exisit
  if (!uniqueKeysAsBoolMap(view._runtime.scales)[scaleName]) {
    return false;
  }

  const scale = view.scale(scaleName);
  return scale && quantScales[scale.type];
};

const noReversedAxes = [
  {name: 'x', shouldReverse: false},
  {name: 'y', shouldReverse: true}
].map(({name, shouldReverse}) => ({
  name: `deception-vis-no-reversed-axes-${name}`,
  type: 'stylistic',
  evaluator: (view, spec, render) => {
    const scale = view.scale(name);
    const domainIncreasing = (([lD, uD]) => lD < uD)(scale.domain());
    const rangeIncreasing = (([lR, uR]) => lR < uR)(scale.range());
    return shouldReverse ?
      (domainIncreasing && !rangeIncreasing) :
      (domainIncreasing && rangeIncreasing);
  },
  filter: filterForScale(name),
  explain: `Axes should generally point in a direction which is familiar to most readers. The direction of your ${name} axis is out of line with the common usage. Make sure that it is intentional.`
}));
const noReversedAxesX = noReversedAxes[0];
const noReversedAxesY = noReversedAxes[1];

const noZeroScale = ['x', 'y'].map(name => ({
  name: `deception-vis-no-zero-scales-${name}`,
  type: 'stylistic',
  evaluator: (view, spec, render) =>
    (([lb, ub]) => lb !== ub)(view.scale(name).domain()),
  filter: filterForScale(name),
  explain: `Scales with zero extent (as your ${name} axis has) mask all information contained within them. Give your axis a non-zero domain.`
}));
const noZeroScaleX = noZeroScale[0];
const noZeroScaleY = noZeroScale[1];

const visScaleFromZero = ['x', 'y'].map(name => ({
  name: `deception-vis-scale-should-start-at-zero-${name}`,
  type: 'stylistic',
  evaluator: (view, spec, render) => {
    return view.scale(name).domain()[0] === 0;
  },
  filter: (spec, data, view) => {
    if (!filterForScale(name)(spec, data, view)) {
      return false;
    }
    const type = view.scale(name).type;
    return type !== 'utc' && type !== 'time';
  },
  explain: `It is often the case that quantitative scales should start at zero. Your ${name} axis does not! Make sure this is the right choice for your audience.`
}));
const visScaleFromZeroX = visScaleFromZero[0];
const visScaleFromZeroY = visScaleFromZero[1];

const barChartsAreUsuallyAggregates = ['x', 'y'].map(name => ({
  name: `deception-vis-bar-chart-are-usually-aggregates--${name}-axis`,
  type: 'stylistic',
  evaluator: (view, spec, render) => {
    return Boolean(spec.encoding[name].aggregate);
  },
  filter: (spec, data, view) => {
    return filterForScale(name)(spec, data, view) && spec.mark === 'bar';
  },
  explain: `Bar charts usually contain aggregates, make sure that you intended to not have an aggregate for this ${name} axis.`
}));
const barChartsAreUsuallyAggregatesX = barChartsAreUsuallyAggregates[0];
const barChartsAreUsuallyAggregatesY = barChartsAreUsuallyAggregates[1];

const rules = [
  barChartsAreUsuallyAggregatesX,
  barChartsAreUsuallyAggregatesY,
  noReversedAxesX,
  noReversedAxesY,
  noZeroScaleX,
  noZeroScaleY,
  visScaleFromZeroX,
  visScaleFromZeroY
];
export default rules;
/* eslint-enable max-len */
