import ReactDOM from 'react-dom';
import React, {Component} from 'react';
import TapReactBrowser from '../src';
import {testExplanation, examineTestBatch} from './test-utils';

import {
  testWithPromise,
  testWithBatchPromise,
  classNameAndLoaderTest
} from './tests/with-promises-tests';
import {
  syncTest1,
  syncTest2
} from './tests/sync-tests';

const NUMBER_OF_TESTS_TO_CHECK = 4;

export default class ExampleApp extends Component {
  state = {
    testResults: {}
  }

  render() {
    const {testResults} = this.state;
    return (
      <div>
        <h1>tap-react-browser META-TESTING APP</h1>
        <div style={{maxWidth: '600px'}}>
          {testExplanation}
        </div>
        <div className="meta-test">
          {
            Object.keys(testResults).length === NUMBER_OF_TESTS_TO_CHECK && <TapReactBrowser
              runAsPromises
              onComplete={tests => {
                // put the meta test results somewhere puppet can pick them up
                document.TapReactBrowserTestResults = tests;
              }}
              tests={[
                {
                  name: 'meta test, this test runs after all the other tests',
                  test: t => {
                    const promiseTestResults = examineTestBatch(testResults.promiseTests);
                    t.equal(promiseTestResults.passed, promiseTestResults.total,
                       'all promise tests should pass');
                    const syncTest1Results = examineTestBatch(testResults.syncTest1);
                    t.equal(syncTest1Results.passed + 1, syncTest1Results.total,
                      'one of the sync test should have failed');
                    const syncTest2Results = examineTestBatch(testResults.syncTest2);
                    t.equal(syncTest2Results.passed + 1, syncTest2Results.total,
                      'one of the sync test should have failed');
                    const loaderResults = examineTestBatch(testResults.classNameAndLoaderTests);
                    t.equal(loaderResults.passed, loaderResults.total,
                      'class and loader tests should pass correctly');
                    t.end();
                  }
                }
              ]} />
          }
        </div>
        <div style={{display: 'flex'}} className="main-tests">
          {
            <TapReactBrowser
              runAsPromises
              onComplete={tests => {
                testResults.promiseTests = tests;
                this.setState({testResults});
              }}
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
            onComplete={tests => {
              testResults.syncTest1 = tests;
              this.setState({testResults});
            }}
            tests={[
              syncTest1,
              syncTest2
            ]} />

          <TapReactBrowser
            onComplete={tests => {
              testResults.syncTest2 = tests;
              this.setState({testResults});
            }}
            tests={[
              syncTest1,
              syncTest2
            ]} />

          <TapReactBrowser
            onComplete={tests => {
              testResults.classNameAndLoaderTests = tests;
              this.setState({testResults});
            }}
            className="classy-test-case"
            noSpinner
            runAsPromises
            tests={[classNameAndLoaderTest]} />
        </div>
      </div>
    );
  }
}

const el = document.createElement('div');
document.body.appendChild(el);

ReactDOM.render(React.createElement(ExampleApp), el);
