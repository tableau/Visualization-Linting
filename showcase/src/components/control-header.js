import React from 'react';
import {BAD_CHARTS} from '../../../test/vega-examples';
/* eslint-disable no-unused-vars */
import Select from 'react-select';
import About from './about';
/* eslint-enable no-unused-vars */

// copied from https://github.com/notablemind/downloadbutton/blob/master/save-as.js
function saveAs(uri, filename) {
  const link = document.createElement('a');
  if (typeof link.download === 'string') {
    // Firefox requires the link to be in the body
    document.body.appendChild(link);
    link.download = filename;
    link.href = uri;
    link.click();
    // remove the link when done
    document.body.removeChild(link);
  } else {
    location.replace(uri);
  }
}

export default class ControlHeader extends React.Component {
  constructor() {
    super();
    this.state = {
      aboutOpen: false,
    };
  }
  render() {
    const {aboutOpen} = this.state;
    const {
      executeSpec,
      buildChart,
      changeSpec,
      cleanUpCode,
      lintingTarget,
    } = this.props;
    const toggleAbout = () => this.setState({aboutOpen: !aboutOpen});
    return (
      <div className="flex gray-background shadow z-10 header">
        <div className="select-container">
          <Select
            options={Object.entries(BAD_CHARTS).map(([label, value]) => ({
              value,
              label,
            }))}
            onChange={({label, value}) =>
              changeSpec(JSON.stringify(value, null, 2))
            }
            placeholder="TEMPLATES"
            isSearchable={false}
            value="TEMPLATES"
          />
        </div>
        <div className="flex">
          <About aboutOpen={aboutOpen} toggleAbout={toggleAbout} />
          <div onClick={cleanUpCode} className="button">
            Clean Up JSON
          </div>
          <div onClick={buildChart} className="button">
            Just Build Chart
          </div>
          <div onClick={executeSpec} className="button">
            Build and Evaluate Chart
          </div>
          {lintingTarget && (
            <div
              className="button"
              onClick={() => {
                const blob = new Blob([lintingTarget], {type: 'svg'});
                const url = URL.createObjectURL(blob);
                saveAs(url, 'vis-lint-file.svg');
              }}
              color="transparent"
              target="_blank"
              download
            >
              Download Chart
            </div>
          )}
        </div>
      </div>
    );
  }
}
