import {filterForScale} from '../../utils';

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
  // eslint-disable-next-line
  explain: `It is often the case that quantitative scales should start at zero. Your ${key} axis does not! Make sure this is the right choice for your audience.`,
}));

export default visScaleFromZero;
