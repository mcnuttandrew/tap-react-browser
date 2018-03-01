import React, {Component} from 'react';
import test from 'tape';

import PropTypes from 'prop-types';
import SingleTest from './single-test';
import TestHeader from './test-header';

class PromiseEndTest extends test {
  constructor(t, resolve, reject, ...args) {
    super(t, args);
    this.resolve = resolve;
    this.reject = reject;
  }

  end() {
    console.log('end??')
    this.resolve();
    super.test();
  }
}

function testPromisify(oneTest) {
  return new Promise((resolve, reject) => {
    const testPromise = new PromiseEndTest(oneTest, resolve, reject);
    // console.log(testPromise)
    // testPromise(oneTest);
    // test(t => {
    //   console.log(t)
    //   const wrapperT = Object.assign({}, t);
    //   console.log(wrapperT)
    //   wrapperT.end = () => {
    //     resolve();
    //     t.end();
    //   };
    //   wrapperT(oneTest);
    // });
  });
}

function buildFunctionChain(tests) {
  if (tests.length <= 1) {
    return testPromisify(tests[0]);
  }

  return buildFunctionChain(tests.slice(0, test.length - 1))
    .then(() => {
      console.log('??', tests.length)
      // console.log
      testPromisify(tests[test.length - 1])
    });
}

class TapReactBrowser extends Component {
  state = {
    done: false,
    tests: []
  }
  componentWillMount() {
    test.createStream({objectMode: true}).on('data', (row) => {
      const isDone = row.type && row.type === 'end';
      // const catchEnd = x =>
      console.log(row)
      this.setState({
        tests: this.state.tests.concat(row),
        done: isDone,

      });
    });
  }

  componentDidMount() {
    // const {tests} = this.props;
    buildFunctionChain(this.props.tests);
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
        return acc.concat(<TestHeader globalSuccess={success === total} name={singletest.name}/>);
      }
      if (singletest.type !== 'assert') {
        return acc;
      }
      return acc.concat(<SingleTest {...singletest} index={index} />);
    }, []);
    return (
      <div>
        <div style={{fontSize: '24px'}}>
          {done ? `All done! ${success} / ${total} tests passed` : 'Tests are running...'}
        </div>
        <div>{testOutput}</div>
      </div>
    );
  }
}

TapReactBrowser.propTypes = {
  // TODO does PropTypes have a promise type
  tests: PropTypes.arrayOf(PropTypes.func),
  runAsPromises: PropTypes.bool
};

export default TapReactBrowser;
