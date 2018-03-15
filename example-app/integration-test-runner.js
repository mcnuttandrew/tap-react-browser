const puppeteer = require('puppeteer');
const tape = require('tape');

let browser;
let page;

const EXPECTED_META_TEST_OUTPUT = [{
  type: 'test', name: 'meta test, this test runs after all the other tests', id: 0
}, {
  id: 0,
  ok: true,
  name: 'all promise tests should pass',
  operator: 'equal',
  objectPrintDepth: 5,
  actual: 15,
  expected: 15,
  test: 0,
  type: 'assert'
}, {
  id: 1,
  ok: true,
  name: 'one of the sync test should have failed',
  operator: 'equal',
  objectPrintDepth: 5,
  actual: 6,
  expected: 6,
  test: 0,
  type: 'assert'
}, {
  id: 2,
  ok: true,
  name: 'one of the sync test should have failed',
  operator: 'equal',
  objectPrintDepth: 5,
  actual: 6,
  expected: 6,
  test: 0,
  type: 'assert'
}, {
  type: 'end',
  test: 0
}];

tape('Meta-testing results', t => {
  puppeteer.launch({headless: true})
  .then(newBrowser => {
    browser = newBrowser;
    return browser.newPage();
  })
  .then(newPage => {
    page = newPage;
    return page.goto('http://localhost:3001/', {waitUntil: 'networkidle2'});
  })
  .then(() => page.waitForSelector('.meta-test .tap-react-browser--done', {timeout: null, visible: true}))
  .then(res => page.evaluate(() => document.TapReactBrowserTestResults))
  .then(results => {
    t.deepEqual(results, EXPECTED_META_TEST_OUTPUT, 'should find that all of the meta tests pass');
    return;
  })
  .then(() => browser.close())
  .then(() => t.end());
});
