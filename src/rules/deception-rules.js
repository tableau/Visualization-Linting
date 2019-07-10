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
  const scale = view.scale(scaleName);
  return scale && quantScales[scale.type];
};

const rules = [
  // NOT WELL TESTED
  ...[
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
    explain: `Axes should generally point in a direction which is familiar to most readers. The direction of your ${name} axis is out of line with the common usage. This can be an alright design, just make sure that it is intentional.`
  })),
  // NOT TESTED
  ...['x', 'y'].map(name => ({
    name: `deception-vis-no-zero-scales-${name}`,
    type: 'stylistic',
    evaluator: (view, spec, render) =>
      (([lb, ub]) => lb !== ub)(view.scale(name).domain()),
    filter: filterForScale(name),
    explain: `Scales with zero extent (as your ${name} axis has) mask all information contained within them. Give your axis a non-zero domain.`
  })),
  ...['x', 'y'].map(name => ({
    name: `deception-vis-scale-should-start-at-zero-${name}`,
    type: 'stylistic',
    evaluator: (view, spec, render) => {
      return view.scale(name).domain()[0] === 0;
    },
    filter: (spec, data, view) => {
      const type = view.scale().type;
      return filterForScale(name)(spec, data, view) && type !== 'utc' && type !== 'time';
    }
  }))
];
export default rules;
