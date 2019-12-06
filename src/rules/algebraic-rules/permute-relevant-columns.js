import {clone, getXYFieldNames} from '../../utils';
import {randomizeColumns} from '../../dirty';
import {
  expectDifferent,
  expectDifferentBars,
  testInstrument,
} from '../algebraic-detectors';

const randomizingColumnsShouldMatter = {
  name: 'algebraic-permute-relevant-columns',
  type: 'algebraic-stat-data',
  generateNumberOfIterations: (dataset, spec, view) => 100,
  operation: (container, spec) => {
    const data = clone(container);
    randomizeColumns(data, ...getXYFieldNames(spec));
    // console.log(JSON.stringify(data, null, 2), JSON.stringify(container, null, 2), getXYFieldNames(spec));
    return data;
  },
  // selectEvaluator: spec => {
  //   if (spec.mark === 'bar' || spec.mark.type === 'bar') {
  //     return expectDifferentBars;
  //   }
  //   return expectDifferent;
  // },
  selectEvaluator: testInstrument,
  filter: (spec, data, view) => {
    if (data.length === 0) {
      return false;
    }
    // if x and y plot and aggregate is count, then this rule will always pass
    if (
      ['x', 'y'].some(
        key => spec.encoding[key] && spec.encoding[key].aggregate === 'count',
      )
    ) {
      return false;
    }
    const fields = getXYFieldNames(spec);
    if (fields.length !== fields.filter(d => d).length) {
      return false;
    }
    const oneOfFieldsIsInvalid = data.some(
      d => !fields.every(key => d.hasOwnProperty(key)),
    );
    if (oneOfFieldsIsInvalid) {
      return false;
    }
    const {transform} = spec;
    return !transform || (transform && !transform.find(d => d.fold));
  },
  explain:
    'After randomizing the relationship between the two data variables the chart remained the same. This suggests that your visualization is not showing their relationship in a discernable manner.',
};

export default randomizingColumnsShouldMatter;
