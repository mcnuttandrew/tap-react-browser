import React, {Component} from 'react';
import PropTypes from 'prop-types';

class TestHeader extends Component {
  render() {
    const {name, sectionSuccess, done} = this.props;
    return (
      <div
        className="tap-react-browser--test-header"
        style={{
          fontSize: '24px',
          color: !done ? 'black' : sectionSuccess ? 'green' : 'red'
        }}>
        {name}
      </div>
    );
  }
}

TestHeader.displayName = 'TapReactBrowser-TestHeader';
TestHeader.propTypes = {
  done: PropTypes.bool,
  sectionSuccess: PropTypes.bool,
  name: PropTypes.string
};

export default TestHeader;
