import React, {Component} from 'react';
import tape from 'tape';

import PropTypes from 'prop-types';
import TestSection from './test-section';

function testPromisify(oneTest) {
  return new Promise((resolve, reject) => {
    tape(oneTest.name || '(anonymous)', t => {
      const wrapperT = Object.assign({}, t);
      wrapperT.end = () => {
        resolve();
        t.end();
      };
      (oneTest.test || oneTest)(wrapperT);
    });
  });
}

// this function takes in a list of functions or objects containing functions
// (the later being of the form {name, test}) and runs them through testPromisify
// which runs them through tape while wrapping them in promises
function buildFunctionChain(tests) {
  if (tests.length <= 1) {
    return testPromisify(tests[0]);
  }

  return buildFunctionChain(tests.slice(0, tests.length - 1))
    .then(() => testPromisify(tests[tests.length - 1]));
}

class TapReactBrowser extends Component {
  state = {
    // TODO add error stat
    done: false,
    tests: []
  }
  componentWillMount() {
    tape.createStream({objectMode: true}).on('data', row => {
      const done = row.type && row.type === 'end';
      this.setState({
        tests: this.state.tests.concat(row),
        done
      });
    });
  }

  componentDidMount() {
    const {tests, runAsPromises} = this.props;
    if (runAsPromises) {
      buildFunctionChain(tests);
      return;
    }
    tests.forEach(oneTest =>
      tape(oneTest.name || '(anonymous)', oneTest.test || oneTest)
    );
  }

  render() {
    const {done, tests} = this.state;
    let success = 0;
    let total = 0;
    // group all of the tests into their appropriate sections, while counting the results
    const sections = tests.reduce((acc, tapLine) => {
      const {type, ok, test, id} = tapLine;
      const testSectionId = (type === 'assert' || type === 'end') ? test : id;
      if (!acc[testSectionId]) {
        acc[testSectionId] = [];
      }
      acc[testSectionId] = (acc[testSectionId] || []).concat(tapLine);
      if (type === 'assert') {
        success += (ok ? 1 : 0);
        total += 1;
      }
      return acc;
    }, {});

    return (
      <div className="tap-react-browser">
        <div
          className="tap-react-browser--global-status"
          style={{fontSize: '24px'}}>
          {done ? `All done! ${success} / ${total} tests passed` : 'Tests are running...'}
        </div>
        <div className="tap-react-browser--test-wrapper">
          {Object.keys(sections).map(section => <TestSection tapOutput={sections[section]}/>)}
        </div>
      </div>
    );
  }
}

TapReactBrowser.displayName = 'TapReactBrowser';
TapReactBrowser.propTypes = {
  // TODO does PropTypes have a promise type
  tests: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object])),
  runAsPromises: PropTypes.bool
};

export default TapReactBrowser;
