import React from 'react';
export default class ChartPreview extends React.PureComponent {
  render() {
    const {
      chartError,
      lintingTarget,
      loading
    } = this.props;
    if (chartError) {
      return <div><h1>{JSON.stringify(chartError)}</h1></div>;
    }
    if (loading) {
      return <div><h1>LOADING</h1></div>;
    }
    if (!lintingTarget) {
      return <div><h1>ERROR</h1></div>;
    }
    return (<div ref="main-lint"
      dangerouslySetInnerHTML={{__html: lintingTarget}} />);
  }
}
