import {clone, shuffle} from '../../utils';
import {
  expectSameBars,
  expectSameLines,
  expectSame,
  testInstrument,
} from '../algebraic-detectors';

const deduplicatationShouldntMatter = {
  name: 'algebraic-deduplicate-input-data',
  type: 'algebraic-data',
  operation: container => {
    const hasBeenSeen = {};
    return clone(container).filter(row => {
      const key = JSON.stringify(row);
      if (hasBeenSeen[key]) {
        return false;
      }
      hasBeenSeen[key] = true;
      return true;
    });
  },
  selectEvaluator: testInstrument,
  filter: (spec, data, view) => {
    return data.length > 0;
  },
  explain: 'AGH',
};
export default deduplicatationShouldntMatter;
