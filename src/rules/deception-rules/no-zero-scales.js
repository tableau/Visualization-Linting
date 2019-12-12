import {filterForScale} from '../../utils';

const noZeroScale = ['x', 'y'].map(key => ({
  name: `deception-vis-no-zero-scales-${key}`,
  type: 'stylistic',
  evaluator: (view, spec, render) =>
    (([lb, ub]) => lb !== ub)(view.scale(key).domain()),
  filter: filterForScale(key),
  // eslint-disable-next-line
  explain: `Scales with zero extent (as your ${key} axis has) mask all information contained within them. Give your axis a non-zero domain.`,
}));

export default noZeroScale;
