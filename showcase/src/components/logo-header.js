import React from 'react';

export default class LogoHeader extends React.Component {
  render() {
    return (<div className="flex black-background shadow z-100 header">
      <h3>
        <span className="bold">Metamorphic VegaLite Analyzer</span>
      </h3>
      <div>
        <img className="logo"
          src="./assets/logo_deaffiliated.png" />
      </div>
    </div>);
  }
}
