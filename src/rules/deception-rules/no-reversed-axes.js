import {filterForScale} from '../../utils';
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
    return shouldReverse
      ? domainIncreasing && !rangeIncreasing
      : domainIncreasing && rangeIncreasing;
  },
  filter: filterForScale(key),
  explain: `Axes should generally point in a direction which is familiar to most readers. The direction of your ${key} axis is out of line with the common usage. Make sure that it is intentional.`
}));

export default noReversedAxes;
