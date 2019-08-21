import outliers from 'outliers';
import {clone, getXYFieldNames, filterForXandY} from '../../utils';
import {expectDifferent} from '../algebraic-detectors';

const outliersShouldMatter = {
  name: 'algebraic-outliers-should-matter',
  type: 'algebraic-data',
  operation: (container, spec) =>
    getXYFieldNames(spec).reduce(
      (acc, column) => acc.filter(outliers(column)),
      clone(container)
    ),
  selectEvaluator: spec => expectDifferent,
  filter: (spec, data, view) => {
    if (data.length === 0) {
      return false;
    }
    if (!filterForXandY(spec, data, view)) {
      return false;
    }
    // dont apply rule if there aren't outliers,
    // ie disinclude this rule if filtering does nothing to the data
    const result = getXYFieldNames(spec).reduce(
      (acc, column) => acc.filter(outliers(column)),
      clone(data)
    );
    return result.length !== data.length;
  },
  explain:
    'After deleting the outliers the chart remained unchanged, this suggests that extreme values may not be detected. Make sure that it is behaving as expected'
};

export default outliersShouldMatter;
