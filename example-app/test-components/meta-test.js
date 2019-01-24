import React, {Component} from 'react';
import TapReactBrowser from '../../src';
import {waitForSelector} from '../test-utils';

class TestComponent extends Component {
  constructor() {
    super();
    this.state = {
      presses: 0
    };
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

// onComplete={tests => {
//   testResults.metaTriggeredTest = tests;
//   this.setState({testResults});
// }}
export default function MetaTest(props) {
  const {onCompleteCallback} = props;
  return (
    <TapReactBrowser
      className="meta-trigger-tester"
      onComplete={onCompleteCallback}
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
  );
}
