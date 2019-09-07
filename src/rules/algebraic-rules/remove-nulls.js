import {clone} from '../../utils';
import {expectSame} from '../algebraic-detectors';

const filterOutNullRecords = ['x', 'y'].map(key => ({
  name: `algebraic-remove-nulls--${key}-axis`,
  type: 'algebraic-data',
  operation: (data, spec) => {
    // Explicit comparison with null bc thats all we're lookin for
    return clone(data).filter(d => d[spec.encoding[key].field] !== null);
  },
  selectEvaluator: spec => expectSame,
  filter: (spec, originalData, view) => {
    const field = spec.encoding[key];
    if (!field) {
      return false;
    }
    const fieldName = field.field;
    // Explicit comparison with null bc thats all we're lookin for
    const data = clone(originalData).filter(d => d[fieldName] !== null);
    return data.length !== originalData.length;
  },
  explain:
    'Removing records that have null on a spatial dimension should not cause the chart to change. Change in this fashion indicates that the chart is being driven by the nulls in a non-trivial manner.',
}));

export default filterOutNullRecords;
