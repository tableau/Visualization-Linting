import React from 'react';
import {classnames} from '../utils';
export default class LintCard extends React.Component {
  constructor() {
    super();
    this.state = {
      open: true
    };
  }
  componentDidMount() {
    this.drawUpdates(this.props, this.state);
  }

  componentDidUpdate(props, state) {
    this.drawUpdates(this.props, this.state);
  }

  drawUpdates(props, state) {
    const {open} = state;
    const {failedRender} = props;
    // paint the failed pngs to canvases
    if (!failedRender || !open) {
      return;
    }
    const {
      render: {dims, data},
      type
    } = failedRender;
    const domElement = this.refs[type === 'svg' ? 'svgTarget' : 'canvasTarget'];
    if (!domElement) {
      return;
    }
    if (type === 'raster') {
      const ctx = domElement.getContext('2d');
      const image = new Image();
      image.src = data;
      image.onload = () =>
        ctx.drawImage(image, 0, 0, dims.width / 2, dims.height / 2);
    }
    if (type === 'svg') {
      const svg = domElement.querySelector('svg');
      if (svg) {
        svg.setAttribute('width', dims.width);
        svg.setAttribute('height', dims.height);
      }
    }
    // todo add error states
  }
  render() {
    const {open} = this.state;
    const {name, passed, failedRender, explain} = this.props;
    if (!name) {
      return;
    }
    return (
      <div
        onClick={() => {
          this.setState({open: !open});
        }}
        className={classnames({
          'flex-down': true,
          'lint-pass': passed,
          'lint-fail': !passed,
          'lint-warn': false,
          'lint-card': true
        })}
      >
        <div className="card-head">
          <div className="card-title">{`${name} ${
            !isNaN(passed) ? passed : ''
          }`}</div>
        </div>
        {open && (
          <div className="card-body">
            <div className="z-1 flex padding-20">
              {failedRender && (
                <div className="align-center text-align-center flex-down">
                  <div className="white-background">
                    {failedRender.type === 'raster' && (
                      <canvas
                        width={failedRender.render.dims.width / 2}
                        height={failedRender.render.dims.height / 2}
                        ref="canvasTarget"
                      />
                    )}
                    {failedRender.type === 'svg' && (
                      <div
                        ref="svgTarget"
                        dangerouslySetInnerHTML={{
                          __html: failedRender.render.data
                        }}
                      />
                    )}
                  </div>
                  <div>Difference between original and altered version</div>
                </div>
              )}
              <div className="flex-down">
                <div className="lint-explain">{explain}</div>
                <div className="lint-button">
                  This result is wrong, ignore it for now
                </div>
                <div className="lint-button">
                  This rule doesn’t apply to this chart
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
