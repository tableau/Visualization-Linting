const commonPostConfig = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
};
// copy pasted from the fex stuff
const SECOND = 1000;
const sleep = delay =>
  new Promise((resolve, reject) => setTimeout(resolve, delay));
export const fetchWithRetry = (url, basicProps) => {
  const props = {
    mode: 'cors',
    maxRetries: 12,
    delay: SECOND * 5,
    ...basicProps,
  };
  const {maxRetries, delay} = props;
  let currentRerties = 0;
  // recursively retry fetch with delay
  const fetcher = () =>
    fetch(url, props)
      .then(d => {
        if (d.status !== 200 && currentRerties < maxRetries) {
          currentRerties += 1;
          return sleep(delay).then(fetcher);
        }
        return d;
      })
      .catch(e => {
        currentRerties += 1;
        return sleep(delay).then(fetcher);
      });
  return fetcher();
};

const local = route => `http://localhost:5000/${route}`;
const server = route => `https://vis-lint.herokuapp.com/${route}`;
const USE_LOCAL = false;
const genericReq = (spec, route) =>
  fetch((USE_LOCAL ? local : server)(route), {
    ...commonPostConfig,
    body: JSON.stringify(spec),
  }).then(d => d && d.json());
export const getRendering = vegaSpec => genericReq(vegaSpec, 'get-rendering');
export const lintSpec = vegaSpec => genericReq(vegaSpec, 'lint');

export function classnames(classObject) {
  return Object.keys(classObject)
    .filter(name => classObject[name])
    .join(' ');
}
