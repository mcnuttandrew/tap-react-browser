import React, {Component} from 'react';
import PropTypes from 'prop-types';

class TestHeader extends Component {
  render() {
    const {name, globalSuccess} = this.props;
    return (
      <div
        style={{fontSize: '24px', color: globalSuccess ? 'green' : 'red'}}>
        {name}
      </div>
    );
  }
}

TestHeader.propTypes = {
  globalSuccess: PropTypes.bool,
  name: PropTypes.string
};

export default TestHeader;
