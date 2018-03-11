import React, {Component} from 'react';
import PropTypes from 'prop-types';

class SingleTest extends Component {
  render() {
    const {ok, name, expected, actual, index} = this.props;
    return (
      <div
          className="tap-react-browser-single-test"
          style={{display: 'flex', alignItems: 'center'}} >
        <div
          className="tap-react-browser-single-test--number"
          style={{
            fontSize: ok ? '12px' : '32px',
            padding: '15px',
            color: ok ? 'green' : 'red'}}>
          {index}
        </div>
        <div
          className="tap-react-browser-single-test--test-display"
          style={{display: 'flex', flexDirection: 'column'}}>
          <span>
            <span style={{color: ok ? 'green' : 'red'}}>{ok ? 'PASSED' : 'FAILED'}</span>
            <span
              className="tap-react-browser-single-test--message"
              style={{marginLeft: '20px', textTransform: 'uppercase'}}>{name}</span>
          </span>
          {!ok && <div
            className="tap-react-browser-single-test--expected">
            Expected: {JSON.stringify(expected, null, 2)}
          </div>}
          {!ok && <div
            className="tap-react-browser-single-test--found">
            Found: {JSON.stringify(actual, null, 2)}</div>}
        </div>
      </div>);
  }
}

SingleTest.displayName = 'TapReactBrowser-SingleTest';
SingleTest.propTypes = {
  index: PropTypes.number,
  name: PropTypes.string,
  ok: PropTypes.bool
  // these are expected but they can be anything soooooooooooo
  // expected
  // actual
};

export default SingleTest;
