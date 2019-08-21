import {clone} from '../../utils';
import {expectDifferent} from '../algebraic-detectors';
import {dropRow} from '../../dirty';

const deletingRowsShouldMatter = {
  name: 'algebraic-randomly-delete-rows',
  type: 'algebraic-data',
  operation: container => {
    const clonedData = clone(container);
    for (let i = 0; i < container.length * 0.1; i++) {
      dropRow(clonedData);
    }
    return clonedData;
  },
  selectEvaluator: spec => expectDifferent,
  filter: (spec, data, view) => {
    return data.length > 0;
  },
  explain:
    'After randomly deleting a third of the rows the image has remained the same. This suggests that there is an aggregator that is doing too much work, be careful.'
};

export default deletingRowsShouldMatter;
