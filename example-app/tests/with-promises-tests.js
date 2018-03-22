export function testWithPromise(t) {
  Promise.resolve()
    .then(() => {
      t.equal(1, 1, 'should find a initial promise resolves quickly');
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 2000);
      });
    })
    .then(() => {
      t.equal(1, 1, 'should resolve the next after a brief wait');
    })
    .catch(() => t.end())
    .then(() => t.end());
}

const getTime = () => (new Date()).getTime();
export function testWithBatchPromise(t) {
  // t.comment('wow cool tests');
  Promise.resolve()
    .then(() => {
      const startTime = getTime();
      return Promise.all([...new Array(10)].map((e, i) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            t.equal(i, i, `${i}th promise test checking in`);
            resolve(getTime() - startTime);
          }, i * 300);
        });
      }));
    })
    .then(() => new Promise((resolve, reject) => setTimeout(() => resolve(), 1000)))
    .then(results => {
      const browserTest = [].slice.call(
          document.querySelectorAll(
            '.tap-react-browser--global-status:nth-child(4) .tap-react-browser-single-test--number'))
        .reduce((acc, node) => {
          if (!acc.inOrder) {
            return false;
          }
          const newNum = Number(node.textContent);
          return {
            prevNum: newNum,
            inOrder: newNum > acc.prevNum
          };
        }, {prevNum: -Infinity, inOrder: true});
      t.ok(browserTest.inOrder, 'should find that the previous 10 tests ran in order');
    })
    .catch(() => t.end())
    .then(() => t.end());
}

export const classNameAndLoaderTest = {
  name: 'classname and loader tests',
  test: t => {
    Promise.resolve()
      .then(() => {
        const testNode = document.querySelectorAll('.classy-test-case .tap-react-browser--spinner');
        t.equal(testNode.length, 0, 'should initially find that the spinner is not present');
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, 2000);
        });
      })
      .then(() => {
        const testNode = document.querySelectorAll('.classy-test-case .tap-react-browser--spinner');
        t.equal(testNode.length, 0, 'after test has run there still should be no spinner');
      })
      .catch(() => t.end())
      .then(() => t.end());
  }};
