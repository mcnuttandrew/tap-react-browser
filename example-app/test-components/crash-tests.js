import React, {Component} from 'react';
import TapReactBrowser from '../../src';
import {
  syncTest1,
  syncTest2,
  crashyTest
} from '../tests/sync-tests';

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

function crashyTestHarness(sync) {
  return function crashTestBase(props) {
    const {onCompleteCallback} = props;
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
  };
}

export const CrashTestAsync = crashyTestHarness(false);
export const CrashTestSync = crashyTestHarness(true);
