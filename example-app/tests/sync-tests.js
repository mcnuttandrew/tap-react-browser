export function syncTest1(t) {
  t.equal(1, 1, 'should find a passing test passes');
  t.equal(1, 1, 'and another one should too');
  t.deepEqual({test: 1}, {test: 1}, 'woah even a third one should too');
  t.end();
}

export function syncTest2(t) {
  t.equal(1, 1, 'ok good so far');
  t.equal(1, 1, 'seems similar as last time');
  t.deepEqual({test: 1}, {antitest: 1}, 'but this test was design to fail!!!!');
  t.end();
}

export function buildCommentTest(className, testPosition) {
  return function commentTest(t) {
    t.comment('test initial comment');
    t.ok(true, 'comment test checking in!');
    t.comment('woah doggy test second comment');
    const innerText = document.querySelector(
      `${className} .tap-react-browser--global-section:nth-child(${testPosition})`)
      .innerText.replace(/\n/g, '');
    /* eslint-disable max-len */
    t.equal(innerText,
      'commentTesttest initial comment0PASSEDCOMMENT TEST CHECKING IN!woah doggy test second comment',
      'should find the correct text');
    /* eslint-enable max-len */
    t.end();
  };
}
