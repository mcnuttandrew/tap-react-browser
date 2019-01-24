import ReactDOM from 'react-dom';
import React, {Component} from 'react';
import TapReactBrowser from '../src';
import {testExplanation, examineTestBatch} from './test-utils';
import TestComponentWrapper from './test-utils/test-component-wrapper';

import {
  testWithPromise,
  testWithBatchPromise,
  classNameAndLoaderTest
} from './tests/with-promises-tests';
import {
  syncTest1,
  syncTest2,
  buildCommentTest,
  crashyTest
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

const EXPECTED_TEST_SECTIONS = [
  {expectedFail: 0, key: 'crashTestSync'},
  {expectedFail: 0, key: 'crashTestAsync'},
  {expectedFail: 0, key: 'promiseTests'},
  {expectedFail: 1, key: 'syncTest1'},
  {expectedFail: 1, key: 'syncTest2'},
  {expectedFail: 0, key: 'classNameAndLoaderTests'},
  {expectedFail: 0, key: 'metaTriggeredTest'}
];

function testResultSection(testResults) {
  return (
    <div className="meta-test test-section">
      <h3>META TESTS</h3>
      {
        Object.keys(testResults).length === EXPECTED_TEST_SECTIONS.length && <TapReactBrowser
          runAsPromises
          onComplete={tests => {
            // put the meta test results somewhere puppeteer can pick them up
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
  );
}

class CrashyTestComponent extends Component {
  render() {
    const {sync} = this.props;
    return (
      <div style={{border: 'thin solid black'}}>
        <TapReactBrowser
          className={`${sync ? 'sync' : 'async'}-crashy-tester`}
          outputMode="dot"
          tests={[
            syncTest1,
            crashyTest,
            syncTest2
          ]} />
      </div>
    );
  }
}

function crashyTestHarness(sync, onCompleteCallback) {
  const testClass = `.${sync ? 'sync' : 'async'}-crashy-tester`;
  return (
    <TapReactBrowser
      onComplete={onCompleteCallback}
      key={sync ? 'sync' : 'async'}
      tests={[{
        name: `${sync ? 'Sync' : 'Async'} Crash Test`,
        test: t => {
          setTimeout(() => {
            const node = document.querySelector(`${testClass}.tap-react-browser--testing`);
            t.equal(node.innerText.replace(/\n/g, ''),
            'Tests crashed due to errorTypeError: t.nonExistantFunction is not a function...',
            'should find the right inner text before the button is clicked');
            const errorNodes = document.querySelectorAll(`${testClass}.tap-react-browser--error`);
            t.equal([...errorNodes].length, 1, 'should find the correct number of crashed nodes');
            t.end();
          }, 1000);
        }
      }]}>
      <CrashyTestComponent sync={sync} />
    </TapReactBrowser>
  );
}

export default class ExampleApp extends Component {
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
              [true, false].map(sync => crashyTestHarness(sync, tests => {
                testResults[sync ? 'crashTestSync' : 'crashTestAsync'] = tests;
                this.setState({testResults});
              }))
            }
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
          </div>
        </div>
      </div>
    );
  }
}

const el = document.createElement('div');
document.body.appendChild(el);

ReactDOM.render(React.createElement(ExampleApp), el);
