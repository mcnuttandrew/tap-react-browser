import React from 'react';
import TapReactBrowser from '../../src';
import {
  syncTest1,
  syncTest2,
  buildCommentTest
} from '../tests/sync-tests';
import {
  testWithPromise,
  testWithBatchPromise,
  classNameAndLoaderTest
} from '../tests/with-promises-tests';

export function SyncTest1(props) {
  const {onCompleteCallback} = props;
  return (
    <TapReactBrowser
      onComplete={onCompleteCallback}
      outputMode="dot"
      tests={[
        syncTest1,
        syncTest2
      ]} />
  );
}

export function SyncTest2(props) {
  const {onCompleteCallback} = props;
  return (
    <TapReactBrowser
      className="sync-test-case"
      onComplete={onCompleteCallback}
      tests={[
        buildCommentTest('.sync-test-case', 1),
        syncTest1,
        syncTest2,
        buildCommentTest('.sync-test-case', 4)
      ]} />
  );
}

export function ClassNameAndLoaderTests(props) {
  const {onCompleteCallback} = props;
  return (
    <TapReactBrowser
    onComplete={onCompleteCallback}
    className="classy-test-case"
    noSpinner
    runAsPromises
    tests={[
      buildCommentTest('.classy-test-case', 1),
      classNameAndLoaderTest,
      buildCommentTest('.classy-test-case', 3)
    ]} />
  );
}

export function PromiseTests(props) {
  const {onCompleteCallback} = props;
  return (
    <TapReactBrowser
      runAsPromises
      onComplete={onCompleteCallback}
      tests={[
        function inlinePromise(t) {
          t.equal('cool dogs with sunglasses'.split(' ').length, 4,
            'should be able to run an named inline test correctly.');
          t.end();
        },
        // anon inline test,
        t => {
          t.equal('batmang'.length, 7, 'should be able to run an anonymous inline test correctly.');
          t.end();
        },
        {name: 'test-with-promise', test: testWithPromise},
        testWithBatchPromise
      ]} />
  );
}
