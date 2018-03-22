import React, {Component} from 'react';
import PropTypes from 'prop-types';
import SingleTest from './single-test';
import TestHeader from './test-header';

class TestSection extends Component {
  render() {
    const {tapOutput, noSpinner} = this.props;
    const {success, total, done} = tapOutput.reduce((acc, {type, ok, test}) => {
      if (type === 'end') {
        acc.done = true;
      }
      if (type !== 'assert') {
        return acc;
      }
      return {
        done: acc.done,
        success: acc.success + (ok ? 1 : 0),
        total: acc.total + 1
      };
    }, {success: 0, total: 0, done: false});

    return (
      <div className="tap-react-browser--global-status">
        {tapOutput.map((tapLine, index) => {
          if (tapLine.type === 'test') {
            return (
              <TestHeader
                noSpinner={noSpinner}
                key={`header-${tapLine.id}`}
                sectionSuccess={success === total}
                done={done}
                name={tapLine.name}/>);
          }
          if (tapLine.type !== 'assert') {
            return <div key={`${tapLine.id}-${index}-anon`}/>;
          }
          return <SingleTest {...tapLine} index={tapLine.id} key={`${tapLine.id}-${index}`}/>;
        })}
      </div>
    );

  }
}

TestSection.displayName = 'TapReactBrowser-TestSection';
TestSection.propTypes = {
  tapOutput: PropTypes.arrayOf(PropTypes.object),
  noSpinner: PropTypes.bool
};

export default TestSection;
