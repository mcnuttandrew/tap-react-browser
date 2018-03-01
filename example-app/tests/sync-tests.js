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
