import React from 'react';
import {BAD_CHARTS} from '../../../test/vega-examples';
/* eslint-disable no-unused-vars */
import Select from 'react-select';
/* eslint-enable no-unused-vars */

export default class ControlHeader extends React.PureComponent {
  render() {
    const {executeSpec, buildChart, changeSpec} = this.props;
    return (<div className="flex gray-background shadow z-10 header">
      <div className="select-container">
        <Select
          options={
            Object.entries(BAD_CHARTS).map(([label, value]) => ({value, label}))
          }
          onChange={({label, value}) => changeSpec(JSON.stringify(value, null, 2))}
          placeholder="TEMPLATES"
          isSearchable={false}
          value="TEMPLATES"/>
      </div>
      <div className="flex">
        <div
          onClick={buildChart}
          className="button">Just Build Chart</div>
        <div
          onClick={executeSpec}
          className="button">Build and Evaluate Chart</div>
      </div>
    </div>);
  }
}
