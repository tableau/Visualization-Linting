import destroyVariance from './algebraic-rules/destroy-variance';
import {
  contractToSingleRecords
  // inflateToCommonNumberOfRecords
} from './algebraic-rules/change-number-of-records';
// import filterOutNullRecords from './algebraic-rules/remove-nulls';
import shouldHaveCommonNumberOfRecords from './algebraic-rules/aggregates-should-have-a-similar-number-of-input-records';
import outliersShouldMatter from './algebraic-rules/outliers-should-matter';
// import FLIPEVERYTHING from './algebraic-rules/invert-on-quant-fields';
import randomizingColumnsShouldMatter from './algebraic-rules/permute-relevant-columns';
import deletingRandomValuesShouldMatter from './algebraic-rules/delete-some-of-relevant-columns';
import shufflingDataShouldMatter from './algebraic-rules/shuffle-input-data';
import deletingRowsShouldMatter from './algebraic-rules/randomly-delete-rows';

const rules = [
  // ...filterOutNullRecords,
  // ...inflateToCommonNumberOfRecords,
  // FLIPEVERYTHING,
  ...contractToSingleRecords,
  ...destroyVariance,
  ...shouldHaveCommonNumberOfRecords,
  outliersShouldMatter,
  randomizingColumnsShouldMatter,
  shufflingDataShouldMatter,
  deletingRowsShouldMatter,
  deletingRandomValuesShouldMatter
];

export default rules;
