// ALGEBRAIC RULES
import destroyVariance from './algebraic-rules/destroy-variance';
import {
  contractToSingleRecords,
  inflateToCommonNumberOfRecords
} from './algebraic-rules/change-number-of-records';
import filterOutNullRecords from './algebraic-rules/remove-nulls';
import shouldHaveCommonNumberOfRecords from './algebraic-rules/aggregates-should-have-a-similar-number-of-input-records';
import outliersShouldMatter from './algebraic-rules/outliers-should-matter';
import FLIPEVERYTHING from './algebraic-rules/invert-on-quant-fields';
import randomizingColumnsShouldMatter from './algebraic-rules/permute-relevant-columns';
import deletingRandomValuesShouldMatter from './algebraic-rules/delete-some-of-relevant-columns';
import shufflingDataShouldMatter from './algebraic-rules/shuffle-input-data';
// DECEPTION RULES
import dontUseNonLinearScales from './deception-rules/bar-chart-are-usually-aggregates';
import barChartsAreUsuallyAggregates from './deception-rules/dont-use-non-linear-scales';
import noReversedAxes from './deception-rules/no-reversed-axes';
import noZeroScale from './deception-rules/no-zero-scales';
import visScaleFromZero from './deception-rules/scale-should-start-at-zero';
// STAT ALGEBRAIC RULES
import bootstrapBars from './statistical-algebraic-rules/data-bootstrap-bar-order';
import withInGroupResample from './statistical-algebraic-rules/within-group-bootstrap';
import deletingRowsShouldMatter from './statistical-algebraic-rules/randomly-delete-rows';

const lintRules = [
  // STAT ALGEBRAIC RULES
  deletingRowsShouldMatter,
  bootstrapBars,
  withInGroupResample,

  // ALGEBRAIC RULES
  // ...filterOutNullRecords,
  // ...inflateToCommonNumberOfRecords,
  // FLIPEVERYTHING,
  // ...contractToSingleRecords,
  // ...destroyVariance,
  // ...shouldHaveCommonNumberOfRecords,
  outliersShouldMatter
  // randomizingColumnsShouldMatter,
  // shufflingDataShouldMatter,
  // deletingRandomValuesShouldMatter,

  // DECEPTION RULES
  // ...dontUseNonLinearScales,
  // ...barChartsAreUsuallyAggregates,
  // ...noReversedAxes,
  // ...noZeroScale,
  // ...visScaleFromZero
  // the map adds default inclusion
].map(d => ({filter: () => true, ...d}));

export default lintRules;
