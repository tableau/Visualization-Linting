import React from 'react';

const commonPostConfig = {
  method: 'POST',
  mode: 'cors',
  headers: {
    'Content-Type': 'application/json'
  }
};
// copy pasted from the fex stuff
const SECOND = 1000;
const sleep = delay => new Promise((resolve, reject) => setTimeout(resolve, delay));
export const fetchWithRetry = (url, basicProps) => {
  const props = {mode: 'cors', maxRetries: 12, delay: SECOND * 5, ...basicProps};
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

const genericReq = (spec, route) => fetchWithRetry(`http://localhost:5000/${route}`,
  {...commonPostConfig, body: JSON.stringify(spec)})
.then(d => d.json());
const getRendering = vegaSpec => genericReq(vegaSpec, 'get-rendering');
const lintSpec = vegaSpec => genericReq(vegaSpec, 'lint');

export default class LintContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      lintingTarget: null,
      lintResults: [],
      loading: false
    };
  }
  componentDidMount() {
    const {spec} = this.props;
    this.loadUpdates(spec);
  }

  componentWillReceiveProps({spec}) {
    this.loadUpdates(spec);
  }

  loadUpdates(spec) {
    console.log(spec)
    this.setState({loading: true});
    Promise.all([
      getRendering(spec).then(lintingTarget => this.setState({lintingTarget})),
      lintSpec(spec).then(lintResults => this.setState({lintResults}))
    ]).then(() => this.setState({loading: false}))
    // i think i need a sleep but uh
    // .then(() => new Promise((resolve, reject) => sleep(() => resolve(), 500)))
    .then(() => {
      // paint the failed pngs to canvases
      this.state.lintResults.forEach(({name, failedRender}, idx) => {
        if (!failedRender) {
          return;
        }
        const {render, type} = failedRender;
        const domElement = this.refs[`${idx}-${name}`];
        if (type === 'raster') {
          const ctx = domElement.getContext('2d');
          const image = new Image();
          image.src = render;
          image.onload = () => ctx.drawImage(image, 0, 0);
        }
        if (type === 'svg') {
          const svg = domElement.querySelector('svg');
          if (svg) {
            svg.setAttribute('width', 200);
            svg.setAttribute('height', 200);
          }
          // console.log(domElement)
        }
      });
    });
    // todo add error states
  }
  render() {
    const {
      lintingTarget,
      lintResults,
      loading
    } = this.state;
    // console.log(lintResults)
    if (loading) {
      return <div><h1>LOADING</h1></div>;
    }
    return (
      <div>
        <div>
          <h3> LINT TARGET </h3>
          {lintingTarget && <div ref="main-lint" dangerouslySetInnerHTML={{__html: lintingTarget}} />}
        </div>
        <div>
          <h3> LINT RESULTS </h3>
          {lintResults.map(({passed, name, failedRender}, idx) => {
            // TODO - madlibs - ify

            return (
              <div key={idx}>
                <div>{`${name}- ${passed ? 'passed' : 'failed'}`}</div>
                {failedRender && failedRender.type === 'raster' &&
                    <canvas width={200} height={500} ref={`${idx}-${name}`}/>}
                {failedRender && failedRender.type === 'svg' &&
                     <div ref={`${idx}-${name}`} dangerouslySetInnerHTML={{__html: lintingTarget}} />}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
