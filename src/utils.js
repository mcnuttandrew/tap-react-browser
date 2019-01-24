import {COMMENT_STRING} from './constants';

export function classnames(classObject) {
  return Object.keys(classObject).filter(name => classObject[name]).join(' ');
}

// this function takes a single test,
// which can either be an object containing a key pointing to a test function
// or a single test function
export function testPromisify(oneTest, i) {
  return harness => new Promise((resolve, reject) => {
    harness(oneTest.name || '(anonymous)', t => {
      const wrapperT = Object.assign({}, t);
      wrapperT.comment = comment => t.equal(comment, comment, COMMENT_STRING);
      wrapperT.end = () => {
        resolve();
        t.end();
      };
      try {
        (oneTest.test || oneTest)(wrapperT);
      } catch (e) {
        reject(e);
      }
    });
  });
}

// this function takes in a list of functions or objects containing functions
// (the later being of the form {name, test}) and runs them through testPromisify
// then promise chains those promises together
export function executePromisesInSequence(tests, harness, errorCallback) {
  tests.map(testPromisify)
    .reduce((cur, next) => {
      return cur.then(next(harness).catch(errorCallback));
    }, Promise.resolve());
}

export function countPassFail(tests) {
  let success = 0;
  let total = 0;
  // group all of the tests into their appropriate sections, while counting the results
  const sections = tests.reduce((acc, tapLine) => {
    const {type, ok, test, id} = tapLine;
    const testSectionId = (type === 'assert' || type === 'end') ? test : id;
    if (!acc[testSectionId]) {
      acc[testSectionId] = [];
    }
    acc[testSectionId] = (acc[testSectionId] || []).concat(tapLine);
    if (type === 'assert') {
      success += (ok ? 1 : 0);
      total += 1;
    }
    return acc;
  }, {});
  return {success, total, sections};
}
