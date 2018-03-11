import React, {Component} from 'react';
import tape from 'tape';

import PropTypes from 'prop-types';
import SingleTest from './single-test';
import TestHeader from './test-header';

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
    tests.forEach(oneTest => tape(oneTest));
  }

  render() {
    const {done, tests} = this.state;
    const {success, total} = tests.reduce((acc, {type, ok}) => {
      if (type !== 'assert') {
        return acc;
      }
      return {
        total: acc.total + 1,
        success: acc.success + (ok ? 1 : 0)
      };
    }, {success: 0, total: 0});

    const testOutput = tests.reduce((acc, singletest, index) => {
      if (singletest.type === 'test') {
        return acc.concat(
          <TestHeader
            key={`header-${index}`}
            globalSuccess={success === total}
            name={singletest.name}/>);
      }
      if (singletest.type !== 'assert') {
        return acc;
      }
      return acc.concat(<SingleTest {...singletest} index={index} key={index}/>);
    }, []);

    return (
      <div className="tap-react-browser">
        <div
          className="tap-react-browser--global-status"
          style={{fontSize: '24px'}}>
          {done ? `All done! ${success} / ${total} tests passed` : 'Tests are running...'}
        </div>
        <div className="tap-react-browser--test-wrapper">
          {testOutput}
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
