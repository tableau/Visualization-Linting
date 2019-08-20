import React from 'react';
/* eslint-disable no-unused-vars */
import LintCard from './lint-card';
/* eslint-enable no-unused-vars */

export default class LintContainer extends React.Component {
  render() {
    const {lintResults, loading, lintServiceError} = this.props;
    if (lintServiceError) {
      return (
        <div>
          <h1>{JSON.stringify(lintServiceError)}</h1>
        </div>
      );
    }
    if (loading) {
      return (
        <div>
          <h1>LOADING</h1>
        </div>
      );
    }
    if (!lintResults) {
      return (
        <div>
          <h1>NO LINT RESULTS, EXECUTE TO VIEW</h1>
        </div>
      );
    }
    return (
      <div className="flex-down full-height overflow-y">
        {lintResults.map((cardProps, idx) => {
          return (
            <LintCard key={`card-${idx}-${cardProps.name}`} {...cardProps} />
          );
        })}
      </div>
    );
  }
}
