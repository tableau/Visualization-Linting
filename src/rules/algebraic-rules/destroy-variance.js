import {clone, filterForAggregates, prepProv} from '../../utils';
import {expectSame} from '../algebraic-detectors';

const destroyVariance = ['x', 'y'].map(name => ({
  name: `algebraic-destroy-variance--${name}-axis`,
  type: 'algebraic-data',
  operation: (dataset, spec, view) => {
    const {aggregateOutputPairs, tailToStartMap, inputFieldName} = prepProv(
      dataset,
      spec,
      view,
      name
    );
    // set each corresponding value in the original collection to aggregate value
    const data = clone(dataset);
    const aggType = spec.encoding[name].aggregate;
    Object.entries(aggregateOutputPairs).forEach(([terminalKey, aggValue]) => {
      (tailToStartMap[terminalKey] || []).forEach(startKey => {
        if (aggType === 'sum') {
          data[startKey][inputFieldName] =
            aggValue / tailToStartMap[terminalKey].length;
        } else {
          data[startKey][inputFieldName] = aggValue;
        }
      });
    });

    return data;
  },
  selectEvaluator: spec => expectSame,
  filter: (spec, data, view) => {
    if (data.length === 0) {
      return false;
    }
    if (spec.encoding && (!spec.encoding.x || !spec.encoding.y)) {
      return false;
    }
    return filterForAggregates(name)(spec, data, view);
  },
  explain:
    'destroying the variance should not affect the chart under aggregates'
}));

export default destroyVariance;
