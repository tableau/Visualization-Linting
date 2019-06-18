import ReactDOM from 'react-dom';
import React from 'react';

function App() {
  return (
    <div>
      <h1>VISUALIZATION LINTING TEST BED</h1>
      <div>
        <h1>HELLO!</h1>
      </div>
    </div>
  );
}

const el = document.createElement('div');
document.body.appendChild(el);

ReactDOM.render(React.createElement(App), el);
