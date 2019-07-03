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
    filter: filterForScale(name)
  })),
  // NOT TESTED
  ...['x', 'y'].map(name => ({
    name: `deception-vis-no-zero-scales-${name}`,
    type: 'stylistic',
    evaluator: (view, spec, render) =>
      (([lb, ub]) => lb !== ub)(view.scale(name).domain()),
    filter: filterForScale(name)
  }))
];
export default rules;
