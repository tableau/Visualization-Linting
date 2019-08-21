import {parse, View, loader, read} from 'vega';
import {
  compile,
  extractTransforms as vegaLiteExtractTransforms
} from 'vega-lite';
import pixelmatch from 'pixelmatch';
import {PNG} from 'pngjs';

export function getXYFieldNames(spec) {
  // not a sustainable version of this encoding grab:
  // what if we encounter univariate specs?
  const {transform, encoding} = spec;
  // later this can be abstracted probably into a getRelevantColumns op i guess
  const foldTransform = transform && transform.find(d => d.fold);
  // return foldTransform ? foldTransform.fold : [x.field, y.field];
  return foldTransform
    ? foldTransform.fold
    : ['x', 'y'].map(key => encoding[key] && encoding[key].field);
}

export const uniqueKeysAsBoolMap = obj =>
  Object.keys(obj).reduce((acc, row) => {
    acc[row] = true;
    return acc;
  }, {});

const getScaleFileds = (spec, data, view) =>
  Object.keys(uniqueKeysAsBoolMap(view._runtime.scales)).sort();
// if a spec doesn't have x and y, reject that spec
export const filterForXandY = (spec, data, view) => {
  const [xExpect, yExpect] = getScaleFileds(spec, data, view);
  return xExpect === 'x' && yExpect === 'y';
};

// sourced from
// http://indiegamr.com/generate-repeatable-random-numbers-in-js/
export function generateSeededRandom(baseSeed = 2) {
  let seed = baseSeed;
  return function seededRandom(max, min) {
    max = max || 1;
    min = min || 0;

    seed = (seed * 9301 + 49297) % 233280;
    const rnd = seed / 233280;

    return min + rnd * (max - min);
  };
}

/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
export function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

/**
 * generateVegaRendering, takes in a vega lint spec and returns an svg rendering of it
 */
export function generateVegaRendering(spec, mode = 'raster') {
  const isSVG = mode === 'svg';
  const config = {
    renderer: isSVG ? 'svg' : 'none'
  };
  return new Promise((resolve, reject) => {
    const runtime = parse(compile(spec).spec, {renderer: 'none'});
    const view = new View(runtime, config).initialize();
    view
      .runAsync()
      .then(() => (isSVG ? view.toSVG(2) : view.toCanvas(2)))
      .then(x => resolve(isSVG ? x : x.toDataURL()))
      .catch(e => {
        /* eslint-disable no-console */
        console.error(e);
        reject(e);
        /* eslint-disable no-console */
      });
  });
}

// kinda similar to function above, maybe can refactor them together
export function generateVegaView(spec) {
  return new Promise((resolve, reject) => {
    const runtime = parse(compile(spec).spec, {renderer: 'none'});
    const view = new View(runtime, {renderer: 'none'}).initialize();
    view
      .runAsync()
      .then(x => resolve(x))
      .catch(e => {
        /* eslint-disable no-console */
        console.error(e);
        /* eslint-disable no-console */
      });
  });
}

const runTimeCache = {};
/**
 * Get a json representation of the data specified in the spec
 */
export function getDataset(spec) {
  const {data} = spec;
  if (data.values) {
    return Promise.resolve().then(() =>
      data.format ? read(data.values, data.format) : data.values
    );
  }
  if (!data.url) {
    console.log(data);
  }
  const brokenUri = data.url.split('.');
  const type = brokenUri[brokenUri.length - 1];
  const cacheAccessKey = JSON.stringify(data);
  if (runTimeCache[cacheAccessKey]) {
    return runTimeCache[cacheAccessKey];
  }
  return loader()
    .load(data.url)
    .then(d => read(d, data.format || {type, parse: 'auto'}))
    .then(d => {
      runTimeCache[cacheAccessKey] = d;
      return d;
    });
}

export const hasKey = (data, key) => new Set(Object.keys(data)).has(key);
export const clone = data => data.map(d => ({...d}));
// check if two objects are equal to a first approx
export const shallowDeepEqual = (a, b) =>
  Object.entries(a).every(([k, v]) => b[k] === v);

/* eslint-disable */
const toBuffer = img =>
  new Buffer.from(img.replace(/^data:image\/\w+;base64,/, ''), 'base64');
/* eslint-enable */

export function concatImages(images) {
  const pngs = images.map(buff => PNG.sync.read(toBuffer(buff)));
  const totalWidth = pngs.reduce((acc, {width}) => width + acc, 0);
  const maxHeight = pngs.reduce((acc, {height}) => Math.max(height, acc), 0);
  const outputImage = new PNG({width: totalWidth, height: maxHeight});
  let widthOffset = 0;
  pngs.forEach(png => {
    const {width, height, data} = png;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = 4 * (width * y + x);
        const targetIdx = 4 * (totalWidth * y + (x + widthOffset));
        for (let color = 0; color < 4; color++) {
          outputImage.data[targetIdx + color] = data[idx + color];
          // outputImage.data[targetIdx] = 0;
        }
      }
    }
    widthOffset += 4 * width;
  });
  return {
    data: `data:image/png;base64,${PNG.sync
      .write(outputImage)
      .toString('base64')}`,
    dims: {height: maxHeight, width: totalWidth}
  };
}

/**
 * Make an image have particular dimensions, will crop if less, will fill with white if empty
 */
export function padImageToSize(png, padHeight, padWidth) {
  /* eslint-disable max-depth */
  const outputImage = new PNG({height: padHeight, width: padWidth});
  for (let y = 0; y < padHeight; y++) {
    for (let x = 0; x < padWidth; x++) {
      const idx = 4 * (padWidth * y + x);
      if (x < png.width) {
        for (let color = 0; color < 4; color++) {
          outputImage.data[idx + color] = png.data[idx + color];
        }
      }
    }
  }
  /* eslint-enable max-depth */
  return outputImage;
}

/**
 * Create a pixelmatch based difference between two input data streams
 */
export function buildPixelDiff(oldRendering, newRendering) {
  const img2 = PNG.sync.read(toBuffer(oldRendering));
  const img1 = PNG.sync.read(toBuffer(newRendering));
  const width = Math.max(img1.width, img2.width);
  const height = Math.max(img1.height, img2.height);
  const diff = new PNG({width, height});
  const delta = pixelmatch(
    padImageToSize(img1, height, width).data,
    padImageToSize(img2, height, width).data,
    diff.data,
    width,
    height,
    {threshold: 0.01}
  );
  const diffStr = `data:image/png;base64,${PNG.sync
    .write(diff)
    .toString('base64')}`;
  return {delta, diffStr};
}

/**
 * Create a deep copy of an object. This use the hacky and slow json serialization for copy.
 */
export const shamefulDeepCopy = obj => JSON.parse(JSON.stringify(obj));

/**
 * A lot of the example from gh-pages make use of the data/DATASET shorthand
 * from the vega-editor, this santization step adds that functionality
 */
export function sanitizeDatasetReference(spec) {
  if (!spec.data || !spec.data.url) {
    return spec;
  }
  if (spec.data.url.startsWith('./gh-specs/data')) {
    const copy = shamefulDeepCopy(spec);
    copy.data.url = `.${copy.data.url}`;
    return copy;
  }
  if (spec.data.url.startsWith('data/')) {
    const copy = shamefulDeepCopy(spec);
    copy.data.url = `../example-specs/${copy.data.url}`;
    return copy;
  }
  return spec;
}

export function filterForAggregates(name) {
  // 1. identify relevant axes
  // 2. check those axes for aggregates
  return (spec, data, view) => {
    const encodingField = spec.encoding && spec.encoding[name];
    const agg = encodingField && encodingField.aggregate;
    return !(!encodingField || !agg || agg === 'count');
  };
}

// this configuration blob was extracted from vega-lite
// it doesn't really do anything for us, other than enable us to use the extract transform
const DEFAULT_SPACING = 20;
const SELECTION_ID = '_vgsid_';
const vegaLiteDefaultConfig = {
  padding: 5,
  timeFormat: '%b %d, %Y',
  countTitle: 'Count of Records',

  invalidValues: 'filter',

  view: {
    width: 200,
    height: 200
  },

  mark: {
    color: '#4c78a8',
    tooltip: {content: 'encoding'}
  },
  area: {},
  bar: {
    binSpacing: 1,
    continuousBandSize: 5
  },
  circle: {},
  geoshape: {},
  line: {},
  point: {},
  rect: {
    binSpacing: 0,
    continuousBandSize: 5
  },
  // Need this to override default color in mark config
  rule: {color: 'black'},
  square: {},
  // Need this to override default color in mark config
  text: {color: 'black'},
  tick: {
    thickness: 1
  },
  trail: {},

  boxplot: {
    size: 14,
    extent: 1.5,
    box: {},
    median: {color: 'white'},
    outliers: {},
    rule: {},
    ticks: null
  },

  errorbar: {
    center: 'mean',
    rule: true,
    ticks: false
  },

  errorband: {
    band: {
      opacity: 0.3
    },
    borders: false
  },

  scale: {
    textXRangeStep: 90,
    rangeStep: 20,
    pointPadding: 0.5,

    barBandPaddingInner: 0.1,
    rectBandPaddingInner: 0,

    minBandSize: 2,

    minFontSize: 8,
    maxFontSize: 40,

    minOpacity: 0.3,
    maxOpacity: 0.8,

    // FIXME: revise if these *can* become ratios of rangeStep
    // Point size is area. For square point, 9 = 3 pixel ^ 2, not too small!
    minSize: 9,

    minStrokeWidth: 1,
    maxStrokeWidth: 4,
    quantileCount: 4,
    quantizeCount: 4
  },

  projection: {},

  axis: {},
  axisX: {},
  axisY: {},
  axisLeft: {},
  axisRight: {},
  axisTop: {},
  axisBottom: {},
  axisBand: {},
  legend: {
    gradientHorizontalMaxLength: 200,
    gradientHorizontalMinLength: 100,
    gradientVerticalMaxLength: 200,
    // This is the Vega's minimum.
    gradientVerticalMinLength: 64
  },
  header: {titlePadding: 10, labelPadding: 10},
  headerColumn: {},
  headerRow: {},
  headerFacet: {},

  selection: {
    single: {
      on: 'click',
      fields: [SELECTION_ID],
      resolve: 'global',
      empty: 'all',
      clear: 'dblclick'
    },
    multi: {
      on: 'click',
      fields: [SELECTION_ID],
      toggle: 'event.shiftKey',
      resolve: 'global',
      empty: 'all',
      clear: 'dblclick'
    },
    interval: {
      on: '[mousedown, window:mouseup] > window:mousemove!',
      encodings: ['x', 'y'],
      translate: '[mousedown, window:mouseup] > window:mousemove!',
      zoom: 'wheel!',
      mark: {fill: '#333', fillOpacity: 0.125, stroke: 'white'},
      resolve: 'global',
      clear: 'dblclick'
    }
  },
  style: {},

  title: {},

  facet: {spacing: DEFAULT_SPACING},
  repeat: {spacing: DEFAULT_SPACING},
  concat: {spacing: DEFAULT_SPACING}
};

export const extractTransforms = spec =>
  vegaLiteExtractTransforms(spec, vegaLiteDefaultConfig);

const bannedTopLevelOperations = [
  'concat',
  'facet',
  'hconcat',
  'layer',
  'repeat',
  'vconcat'
];
export function checkIfSpecIsSupported(spec) {
  if (bannedTopLevelOperations.some(d => spec[d])) {
    return false;
  }

  if (!spec.data || !(spec.data.url || spec.data.values)) {
    return false;
  }

  if (
    spec.encoding &&
    (spec.encoding.row || spec.encoding.column || spec.encoding.facet)
  ) {
    return false;
  }

  return true;
}

function groupByPointerCreation(data, groupbyKey) {
  const backwardGroupBy = data.reduce((acc, row, idx) => {
    const key = row[groupbyKey];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push({row, idx});
    return acc;
  }, {});

  return Object.entries(backwardGroupBy).reduce(
    (acc, [outputKey, groupedRows]) => {
      groupedRows.forEach(({idx}) => {
        acc[idx] = outputKey;
      });
      return acc;
    },
    {}
  );
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
  if (!transform.length || !tree._targets || tree._targets.length === 0) {
    return [];
  }
  const relevantTarget = tree._targets[0];
  const thisTransform = transform[0];
  const data = Array.isArray(tree.value) ? tree.value : null;
  return [
    {transform: thisTransform, data, transformFunction: tree._argval}
  ].concat(provenencePass(relevantTarget, transform.slice(1)));
}

// almost certainly misseplling prov
function constructTransformProvenecePath(dataset, spec, view) {
  const specDecoratedWithTransforms = extractTransforms(spec);
  const transforms = [{type: 'identity'}].concat(
    specDecoratedWithTransforms.transform
  );
  const linearizedProvPath = provenencePass(
    view._runtime.data.source_0.input,
    transforms
  );
  // forward pass, ensure each transform step has data
  for (let i = 0; i < linearizedProvPath.length; i++) {
    if (!linearizedProvPath[i].data && i > 0) {
      linearizedProvPath[i].data = linearizedProvPath[i - 1].data;
    }
  }
  // backward pass, infer prov maps
  for (let i = linearizedProvPath.length - 1; i > 0; i--) {
    const transform = linearizedProvPath[i];
    const upstreamTransform = linearizedProvPath[i - 1];
    // aggregate operator
    if (transform.transform.groupby) {
      // now find each of the values in the current transform value
      // use groupByRelations to create the relavant prov map.
      transform.provMap = groupByPointerCreation(
        upstreamTransform.data,
        transform.transform.groupby[0]
      );
    } else {
      // if not groupby then use identity map
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
  const tailToStartMap = Object.entries(startToTailMap).reduce(
    (acc, [start, tail]) => {
      if (!acc[tail]) {
        acc[tail] = [];
      }
      // setting number here maybe be wrong
      acc[tail].push(Number(start));
      return acc;
    },
    {}
  );
  return {startToTailMap, tailToStartMap};
}

const oppositeFiled = {x: 'y', y: 'x'};
export function prepProv(dataset, spec, view, name) {
  const {tailToStartMap} = constructTransformProvenecePath(dataset, spec, view);
  const extractedSpec = extractTransforms(spec);
  const inputFieldName = spec.encoding[name].field;
  const outputFieldName = extractedSpec.encoding[name].field;
  const aggregateFieldName = extractedSpec.encoding[oppositeFiled[name]].field;
  // 1. for each record at tail of path, get aggregate value
  // 2. find each stop stream record id
  // 3. set aggregate value (field y some of the time) to be the downstream value
  const initialOutput = view._runtime.data.source_0.output;
  const isCollect = initialOutput.constructor.name === 'Collect';
  const targetOutput = isCollect ? initialOutput : initialOutput.source;
  const outputValues = Array.isArray(targetOutput.value)
    ? targetOutput.value
    : view._runtime.data.marks.input.value.map(d => d.datum);
  const aggregateOutputPairs = outputValues.reduce((acc, row) => {
    acc[row[aggregateFieldName]] = row[outputFieldName];
    return acc;
  }, {});
  return {aggregateOutputPairs, tailToStartMap, inputFieldName};
}
