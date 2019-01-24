import ReactDOM from 'react-dom';
import React, {Component} from 'react';
import TapReactBrowser from '../src';
import {testExplanation, examineTestBatch} from './test-utils';
import MetaTest from './test-components/meta-test';
import {
  CrashTestAsync,
  CrashTestSync
} from './test-components/crash-tests';
import {
  SyncTest1,
  SyncTest2,
  ClassNameAndLoaderTests,
  PromiseTests
} from './test-components/basic-tests';

const TESTS = [
  {TestComponent: CrashTestSync, name: 'crashTestSync', expectedFail: 0},
  {TestComponent: CrashTestAsync, name: 'crashTestAsync', expectedFail: 0},
  {TestComponent: PromiseTests, name: 'promiseTests', expectedFail: 0},
  {TestComponent: SyncTest1, name: 'syncTest1', expectedFail: 1},
  {TestComponent: SyncTest2, name: 'syncTest2', expectedFail: 1},
  {TestComponent: ClassNameAndLoaderTests, name: 'classNameAndLoaderTests', expectedFail: 0},
  {TestComponent: MetaTest, name: 'metaTriggeredTest', expectedFail: 0}
];

function testResultSection(testResults) {
  const DONE_TESTING = Object.keys(testResults).length === TESTS.length;
  return (
    <div className="meta-test test-section">
      <h3>META TESTS</h3>
      {
        DONE_TESTING && <TapReactBrowser
          runAsPromises
          onComplete={tests => {
            // put the meta test results somewhere puppeteer can pick them up
            document.TapReactBrowserTestResults = tests;
          }}
          tests={[
            {
              name: 'meta test, this test runs after all the other tests',
              test: t => {
                TESTS.forEach(({expectedFail, name}) => {
                  const results = examineTestBatch(testResults[name]);
                  t.equal(results.passed + expectedFail, results.total,
                     `${name} tests should pass`);
                });
                t.end();
              }
            }
          ]} />
      }
      {!DONE_TESTING && <h4>EXAMPLE TESTS ARE RUNNING</h4>}
    </div>
  );
}

export default class MetaTestRunner extends Component {
  constructor() {
    super();
    this.state = {
      testResults: {}
    };
  }

  render() {
    const {testResults} = this.state;
    return (
      <div>
        <h1>tap-react-browser</h1>
        <h2>META-TESTING APP</h2>
        <div style={{maxWidth: '600px'}}>
          {testExplanation}
        </div>
        {testResultSection(testResults)}
        <div className="main-tests-wrapper test-section">
          <h3>EXAMPLE TESTS</h3>
          <div className="main-tests">
            {
              TESTS.map(({TestComponent, name}) => (
                <TestComponent
                  onCompleteCallback={tests => {
                    testResults[name] = tests;
                    this.setState({testResults});
                  }}
                  key={name}/>
              ))
            }
          </div>
        </div>
      </div>
    );
  }
}

const el = document.createElement('div');
document.body.appendChild(el);

ReactDOM.render(React.createElement(MetaTestRunner), el);
