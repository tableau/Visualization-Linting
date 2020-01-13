import React from 'react';
import Popover, {ArrowContainer} from 'react-tiny-popover';

export default function About(props) {
  const {toggleAbout, aboutOpen} = props;
  console.log(aboutOpen);
  return (
    <Popover
      isOpen={aboutOpen}
      position={'bottom'} // preferred position
      containerStyle={{
        zIndex: 100,
      }}
      onClickOutside={toggleAbout}
      content={({position, targetRect, popoverRect}) => (
        <ArrowContainer
          position={position}
          targetRect={targetRect}
          popoverRect={popoverRect}
          arrowColor={'black'}
          arrowSize={10}
          arrowStyle={{opacity: 0.7}}
        >
          <div
            style={{
              backgroundColor: 'black',
              opacity: 0.9,
              color: 'white',
              padding: '30px',
              maxWidth: '300px',
            }}
            onClick={toggleAbout}
          >
            This application is the software artifact associated with our paper
            found (a pre-print of which can be found{' '}
            <a href="https://arxiv.org/abs/2001.02316">here</a>
            ). You can find out more about this application at the{' '}
            <a href="https://github.com/tableau/Visualization-Linting">
              github.
            </a>
            Please be patient with the software, it was designed as research
            software and so doesn't scale on to the internet very smoothly.
          </div>
        </ArrowContainer>
      )}
    >
      <div onClick={toggleAbout} className="button">
        About
      </div>
    </Popover>
  );
}
