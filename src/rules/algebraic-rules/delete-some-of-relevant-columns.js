import {clone, getXYFieldNames} from '../../utils';
import {partiallyDropColumn} from '../../dirty';
import {
  // expectDifferent,
  testInstrument,
} from '../algebraic-detectors';

const deletingRandomValuesShouldMatter = {
  name: 'algebraic-delete-some-of-relevant-columns',
  type: 'algebraic-stat-data',
  generateNumberOfIterations: (dataset, spec, view) => 100,
  operation: (container, spec) => {
    const data = clone(container);
    partiallyDropColumn(data, getXYFieldNames(spec).filter(d => d)[0], 0.2);
    return data;
  },
  selectEvaluator: testInstrument,
  filter: (spec, data, view) => {
    if (data.length === 0) {
      return false;
    }
    const fields = getXYFieldNames(spec).filter(d => d);
    if (fields.length < 1) {
      return false;
    }
    return data.some(row => fields.some(key => isFinite(row[key])));
    // const {transform} = spec;
    // return !transform || transform && !transform.find(d => d.fold);
  },
  explain:
    'After nulling 20% of the values being visualized the chart remained the same, this indicates that your visualization is not resilliant to change.',
};

export default deletingRandomValuesShouldMatter;
