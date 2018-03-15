import React, {Component} from 'react';
import tape from 'tape';

import PropTypes from 'prop-types';
import TestSection from './test-section';

// this function takes a single test,
// which can either be an object containing a key pointing to a test function
// or a single test function
function testPromisify(oneTest) {
  return harness => new Promise((resolve, reject) => {
    harness(oneTest.name || '(anonymous)', t => {
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
// then promise chains those promises together
function executePromisesInSequence(tests, harness) {
  tests.map(testPromisify).reduce((cur, next) => cur.then(next(harness)), Promise.resolve());
}

class TapReactBrowser extends Component {
  state = {
    // TODO add error stat
    done: false,
    endCount: 0,
    tests: [],
    harness: tape.createHarness()
  }
  componentWillMount() {
    this.state.harness.createStream({objectMode: true}).on('data', row => {
      const tests = this.state.tests.concat(row);
      const endCount = this.state.endCount + (row.type && row.type === 'end' ? 1 : 0);
      const done = endCount === this.props.tests.length;
      if (done) {
        this.props.onComplete(tests);
      }
      this.setState({
        tests,
        done,
        endCount
      });
    });
  }

  componentDidMount() {
    const {harness} = this.state;
    const {tests, runAsPromises} = this.props;
    if (runAsPromises) {
      executePromisesInSequence(tests, harness);
      return;
    }
    tests.forEach(oneTest => harness(oneTest.name || '(anonymous)', oneTest.test || oneTest));
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
    // console.log(tests)
    return (
      <div className={`tap-react-browser tap-react-browser--${done ? 'done' : 'testing'}`}>
        <div
          className="tap-react-browser--global-status"
          style={{fontSize: '24px'}}>
          {done ? `All done! ${success} / ${total} tests passed` : 'Tests are running...'}
        </div>
        <div className="tap-react-browser--test-wrapper">
          {Object.keys(sections).map((section, idx) =>
            <TestSection tapOutput={sections[section]} key={`sestion-${idx}`}/>
          )}
        </div>
      </div>
    );
  }
}

TapReactBrowser.displayName = 'TapReactBrowser';
TapReactBrowser.defaultProps = {
  onComplete: () => {}
};
TapReactBrowser.propTypes = {
  // TODO does PropTypes have a promise type
  tests: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object])).isRequired,
  runAsPromises: PropTypes.bool,
  onComplete: PropTypes.func
};

export default TapReactBrowser;
