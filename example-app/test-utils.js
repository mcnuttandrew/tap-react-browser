/* eslint-disable max-len */
export const testExplanation = ' This is the tap-react-browser testing app, it enables the integration and unit testing of our browser testing framework.  The main tests run, and then a meta-test is kicked off, which run assertions against the results of the previous tests.  The results from this meta-testing are then posted to the document at document.TapReactBrowserTestResults. Happy meta-testing.';
/* eslint-enable max-len */

export function examineTestBatch(testBatch) {
  return testBatch.reduce(({total, passed}, row) => {
    if (row.type !== 'assert') {
      return {total, passed};
    }
    return {
      total: total + 1,
      passed: passed + (row.ok ? 1 : 0)
    };
  }, {total: 0, passed: 0});
}
