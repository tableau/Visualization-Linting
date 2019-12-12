import {filterForScale} from '../../utils';

const barChartsAreUsuallyAggregates = ['x', 'y'].map(key => ({
  name: `deception-vis-bar-chart-are-usually-aggregates--${key}-axis`,
  type: 'stylistic',
  evaluator: (view, spec, render) => {
    const field = spec.encoding[key];
    return Boolean(field.aggregate);
  },
  filter: (spec, data, view) => {
    const field = spec.encoding[key];
    return (
      filterForScale(key)(spec, data, view) && spec.mark === 'bar' && !field.bin
    );
  },
  // eslint-disable-next-line
  explain: `Bar charts usually contain aggregates, make sure that you intended to not have an aggregate for this ${key} axis.`,
}));

export default barChartsAreUsuallyAggregates;
