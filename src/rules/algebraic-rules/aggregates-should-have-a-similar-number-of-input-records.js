import outliers from 'outliers';
import {filterForAggregates} from '../../utils';

const shouldHaveCommonNumberOfRecords = ['x', 'y'].map(key => ({
  name: `algebraic-aggregates-should-have-a-similar-number-of-input-records--${key}-axis`,
  type: 'algebraic-spec',
  selectEvaluator: spec => (
    oldRendering,
    newRendering,
    _,
    perturbedSpec,
    oldView,
    newView
  ) => {
    const viewData = newView._runtime.data;
    // lots of foot work to catch line and other stack based renderings
    const measurements =
      (Array.isArray(viewData.source_0.output.value) &&
        viewData.source_0.output.value.map(d => d.__count)) ||
      viewData.marks.values.value.map(d => d[key]);
    const allMeasuresSame = measurements.every(d => measurements[0] === d);
    // if there aren't enough observations to compute outliers dont
    if (measurements.length < 3) {
      return allMeasuresSame;
    }
    // otherwise use outliers as you wish
    return allMeasuresSame || outliers(measurements).length === 0;
  },
  operation: spec => {
    // i feel so dirty, string parsing for deep copy is bad
    const duppedSpec = JSON.parse(JSON.stringify(spec));
    duppedSpec.encoding[key].aggregate = 'count';
    return duppedSpec;
  },
  filter: (spec, data, view) => {
    if (data.length === 0) {
      return false;
    }
    if (spec.encoding && (!spec.encoding.x || !spec.encoding.y)) {
      return false;
    }
    // avoid stack encodings
    return (
      filterForAggregates(key)(spec, data, view) &&
      spec.mark !== 'area' &&
      spec.mark.type !== 'area'
    );
  },
  explain:
    'Encodings using aggregates to group records should probably have a common number of records in each of the bins.'
}));

export default shouldHaveCommonNumberOfRecords;
