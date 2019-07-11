import ReactDOM from 'react-dom';
import React from 'react';
import debounce from 'lodash.debounce';
import './main.css';

// it appears that no-unused-vars has a bug :( TODO AMC to report
/* eslint-disable no-unused-vars */
import ChartPreview from './components/chart-preview';
import ControlHeader from './components/control-header';
import CodeEditor from './components/code-editor';
import LogoHeader from './components/logo-header';
import LintReport from './components/lint-report';
/* eslint-enable no-unused-vars */
import {BAD_CHARTS} from '../../test/vega-examples';

import {getRendering, lintSpec} from './utils';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      currentSpec: BAD_CHARTS[Object.keys(BAD_CHARTS)[0]],
      height: 0,
      width: 0,
      lintingTarget: null,
      lintLoading: false,
      renderLoading: false
    };
    this.setAsyncState = this.setAsyncState.bind(this);
    this.lintSpec = this.lintSpec.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', debounce(this.resize.bind(this), 50));
    this.resize();
    this.renderSpec(this.state.currentSpec);
    this.lintSpec(this.state.currentSpec);
  }

  setAsyncState(newState) {
    return new Promise((resolve) => this.setState(newState, () => resolve()));
  }

  resize() {
    const currentNode = ReactDOM.findDOMNode(this.refs.mainContainer);
    this.setState({
      height: currentNode.clientHeight,
      width: currentNode.clientWidth
    });
  }

  renderSpec(currentSpec) {
    this.setAsyncState({renderLoading: true, lintingTarget: null})
      .then(() => getRendering(currentSpec))
      .then(lintingTarget => this.setState({lintingTarget, renderLoading: false}));
  }

  lintSpec(currentSpec) {
    this.setAsyncState({lintLoading: true, lintResults: null})
      .then(() => lintSpec(currentSpec))
      .then(lintResults => this.setState({lintResults, lintLoading: false}));
  }

  render() {
    const {
      currentSpec,
      height,
      lintingTarget,
      lintLoading,
      lintResults,
      renderLoading,
      width
    } = this.state;
    return (
      <div className="flex-down full-height full-width" ref="mainContainer">
        <LogoHeader />
        <ControlHeader
          buildChart={() => this.renderSpec(currentSpec)}
          executeSpec={() => {
            this.renderSpec(currentSpec);
            this.lintSpec(currentSpec);
          }}
          changeSpec={(newValue, triggerRelint) => {
            this.setAsyncState({currentSpec: JSON.parse(newValue)})
                .then(() => {
                  this.renderSpec(this.state.currentSpec);
                  this.lintSpec(this.state.currentSpec);
                });
          }}
          currentSpec={currentSpec}/>
        <div className="flex margin-top-20 full-width">
          <CodeEditor
            height={height - 128 - 20}
            width={width / 2}
            changeSpec={newValue => this.setState({currentSpec: JSON.parse(newValue)})}
            currentSpec={currentSpec}/>
          <div className="flex-down full-width">
            <ChartPreview
              loading={renderLoading}
              lintingTarget={lintingTarget}/>
            <LintReport
              loading={lintLoading}
              lintResults={lintResults}/>
          </div>
        </div>
      </div>
    );
  }
}

const el = document.createElement('div');
el.setAttribute('class', 'full-height');
document.body.appendChild(el);

ReactDOM.render(React.createElement(App), el);
