import {filterForScale, nonLinearScales} from '../../utils';
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
export default dontUseNonLinearScales;
