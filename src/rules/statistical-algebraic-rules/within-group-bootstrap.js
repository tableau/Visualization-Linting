import {prepProv} from '../../utils';
import {expectSameBars} from '../algebraic-detectors';
import {fullResample} from '../../bootstrap';

const bootstrapBars = {
  name: `algebraic-within-group-bootstrap`,
  type: 'algebraic-stat-data',
  // operation: (data, spec, view) => bootstrap(clone(data)).samples(data.length),
  operation: (dataset, spec, view) => {
    const {aggregateOutputPairs, tailToStartMap} = prepProv(
      dataset,
      spec,
      view,
      'y' //opposite key as expected
    );
    const data = [];
    debugger;
    Object.keys(aggregateOutputPairs).forEach(terminalKey => {
      fullResample(tailToStartMap[terminalKey] || []).forEach(idx =>
        data.push(dataset[idx])
      );
    });

    return data;
  },
  selectEvaluator: spec => expectSameBars,
  statisticalEval: results => {
    const numPassing = results.reduce((x, {passed}) => x + (passed ? 1 : 0), 0);
    console.log('within-group-bootstrap', numPassing);
    return false;
    // return numPassing > 333;
  },
  generateNumberOfIterations: (dataset, spec, view) => 100,
  filter: (spec, data, view) => {
    if (data.length === 0) {
      return false;
    }
    if (spec.mark !== 'bar') {
      return false;
    }
    if (!spec.encoding.x.aggregate && !spec.encoding.y.aggregate) {
      return false;
    }
    return true;
  },
  explain: 'TODODODODODODODODODODO.'
};

export default bootstrapBars;
