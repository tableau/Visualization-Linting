import ReactDOM from 'react-dom';
import React from 'react';
import {
  COLORED_SCATTERPLOT,
  MISSING_RECORDS_BAR_CHART,
  OUTLIER_SCATTERPLOT,
  OVERPLOT_SCATTERPLOT
} from '../test/vega-examples';

const TARGET = OVERPLOT_SCATTERPLOT;
const commonPostConfig = {
  method: 'POST',
  mode: 'cors',
  headers: {
    'Content-Type': 'application/json'
  }
};
// there is a ton in common, but i think lint might change to do some fancy stuff
// todo get my fetch with retry library

const genericReq = (spec, route) => fetch(`http://localhost:5000/${route}`,
  {...commonPostConfig, body: JSON.stringify(spec)})
.then(d => d.json());
const getRendering = vegaSpec => genericReq(vegaSpec, 'get-rendering');
const lintSpec = vegaSpec => genericReq(vegaSpec, 'lint');

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      lintingTarget: null,
      lintResults: []
    };
  }
  componentDidMount() {
    getRendering(TARGET).then(lintingTarget => this.setState({lintingTarget}));
    lintSpec(TARGET).then(lintResults => this.setState({lintResults}));
  }
  render() {
    const {
      lintingTarget,
      lintResults
    } = this.state;
    return (
      <div>
        <h1>VISUALIZATION LINTING TEST BED</h1>
        <div>
          <h3> LINT TARGET </h3>
          {lintingTarget && <div dangerouslySetInnerHTML={{__html: lintingTarget}} />}
        </div>
        <div>
          <h3> LINT RESULTS </h3>
          {lintResults.map(({passed, name, failingSpec}, idx) => {
            // TODO - madlibs - ify
            return (
              <div key={idx}>
                <div>{`${name}- ${passed ? 'passed' : 'failed'}`}</div>
                {!passed && failingSpec &&
                  <div dangerouslySetInnerHTML={{__html: failingSpec}} />}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const el = document.createElement('div');
document.body.appendChild(el);

ReactDOM.render(React.createElement(App), el);
