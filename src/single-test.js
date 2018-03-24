import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const TestWrapper = styled.div`
  display: flex;
  alignItems: center;
`;

const NumberWrapper = styled.div`
  font-size: ${props => props.ok ? '12px' : '32px'};
  padding: 2px ${props => props.ok ? '20px' : '15px'};
  color: ${props => props.ok ? 'green' : 'red'};
`;

const OutputWrapper = styled.div`
  display: 'flex';
  flexDirection: 'column';
`;

const TestMessage = styled.span`
  color: ${props => props.ok ? 'green' : 'red'}
`;

const TestName = styled.span`
  margin-left: 20px;
  text-transform: uppercase;
`;

class SingleTest extends Component {
  render() {
    const {ok, name, expected, actual, index} = this.props;
    return (
      <TestWrapper className="tap-react-browser-single-test">
        <NumberWrapper ok={ok} className="tap-react-browser-single-test--number">
          {index}
        </NumberWrapper>
        <OutputWrapper className="tap-react-browser-single-test--test-display">
          <span>
            <TestMessage ok={ok}>{ok ? 'PASSED' : 'FAILED'}</TestMessage>
            <TestName className="tap-react-browser-single-test--message">{name}</TestName>
          </span>
          {!ok && <div
            className="tap-react-browser-single-test--expected">
            Expected: {JSON.stringify(expected, null, 2)}
          </div>}
          {!ok && <div
            className="tap-react-browser-single-test--found">
            Found: {JSON.stringify(actual, null, 2)}</div>}
        </OutputWrapper>
      </TestWrapper>);
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
