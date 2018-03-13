import ReactDOM from 'react-dom';
import React, {Component} from 'react';
import TapReactBrowser from '../src';

import {testWithPromise, testWithBatchPromise} from './tests/with-promises-tests';
import {syncTest1, syncTest2} from './tests/sync-tests';

export default class ExampleApp extends Component {
  render() {
    return (
      <div>
        <h2>tap-react-browser META-TESTING APP</h2>
        <div style={{display: 'flex'}}>
          {
            <TapReactBrowser
              runAsPromises
              tests={[
                function inlinePromise(t) {
                  t.equal('cool dogs with sunglasses'.split(' ').length, 4,
                    'should be able to run an named inline test correctly.');
                  t.end();
                },
                // anon inline test,
                t => {
                  t.equal('batmang'.length, 7, 'should be able to run an anonymous inline test correctly.');
                  t.end();
                },
                {name: 'test-with-promise', test: testWithPromise},
                testWithBatchPromise
              ]} />

          }

          <TapReactBrowser
            runAsPromises
            tests={[
              syncTest1,
              syncTest2
            ]} />

          <TapReactBrowser
            runAsPromises
            tests={[
              syncTest1,
              syncTest2
            ]} />
        </div>
      </div>
    );
  }
}

const el = document.createElement('div');
document.body.appendChild(el);

ReactDOM.render(React.createElement(ExampleApp), el);
