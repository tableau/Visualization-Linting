import {parse, View} from 'vega';
import {compile} from 'vega-lite';

const lintRules = [{
  name: 'rescaleData',
  type: 'algebraic-ground',
  operation: d => d * 1000,
  evaluator: (oldRendering, newRendering) => {

  }
}];

export function lint(spec) {
  return Promise.all(lintRules.map(rule => evaluateLintRule(rule, spec)))
    .then(results => {
      return results;
    });
}

function evaluateLintRule(rule, spec) {
  return new Promise((resolve, reject) => {
    resolve({name: rule.name, passed: true});
  });
}

/**
 * generateVegaRendering, takes in a vega lint spec and returns an svg rendering of it
 */
function generateVegaRendering(spec) {
  return new Promise((resolve, reject) => {
    const runtime = parse(compile(spec).spec, {renderer: 'none'});
    const view = new View(runtime, {renderer: 'svg'}).initialize();
    view
      .runAsync()
      .then(() => {
        view.toSVG(2)
        .then(x => resolve(x))
        .catch(e => console.log(e));
      });
  });
}
