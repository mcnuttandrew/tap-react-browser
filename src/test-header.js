import React, {Component} from 'react';
import PropTypes from 'prop-types';

class TestHeader extends Component {
  render() {
    const {name, globalSuccess} = this.props;
    return (
      <div
        className="tap-react-browser--test-header"
        style={{fontSize: '24px', color: globalSuccess ? 'green' : 'red'}}>
        {name}
      </div>
    );
  }
}

TestHeader.displayName = 'TapReactBrowser-TestHeader';
TestHeader.propTypes = {
  globalSuccess: PropTypes.bool,
  name: PropTypes.string
};

export default TestHeader;
