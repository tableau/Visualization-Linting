import {clone, shuffle} from '../../utils';
import {expectSame} from '../algebraic-detectors';
import {NUM_EVALS} from '../index';

const shufflingDataShouldMatter = {
  name: 'algebraic-shuffle-input-data',
  type: 'algebraic-stat-data',
  operation: container => shuffle(clone(container)),
  generateNumberOfIterations: (dataset, spec, view) => NUM_EVALS,
  selectEvaluator: spec => expectSame,
  filter: (spec, data, view) => {
    return data.length > 0;
  },
  explain:
    'After shuffling the input data randomly, the resulting image was detected as being different from the original. This may suggest that there is overplotting in your data or that there a visual aggregation removing some information from the rendering.',
};
export default shufflingDataShouldMatter;
