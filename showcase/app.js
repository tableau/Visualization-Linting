import ReactDOM from 'react-dom';
import React from 'react';
import LintContainer from './lint-container';
import {BAD_CHARTS} from '../test/vega-examples';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      currentSpec: Object.keys(BAD_CHARTS)[0]
    };
  }

  render() {
    const {currentSpec} = this.state;
    return (
      <div>
        <h1>VISUALIZATION LINTING TEST BED</h1>
        <select
          onChange={({target: {value}}) => this.setState({currentSpec: value})}
          value={currentSpec}>
          {Object.keys(BAD_CHARTS).map(d => <option value={d} key={d}>{d}</option>)}
        </select>
        <LintContainer spec={BAD_CHARTS[currentSpec]}/>
      </div>
    );
  }
}

const el = document.createElement('div');
document.body.appendChild(el);

ReactDOM.render(React.createElement(App), el);
