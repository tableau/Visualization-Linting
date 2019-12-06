import {cor} from 'datalib';
const {rank, dist} = cor;
import {buildPixelDiff} from '../image-manipulation';
import DynamicTimeWarping from 'dynamic-time-warping';
/**
 * SYNTATIC SUGAR AROUND BOOL COMPARE, EASE OF READABILITY
 */
const assert = (found, expected) => found === expected;

// i can't really decide between these various modes, TODO follow up more deeply later
const evaluationModes = {
  // pure string based
  STRING_BASED: {
    expectSame: (oldRendering, newRendering) => oldRendering === newRendering,
    expectDifferent: (oldRendering, newRendering) =>
      oldRendering !== newRendering,
  },
  // sanity checkers
  SANITY_CHECKS: {
    expectSame: () => false,
    expectDifferent: () => false,
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
    },
  },
};
const selectedMode = evaluationModes.PIXEL_DIFF;
export const expectSame = selectedMode.expectSame;
export const expectDifferent = selectedMode.expectDifferent;

/**
 * Compare two arrays of numbers [1,32, 3, 4]
 */
const sameArr = (a, b) => {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
};

const heightsOrder = view => {
  return view._runtime.data.marks.input.value
    .sort((a, b) => a.x - b.x)
    .map(({x, y, y2}, idx) => ({x, y, y2, idx}))
    .sort((a, b) => a.y - b.y)
    .map(({idx}) => idx);
};

export const expectDifferentBars = (...args) =>
  compareBarOrders([...args], false);
export const expectSameBars = (...args) => compareBarOrders([...args], true);

function compareBarOrders(
  [oldRendering, newRendering, spec, perturbedSpec, oldView, newView],
  expectSameOrder,
) {
  const oldOrder = heightsOrder(oldView);
  const newOrder = heightsOrder(newView);
  const rankScore = rank(oldOrder, newOrder);
  const distScore = dist(oldOrder, newOrder);
  const binaryPass = sameArr(oldOrder, newOrder);
  // console.log(
  //   oldView._runtime.data.marks.input.value.map(x => x.datum.average_value),
  //   newView._runtime.data.marks.input.value.map(x => x.datum.average_value)
  // );
  const pass = binaryPass;
  return expectSame ? pass : !pass;
  // return assert(
  //   sameArr(heightsOrder(oldView), heightsOrder(newView)),
  //   expectSameOrder
  // );
}

const getPath = view => view._runtime.data.marks.input.value.map(({y}) => y);
export const expectDifferentLines = (...args) => compareLines([...args], false);
export const expectSameLines = (...args) => compareLines([...args], true);
function compareLines(
  [oldRendering, newRendering, spec, perturbedSpec, oldView, newView],
  expectNoChange,
) {
  const comaprePoints = (a, b) => Math.abs(a - b);
  const dtw = new DynamicTimeWarping(
    getPath(oldView),
    getPath(newView),
    comaprePoints,
  );
  // 30 is magic number drawn this demo by dtw packages author
  // https://gordonlesti.com/touch-signature-identification-with-javascript/
  return assert(dtw.getDistance() < 30, expectNoChange);
}

// This pair of functions is composed to test the evaluation work
export const expectSameBarsHack = (...args) =>
  compareBarOrdersHack([...args], true);
function compareBarOrdersHack(
  [oldRendering, newRendering, spec, perturbedSpec, oldView, newView],
  expectSameOrder,
) {
  const heights = newView._runtime.data.marks.input.value.map(({y}) => y);
  return heights[0] - heights[1];
}

export function testInstrument(spec) {
  if (spec.mark === 'bar') {
    return expectSameBarsHack;
  }
  if (spec.mark === 'line') {
    return expectSameLines;
  }
  return expectSame;
}
