import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import SingleTest from './single-test';
import TestHeader from './test-header';
import {COMMENT_STRING, KICK_OFF} from './constants';

const Comment = styled.div`
  padding: 2px 20px;
  padding-left: 48px;
`;

class TestSection extends Component {
  render() {
    const {tapOutput, noSpinner, outputMode} = this.props;
    const {success, total, done} = tapOutput.reduce((acc, {type, ok, test, name}) => {
      if (type === 'end') {
        acc.done = true;
      }
      if (type !== 'assert' || name === COMMENT_STRING) {
        return acc;
      }
      return {
        done: acc.done,
        success: acc.success + (ok ? 1 : 0),
        total: acc.total + 1
      };
    }, {success: 0, total: 0, done: false});
    let counter = -1;
    return (
      <div className="tap-react-browser--global-section">
        {tapOutput.map((tapLine, index) => {
          if (tapLine.type === 'test') {
            if (outputMode === 'dot') {
              return <div key={`${tapLine.id}-${index}-anon`} />;
            }
            // used to ignore the filler test that holds open long wait for tests
            if (tapLine.name === KICK_OFF) {
              return <div key={`${index}-!!!!`} />;
            }
            return (
              <TestHeader
                noSpinner={noSpinner}
                key={`header-${tapLine.id}`}
                sectionSuccess={success === total}
                done={done}
                name={tapLine.name}/>);
          }
          if (tapLine.name === COMMENT_STRING) {
            if (outputMode === 'dot') {
              return <div key={`${tapLine.id}-${index}-anon`} />;
            }
            return (
              <Comment
                className="tap-react-browser-single-comment"
                key={`${tapLine.id}-${index}-comment`}>
                {tapLine.expected}
              </Comment>
            );
          }
          if (tapLine.type !== 'assert') {
            return <div key={`${tapLine.id}-${index}-anon`}/>;
          }
          // here we use a counter because we want to ignore comments in our count
          counter++;
          if (outputMode !== 'verbose' && tapLine.ok) {
            return <div key={`${tapLine.id}-${index}-skip`}/>;
          }
          return <SingleTest {...tapLine} index={counter} key={`${tapLine.id}-${index}`}/>;
        })}
      </div>
    );

  }
}

TestSection.displayName = 'TapReactBrowser-TestSection';
TestSection.propTypes = {
  tapOutput: PropTypes.arrayOf(PropTypes.object),
  noSpinner: PropTypes.bool,
  outputMode: PropTypes.string.isRequired
};

export default TestSection;
