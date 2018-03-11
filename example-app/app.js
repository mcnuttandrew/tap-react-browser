import ReactDOM from 'react-dom';
import React, {Component} from 'react';
import TapReactBrowser from '../TapReactBrowser';

import {testWithPromise, testWithBatchPromise} from './tests/with-promises-tests';
import {syncTest1, syncTest2} from './tests/sync-tests';

export default class ExampleApp extends Component {
  render() {
    return (
      <div>
        <h2>tap-react-browser META-TESTING APP</h2>
        {
          <TapReactBrowser
            runAsPromises
            tests={[
              {name: 'test-with-promise', test: testWithPromise},
              testWithBatchPromise
            ]} />

          // <TapReactBrowser
          //   runAsPromises
          //   tests={[
          //     syncTest1,
          //     syncTest2
          //   ]} />

        }
      </div>
    );
  }
}

const el = document.createElement('div');
document.body.appendChild(el);

ReactDOM.render(React.createElement(ExampleApp), el);
