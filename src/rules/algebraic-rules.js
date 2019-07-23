/* eslint-disable max-len */
import outliers from 'outliers';
import {
  buildPixelDiff,
  clone,
  getXYFieldNames,
  shuffle,
  filterForXandY,
  filterForAggregates,
  extractTransforms
} from '../utils';
import {dropRow, randomizeColumns} from '../dirty';

// i can't really decide between these various modes, TODO follow up more deeply later
const evaluationModes = {
  // pure string based
  STRING_BASED: {
    expectSame: (oldRendering, newRendering) => oldRendering === newRendering,
    expectDifferent: (oldRendering, newRendering) => oldRendering !== newRendering
  },
  // sanity checkers
  SANITY_CHECKS: {
    expectSame: () => false,
    expectDifferent: () => false
  },
  // pixel diff based
  PIXEL_DIFF: {
    // this seems like it should be the best, but is not necessarilly
    expectSame: (oldRend, newRend) => {
      const {delta} = buildPixelDiff(oldRend, newRend);
      return delta < 10;
    },
    expectDifferent: (oldRend, newRend) => {
      const {delta} = buildPixelDiff(oldRend, newRend);
      return delta > 10;
    }
  }
};
const {expectSame, expectDifferent} = evaluationModes.PIXEL_DIFF;

function groupByPointerCreation(data, groupbyKey) {
  const backwardGroupBy = data.reduce((acc, row, idx) => {
    const key = row[groupbyKey];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push({row, idx});
    return acc;
  }, {});

  return Object.entries(backwardGroupBy).reduce((acc, [outputKey, groupedRows]) => {
    groupedRows.forEach(({idx}) => {
      acc[idx] = outputKey;
    });
    return acc;
  }, {});
}

function identityProvMap(data) {
  return data.reduce((acc, row, idx) => {
    acc[idx] = idx;
    return acc;
  }, {});
}

/**
 * Recursively forward pass across tree
 * goal of this pass is to link data at each stage in the transform
 * such that each layer has a pointers either to where each row ended up in the next transform,
 * or is null, in order to execute this, it will likely be necessary to lightly reimplement all of the operators,
 * or at least, construct functions for building these lineage graphs
 */
function provenencePass(tree, transform) {
  if (!transform.length) {
    return [];
  }
  const relevantTarget = tree._targets[0];
  const thisTransform = transform[0];
  const data = Array.isArray(tree.value) ? tree.value : null;
  return [{transform: thisTransform, data, transformFunction: tree._argval}]
    .concat(provenencePass(relevantTarget, transform.slice(1)));
}

// almost certainly misseplling prov
function constructTransformProvenecePath(dataset, spec, view) {
  const specDecoratedWithTransforms = extractTransforms(spec);
  const transforms = [{type: 'identity'}].concat(specDecoratedWithTransforms.transform);
  const linearizedProvPath = provenencePass(view._runtime.data.source_0.input, transforms);
  // forward pass, ensure each transform step has data
  for (let i = 0; i < linearizedProvPath.length; i++) {
    if (!linearizedProvPath[i].data && i > 0) {
      linearizedProvPath[i].data = linearizedProvPath[i - 1].data;
    }
  }
  // backward pass, infer prov maps
  for (let i = (linearizedProvPath.length - 1); i > 0; i--) {
    const transform = linearizedProvPath[i];
    const upstreamTransform = linearizedProvPath[i - 1];
    // aggregate operator
    if (transform.transform.groupby) {
      // now find each of the values in the current transform value
      // use groupByRelations to create the relavant prov map.
      transform.provMap = groupByPointerCreation(upstreamTransform.data, transform.transform.groupby[0]);
    } else {
      // if not groupby then use identity map
      // TODO: filter will probably have something to say here, also probably fold ugh
      transform.provMap = identityProvMap(transform.data);
    }
  }
  const startToTailMap = linearizedProvPath.reduce((acc, stage) => {
    if (!stage.provMap) {
      return acc;
    }
    Object.entries(acc).forEach(([source, target]) => {
      acc[source] = stage.provMap[target];
    });
    return acc;
  }, identityProvMap(dataset));
  const tailToStartMap = Object.entries(startToTailMap)
    .reduce((acc, [start, tail]) => {
      if (!acc[tail]) {
        acc[tail] = [];
      }
      // setting number here maybe be wrong
      acc[tail].push(Number(start));
      return acc;
    }, {});
  return {startToTailMap, tailToStartMap};
}

const oppositeFiled = {x: 'y', y: 'x'};
const destroyVariance = ['x', 'y'].map(name => ({
  name: `algebraic-destroy-variance--${name}-axis`,
  type: 'algebraic-data',
  operation: (dataset, spec, view) => {
    const {tailToStartMap} = constructTransformProvenecePath(dataset, spec, view);
    const extractedSpec = extractTransforms(spec);
    const inputFieldName = spec.encoding[name].field;
    const outputFieldName = extractedSpec.encoding[name].field;
    const aggregateFieldName = extractedSpec.encoding[oppositeFiled[name]].field;
    // 1. for each record at tail of path, get aggregate value
    // 2. find each stop stream record id
    // 3. set aggregate value (field y some of the time) to be the downstream value
    const aggregateOutputPairs = view._runtime.data.source_0.output.value.reduce((acc, row) => {
      acc[row[aggregateFieldName]] = row[outputFieldName];
      return acc;
    }, {});
    // set each corresponding value in the original collection to aggregate value
    const data = clone(dataset);
    Object.entries(aggregateOutputPairs).forEach(([terminalKey, aggValue]) => {
      tailToStartMap[terminalKey].forEach(startKey => {
        data[startKey][inputFieldName] = aggValue;
      });
    });

    return data;
  },
  evaluator: expectSame,
  filter: filterForAggregates(name),
  explain: 'destroying the variance should not affect the chart under aggregates'
}));

const contractToSingleRecords = ['x', 'y'].map(name => ({
  name: `algebraic-contract-to-single-record--${name}-axis`,
  type: 'algebraic-data',
  operation: (dataset, spec, view) => {
    const {tailToStartMap} = constructTransformProvenecePath(dataset, spec, view);
    const extractedSpec = extractTransforms(spec);
    const outputFieldName = extractedSpec.encoding[name].field;
    const aggregateFieldName = extractedSpec.encoding[oppositeFiled[name]].field;
    // 1. for each record at tail of path, get aggregate value
    // 2. find each stop stream record id
    // 3. for each mark set all but one mark in the input to nulls
    // 4. filter out nulls from input
    const aggregateOutputPairs = view._runtime.data.source_0.output.value.reduce((acc, row) => {
      acc[row[aggregateFieldName]] = row[outputFieldName];
      return acc;
    }, {});
    const data = clone(dataset);
    Object.entries(aggregateOutputPairs).forEach(([terminalKey, aggValue]) => {
      const targetArray = tailToStartMap[terminalKey];
      // don't try to drop any records for single length data
      if (targetArray.length <= 1) {
        return;
      }
      const safeIndex = Math.floor(Math.random() * targetArray.length);
      targetArray.forEach((startKey, idx) => {
        if (idx === safeIndex) {
          return;
        }
        data[startKey] = null;
      });
    });

    return data.filter(d => d);
  },
  evaluator: expectDifferent,
  filter: filterForAggregates(name),
  explain: 'reducing the aggregate values to a single record should affect the chart'
}));

const shouldHaveCommonNumberOfRecords = ['x', 'y'].map(name => ({
  name: `algebraic-aggregates-should-have-a-similar-number-of-input-records--${name}-axis`,
  type: 'algebraic-spec',
  evaluator: (oldRendering, newRendering, spec, perturbedSpec, oldView, newView) => {
    const measurements = newView._runtime.data.marks.values.value
      .map(d => d[name]);
    const allMeasuresSame = measurements.every(d => measurements[0] === d);
    // if there aren't enough observations to compute outliers dont
    if (measurements.length < 3) {
      return allMeasuresSame;
    }
    // otherwise use outliers as you wish
    return allMeasuresSame || outliers(measurements).length === 0;
  },
  operation: (spec) => {
    // i feel so dirty, string parsing for deep copy is bad
    const duppedSpec = JSON.parse(JSON.stringify(spec));
    duppedSpec.encoding[name].aggregate = 'count';
    return duppedSpec;
  },
  filter: filterForAggregates(name),
  explain: 'Encodings using aggregates to group records should probably have a common number of records in each of the bins.'
}));

const outliersShouldMatter = {
  name: 'algebraic-outliers-should-matter',
  type: 'algebraic-data',
  operation: (container, spec) => getXYFieldNames(spec)
    .reduce((acc, column) => acc.filter(outliers(column)), clone(container)),
  evaluator: expectDifferent,
  filter: (spec, data, view) => {
    if (!filterForXandY(spec, data, view)) {
      return false;
    }
    // dont apply rule if there aren't outliers,
    // ie disinclude this rule if filtering does nothing to the data
    const result = getXYFieldNames(spec)
      .reduce((acc, column) => acc.filter(outliers(column)), clone(data));
    return result.length !== data.length;
  },
  explain: 'After deleting the outliers the chart remained unchanged, this suggests that extreme values may not be detected. Make sure that it is behaving as expected'
};

const randomizingColumnsShouldMatter = {
  name: 'algebraic-permute-relevant-columns',
  type: 'algebraic-data',
  operation: (container, spec) => {
    const data = clone(container);
    randomizeColumns(data, ...(getXYFieldNames(spec)));
    return data;
  },
  evaluator: expectDifferent,
  filter: (spec, data, view) => {
    if (!filterForXandY(spec, data, view)) {
      return false;
    }
    const fields = getXYFieldNames(spec);
    if (fields.length !== fields.filter(d => d).length) {
      return false;
    }
    const {transform} = spec;
    return !transform || transform && !transform.find(d => d.fold);
  },
  explain: 'After randomizing the relationship between the two data variables the chart remained the same. This suggests that your visualization is not showing their relationship in a discrenable manner.'
};

const shufflingDataShouldMatter = {
  name: 'algebraic-shuffle-input-data',
  type: 'algebraic-data',
  operation: (container) => shuffle(clone(container)),
  evaluator: expectSame,
  explain: 'After shuffling the input data randomly, the resulting image was detected as being different from the original. This may suggest that there is overplotting in your data or that there a visual aggregation removing some information from the rendering.'
};

const deletingRowsShouldMatter = {
  name: 'algebraic-randomly-delete-rows',
  type: 'algebraic-data',
  operation: (container) => {
    const clonedData = clone(container);
    for (let i = 0; i < container.length * 0.3; i++) {
      dropRow(clonedData);
    }
    return clonedData;
  },
  evaluator: expectDifferent,

  explain: 'After randomly deleting a third of the rows the image has remained the same. This suggests that there is an aggregator that is doing too much work, be careful.'
};

const rules = [
  ...contractToSingleRecords,
  ...destroyVariance,
  ...shouldHaveCommonNumberOfRecords,
  outliersShouldMatter,
  randomizingColumnsShouldMatter,
  shufflingDataShouldMatter,
  deletingRowsShouldMatter
];

export default rules;
