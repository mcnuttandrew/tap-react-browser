import React, {Component} from 'react';
import tape from 'tape';

import styled from 'styled-components';
import PropTypes from 'prop-types';
import TestSection from './test-section';
import {COMMENT_STRING, KICK_OFF} from './constants';
import {classnames, executePromisesInSequence, countPassFail} from './utils';

const Title = styled.div`
  color: ${props => props.inError ? 'darkorange' : 'black'};
  font-size: 24px
`;

const StyledDot = styled.span`
  color: ${props => props.ok ? 'green' : 'red'}
`;

function getTitleMessage(success, total, done, waiting, errorMsg) {
  if (errorMsg) {
    return 'Tests crashed due to error';
  }
  if (done) {
    return `All done! ${success} / ${total} tests passed`;
  }
  return waiting ? 'Testings are waiting to run...' : 'Tests are running...';
}

class TapReactBrowser extends Component {
  constructor(props) {
    super();

    const harness = tape.createHarness();
    harness.createStream({objectMode: true})
    .on('data', row => {
      const tests = this.state.tests.concat(row);
      const endCount = this.state.endCount + (row.type && row.type === 'end' ? 1 : 0);
      const done = endCount >= this.props.tests.length;
      if (done) {
        this.props.onComplete(tests);
        this.state.resolver();
      }
      this.setState({
        tests,
        done,
        endCount
      });
    });
    // force the connection to stay open
    let resolver = () => {};
    if (props.waitForTestTrigger) {
      const innerProm = new Promise((resolve, reject) => {
        resolver = resolve;
      });
      harness(KICK_OFF, t => innerProm.then(() => t.end()));
    }

    this.state = {
      errorMsg: false,
      done: false,
      endCount: 0,
      tests: [],
      harness,
      waiting: props.waitForTestTrigger || false,
      resolver
    };
  }

  componentDidMount() {
    if (this.props.waitForTestTrigger && this.state.waiting) {
      return;
    }
    this.runTests();
  }

  runTests() {
    const {harness, errorMsg} = this.state;
    const {tests, runAsPromises} = this.props;
    if (runAsPromises) {
      const errorCallback = error => this.setState({errorMsg: error});
      executePromisesInSequence(tests, harness, errorCallback);
      return;
    }

    tests.forEach((oneTest, i) => {
      if (errorMsg) {
        return;
      }
      harness(oneTest.name || '(anonymous)', t => {
        const wrapperT = Object.assign({}, t);
        wrapperT.comment = comment => t.equal(comment, comment, COMMENT_STRING);
        try {
          (oneTest.test || oneTest)(wrapperT);
        } catch (error) {
          this.setState({errorMsg: error});
        }
      });
    });
  }

  render() {
    const {className, noSpinner, outputMode, children} = this.props;
    const {done, tests, waiting, errorMsg} = this.state;
    const {success, total, sections} = countPassFail(tests);

    const passFails = tests.reduce((acc, {ok, type}) => {
      if (type !== 'assert' || name === COMMENT_STRING) {
        return acc;
      }
      return acc.concat(ok);
    }, []);

    return (
      <div
        className={classnames({
          'tap-react-browser': true,
          'tap-react-browser--done': done,
          'tap-react-browser--testing': !done,
          'tap-react-browser--error': errorMsg,
          [className]: true
        })}>
        <Title
          inError={Boolean(errorMsg)}
          className="tap-react-browser--global-status">
          {getTitleMessage(success, total, done, waiting, errorMsg)}
        </Title>
        {Boolean(errorMsg) && <div>
          {errorMsg.toString()}
        </div>}
        {Boolean(children) && <div className="tap-react-browser--children-container"> {
          React.Children.toArray(children).map((child, key) => {
            return React.cloneElement(child, {
              ...child.props,
              triggerTest: () => {
                if (waiting) {
                  this.runTests();
                  this.state.resolver();
                }
                this.setState({waiting: false});
              },
              key
            });
          })}
        </div>}
        {outputMode === 'dot' && <div className="tap-react-browser--dots-container">{
          passFails.map((ok, i) =>
            <StyledDot ok={ok} key={`${i}-dot`}>{ok ? '.' : 'X'}</StyledDot>
          )
        }</div>}
        <div className="tap-react-browser--test-wrapper">
          {Object.values(sections).map((section, idx) =>
            <TestSection
              outputMode={outputMode}
              tapOutput={section}
              noSpinner={Boolean(errorMsg) || noSpinner}
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
  tests: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object])).isRequired,
  runAsPromises: PropTypes.bool,
  onComplete: PropTypes.func,
  className: PropTypes.string,
  noSpinner: PropTypes.bool,
  outputMode: PropTypes.oneOf(['dot', 'verbose']),
  waitForTestTrigger: PropTypes.bool
};

export default TapReactBrowser;
