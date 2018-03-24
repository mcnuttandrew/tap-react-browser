import React, {Component} from 'react';
import tape from 'tape';

import styled from 'styled-components';
import PropTypes from 'prop-types';
import TestSection from './test-section';
import {COMMENT_STRING} from './constants';

// this function takes a single test,
// which can either be an object containing a key pointing to a test function
// or a single test function
function testPromisify(oneTest, i) {
  return harness => new Promise((resolve, reject) => {
    harness(oneTest.name || '(anonymous)', t => {
      const wrapperT = Object.assign({}, t);
      wrapperT.comment = comment => t.equal(comment, comment, COMMENT_STRING);
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

const Title = styled.div`
 font-size: 24px
`;

const StyledDot = styled.span`
  color: ${props => props.ok ? 'green' : 'red'}
`;

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

    tests.forEach((oneTest, i) => harness(oneTest.name || '(anonymous)', t => {
      const wrapperT = Object.assign({}, t);
      wrapperT.comment = comment => t.equal(comment, comment, COMMENT_STRING);
      (oneTest.test || oneTest)(wrapperT);
    }));
  }

  render() {
    const {className, noSpinner, outputMode} = this.props;
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

    const passFails = tests.reduce((acc, {ok, type}) => {
      if (type !== 'assert' || name === COMMENT_STRING) {
        return acc;
      }
      return acc.concat(ok);
    }, []);

    return (
      <div className={`tap-react-browser tap-react-browser--${done ? 'done' : 'testing'} ${className}`}>
        <Title
          className="tap-react-browser--global-status">
          {done ? `All done! ${success} / ${total} tests passed` : 'Tests are running...'}
        </Title>
        {outputMode === 'dot' && <div>{
          passFails.map(ok => <StyledDot ok={ok}>{ok ? '.' : 'X'}</StyledDot>)
        }</div>}
        <div className="tap-react-browser--test-wrapper">
          {Object.keys(sections).map((section, idx) =>
            <TestSection
              outputMode={outputMode}
              tapOutput={sections[section]}
              noSpinner={noSpinner}
              key={`sestion-${idx}`}/>
          )}
        </div>
      </div>
    );
  }
}

TapReactBrowser.displayName = 'TapReactBrowser';
TapReactBrowser.defaultProps = {
  onComplete: () => {},
  className: '',
  outputMode: 'verbose'
};
TapReactBrowser.propTypes = {
  // TODO does PropTypes have a promise type
  tests: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object])).isRequired,
  runAsPromises: PropTypes.bool,
  onComplete: PropTypes.func,
  className: PropTypes.string,
  noSpinner: PropTypes.bool,
  outputMode: PropTypes.oneOf(['dor', 'verbose'])
};

export default TapReactBrowser;
