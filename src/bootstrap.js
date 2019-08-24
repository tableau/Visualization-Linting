const repeat = (val, n) => [...new Array(n)].map(_ => val);
const zeros = n => repeat(0, n);

// Cribbed from
// https://github.com/vega/datalib/blob/master/src/generate.js
// modified because uw's version assumes an input of numbers rather than objects
export function bootstrap(inputData) {
  // Generates a bootstrap sample from a set of observations.
  function sample() {
    return inputData[Math.floor(Math.random() * inputData.length)];
  }
  sample.samples = function samples(numSamples) {
    return zeros(numSamples).map(sample);
  };
  return sample;
}

export function fullResample(inputData) {
  return bootstrap(inputData).samples(inputData.length);
}
