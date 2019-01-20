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
  syncTest2,
  buildCommentTest
} from './tests/sync-tests';

function waitForSelector(selector) {
  return new Promise((resolve, reject) => {
    const checkExisit = setInterval(() => {
      const target = document.querySelector(selector);
      if (target) {
        clearInterval(checkExisit);
        resolve(target);
      }
    });
  });
}

class TestComponent extends Component {
  state = {
    presses: 0
  }

  render() {
    const {presses} = this.state;
    const {triggerTest} = this.props;
    return (<button className="test-component" onClick={() => {
      if (presses > -1) {
        triggerTest();
      }
      this.setState({presses: presses + 1});
    }}>
      {`COOL DOGS -> ${presses}`}
    </button>);
  }
}

class TestComponentWrapper extends Component {
  render() {
    return (<div style={{border: 'thin solid black'}}>
      <span>INNER COMPONENT</span>
      <TapReactBrowser
        waitForTestTrigger
        tests={[
          function innerTest(t) {
            t.ok(true, 'this should run after a button is pressed');
            t.end();
          }
        ]}>
        <TestComponent />
      </TapReactBrowser>
    </div>);
  }
}

const EXPECTED_TEST_SECTIONS = [
  {expectedFail: 0, key: 'promiseTests'},
  {expectedFail: 1, key: 'syncTest1'},
  {expectedFail: 1, key: 'syncTest2'},
  {expectedFail: 0, key: 'classNameAndLoaderTests'},
  {expectedFail: 0, key: 'metaTriggeredTest'}
];

export default class ExampleApp extends Component {
  state = {
    testResults: {}
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
        <div className="meta-test test-section">
          <h3>META TESTS</h3>
          {
            Object.keys(testResults).length === EXPECTED_TEST_SECTIONS.length && <TapReactBrowser
              runAsPromises
              onComplete={tests => {
                // put the meta test results somewhere puppet can pick them up
                document.TapReactBrowserTestResults = tests;
              }}
              tests={[
                {
                  name: 'meta test, this test runs after all the other tests',
                  test: t => {

                    EXPECTED_TEST_SECTIONS.forEach(({expectedFail, key}) => {
                      const results = examineTestBatch(testResults[key]);
                      t.equal(results.passed + expectedFail, results.total,
                         `${key} tests should pass`);
                    });
                    t.end();
                  }
                }
              ]} />
          }
          {
            Object.keys(testResults).length !== EXPECTED_TEST_SECTIONS.length &&
            <h4>EXAMPLE TESTS ARE RUNNING</h4>
          }
        </div>
        <div className="main-tests-wrapper test-section">
          <h3>EXAMPLE TESTS</h3>
          <div className="main-tests">
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

            <TapReactBrowser
              onComplete={tests => {
                testResults.syncTest1 = tests;
                this.setState({testResults});
              }}
              outputMode="dot"
              tests={[
                syncTest1,
                syncTest2
              ]} />

            <TapReactBrowser
              className="sync-test-case"
              onComplete={tests => {
                testResults.syncTest2 = tests;
                this.setState({testResults});
              }}
              tests={[
                buildCommentTest('.sync-test-case', 1),
                syncTest1,
                syncTest2,
                buildCommentTest('.sync-test-case', 4)
              ]} />

            <TapReactBrowser
              onComplete={tests => {
                testResults.classNameAndLoaderTests = tests;
                this.setState({testResults});
              }}
              className="classy-test-case"
              noSpinner
              runAsPromises
              tests={[
                buildCommentTest('.classy-test-case', 1),
                classNameAndLoaderTest,
                buildCommentTest('.classy-test-case', 3)
              ]} />

            <TapReactBrowser
              className="meta-trigger-tester"
              onComplete={tests => {
                testResults.metaTriggeredTest = tests;
                this.setState({testResults});
              }}
              tests={[function metaTriggeredTest(t, ref) {
                const node = document.querySelector('.meta-trigger-tester .tap-react-browser--testing');
                t.equal(node.innerText.replace(/\n/g, ''),
                  'Testings are waiting to run...COOL DOGS -> 0',
                  'should find the right inner text before the button is clicked');
                node.querySelector('button').click();
                waitForSelector('.meta-trigger-tester .tap-react-browser--done')
                .then(innerNode => {
                  /* eslint-disable max-len */
                  t.equal(
                    document.querySelector('.meta-trigger-tester .tap-react-browser--done').innerText.replace(/\n/g, ''),
                    'All done! 1 / 1 tests passedCOOL DOGS -> 1innerTest0PASSEDTHIS SHOULD RUN AFTER A BUTTON IS PRESSED',
                    'should find the correct inner text');
                  t.end();
                });
              }]}>
              <TestComponentWrapper />
            </TapReactBrowser>
          }
          </div>
        </div>
      </div>
    );
  }
}

const el = document.createElement('div');
document.body.appendChild(el);

ReactDOM.render(React.createElement(ExampleApp), el);
