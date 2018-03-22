import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled, {keyframes} from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const HeaderDiv = styled.div`
  color: ${props => !props.done ? 'black' : props.sectionSuccess ? 'green' : 'red'};
  display: flex;
  font-size: 24px;
`;

const SpinnerDiv = styled.div`
  animation: ${spin} .8s linear infinite;
  border: 6px solid #f3f3f3; /* Light grey */
  border-left: 5px solid #000; /* black */
  border-top: 5px solid #000; /* black */
  border-radius: 50%;
  height: 10px;
  width: 10px;
`;

const SpinnerWrapper = styled.div`
  align-items: center;
  display: flex;
  padding: 0 5px;
`;

class TestHeader extends Component {
  render() {
    const {name, sectionSuccess, done, noSpinner} = this.props;
    return (
      <HeaderDiv
        className="tap-react-browser--test-header"
        sectionSuccess={sectionSuccess}
        done={done}
        >
        {name}
        {!noSpinner && !done && <SpinnerWrapper className="tap-react-browser--spinner">
          <SpinnerDiv />
        </SpinnerWrapper>}
      </HeaderDiv>
    );
  }
}

TestHeader.displayName = 'TapReactBrowser-TestHeader';
TestHeader.propTypes = {
  done: PropTypes.bool,
  sectionSuccess: PropTypes.bool,
  name: PropTypes.string,
  noSpinner: PropTypes.bool
};

export default TestHeader;
