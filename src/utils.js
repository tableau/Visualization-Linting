import {parse, View, loader, read} from 'vega';
import {compile, extractTransforms as vegaLiteExtractTransforms} from 'vega-lite';
import pixelmatch from 'pixelmatch';
import {PNG} from 'pngjs';

export function getXYFieldNames(spec) {
  // not a sustainable version of this encoding grab:
  // what if we encounter univariate specs?
  const {transform, encoding: {x, y}} = spec;
  // later this can be abstracted probably into a getRelevantColumns op i guess
  const foldTransform = transform && transform.find(d => d.fold);
  return foldTransform ? foldTransform.fold : [x.field, y.field];
}

export const uniqueKeysAsBoolMap = obj => Object.keys(obj).reduce((acc, row) => {
  acc[row] = true;
  return acc;
}, {});

const getScaleFileds = (spec, data, view) => Object.keys(uniqueKeysAsBoolMap(view._runtime.scales)).sort();
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
export function shuffle(a, random = generateSeededRandom()) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
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
      .then(() => isSVG ? view.toSVG(2) : view.toCanvas(2))
      .then(x => resolve(isSVG ? x : x.toDataURL()))
      .catch(e => {
        /* eslint-disable no-console */
        console.error(e);
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
    return Promise.resolve().then(() => data.values);
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

export const hasKey = (data, key) => (new Set(Object.keys(data))).has(key);
export const clone = (data) => data.map(d => ({...d}));
// check if two objects are equal to a first approx
export const shallowDeepEqual = (a, b) => Object.entries(a).every(([k, v]) => b[k] === v);

/* eslint-disable */
const toBuffer = img =>
  new Buffer.from(img.replace(/^data:image\/\w+;base64,/, ''), 'base64');
/* eslint-enable */

export function buildPixelDiff(oldRendering, newRendering) {
  const img2 = PNG.sync.read(toBuffer(oldRendering));
  const img1 = PNG.sync.read(toBuffer(newRendering));
  const {width, height} = img1;
  const diff = new PNG({width, height});
  const delta = pixelmatch(
    img1.data,
    img2.data,
    diff.data,
    width,
    height,
    {threshold: 0.01});
  const diffStr = `data:image/png;base64,${PNG.sync.write(diff).toString('base64')}`;
  return {delta, diffStr};
}

/**
 * Create a deep copy of an object. This use the hacky and slow json serialization for copy.
 */
const shamefulDeepCopy = obj => JSON.parse(JSON.stringify(obj));

/**
 * A lot of the example from gh-pages make use of the data/DATASET shorthand
 * from the vega-editor, this santization step adds that functionality
 */
export function sanitizeDatasetReference(spec) {
  if (!spec.data || !spec.data.url) {
    return spec;
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

export const extractTransforms = spec => vegaLiteExtractTransforms(spec, vegaLiteDefaultConfig);

export function checkIfSpecIsSupported(spec) {
  if (spec.layer) {
    return false;
  }

  if (!spec.data || !(spec.data.url || spec.data.values)) {
    return false;
  }

  return true;
}
