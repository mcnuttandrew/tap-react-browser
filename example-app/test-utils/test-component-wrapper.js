import React, {Component} from 'react';
import TapReactBrowser from '../../src';

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

export default class TestComponentWrapper extends Component {
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
