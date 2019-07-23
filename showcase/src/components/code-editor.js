import React from 'react';
/* eslint-disable no-unused-vars */
import MonacoEditor from 'react-monaco-editor';
/* eslint-enable no-unused-vars */

export default class CodeEditor extends React.Component {
  editorDidMount(editor, monaco) {
    editor.focus();
  }

  render() {
    const {
      currentCode,
      changeSpec,
      height,
      width
    } = this.props;
    const options = {
      selectOnLineNumbers: true,
      minimap: {
        enabled: false
      }
    };
    return (
      <div className="full-height full-width inline-block">
        <MonacoEditor
          width={width}
          height={height}
          language="json"
          theme="vs-light"
          value={currentCode}
          options={options}
          onChange={changeSpec}
          editorDidMount={this.editorDidMount}
        />
    </div>
    );
  }
}
