import {parse, View, loader, read} from 'vega';
import {compile} from 'vega-lite';
import pixelmatch from 'pixelmatch';
import {PNG} from 'pngjs';

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

/**
 * Get a json representation of the data specified in the spec
 */
export function getDataset(spec) {
  if (spec.data.values) {
    return Promise.resolve().then(() => spec.data.values);
  }
  const brokenUri = spec.data.url.split('.');
  const type = brokenUri[brokenUri.length - 1];
  return loader()
    .load(spec.data.url)
    .then(d => read(d, {type, parse: 'auto'}));
}

export const hasKey = (data, key) => (new Set(Object.keys(data))).has(key);
export const clone = (data) => data.map(d => ({...d}));
// check if two objects are equal to a first approx
export const shallowDeepEqual = (a, b) => Object.entries(a).every(([k, v]) => b[k] === v);

export const uniqueKeysAsBoolMap = obj => Object.keys(obj).reduce((acc, row) => {
  acc[row] = true;
  return acc;
}, {});

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
