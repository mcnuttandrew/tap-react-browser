# tap-react-browser

<p align="right">
  <a href="https://npmjs.org/package/tap-react-browser">
    <img src="https://img.shields.io/npm/v/tap-react-browser.svg?style=flat-square" alt="version" />
  </a>
  <a href="https://npmjs.org/package/tap-react-browser">
    <img src="https://img.shields.io/npm/dm/tap-react-browser.svg?style=flat-square" alt="downloads" />
  </a>
  <a href="https://travis-ci.org/mcnuttandrew/tap-react-browser">
    <img src="https://travis-ci.org/mcnuttandrew/tap-react-browser.svg?branch=master" alt="build-status" />
  </a>
</p>

Has this ever happened to you? You find yourself building a sub application to test out the behaviour of a library in the browser, and you end up needing to visually verify everything. What a hassle! tap-react-browser is a light wrapper on tape that allows you you to drop a bunch of tests in a sequence into tape, have them run in the order you put in, and come out printed all pretty.

This is an ideal practice for testing browser specific features directly, such web workers or indexeddb, or if you are building a UI component and just want your tests to run in watch mode (assuming you have watch mode set up).

This library is still very much a work in progress.


## Installation

Installation is very similar to most any other npm package. First have tape and react installed, which we are dependent on you providing. Then install in a normal fashion:

```sh
npm install --save tap-react-browser

# or if you prefer yarn

yarn add tap-react-browser
```

The only slight wrinkle, is that if you are building via webpack you need to add

```js
node: {
  fs: 'empty'
}
```

To your webpack config. It's very important!!! Tape will not run in the browser otherwise. See the example-app's webpack config for more details.

## Example usage:

Start by writing a test. A tape test is a function that expects one argument in the form of the tape object, that is also true here! Here's an example test

```js
export function myCoolTest(t) {
  t.equal('batmang'.length, 7, 'batmang should have seven characters in it');
  t.ok(1 === 1, 'basic truths should stay true');
  t.deepEqual({test: 1}, {test: 1}, 'cool features from tap should stil exisit');
  t.end();
}
```

I generally keep my tests in a seperate file from where I run them, seperation of concerns and all. Once that's done you're ready to drop it into TapReactBrowser:

```js
export default class ExampleApp extends Component {
  render() {
    return (
      <div>
        <h1> Hey Mom! </h1>
        <TapReactBrowser
          runAsPromises
          onComplete={tests => {
            console.log('hi tests!')
          }}
          tests={[myCoolTest]} />
      </div>
    );
  }
}
```

And that's the whole thing! You can have as many TapReactBrowser's per window as you want, you can do anything.

## API

TapReactBrowser takes the following props:

tests     
Type: `array of (functions|objects)`     
This is the list of tests to run, each element in the test suite can either be either a
- function, if this is the case we will try to infer the name of the test from the name of the function
- or an object with the form `{name: 'myCoolTest', test: myTestFunction}`, or in terms of types {name: String, test: function}.

runAsPromises     
Type: `boolean`     
Whether or not to force serial execution on these tests via promises.

onComplete     
Type: `function`     
After all of tests provided to a component have completed this function is run. It recieves as a first argument the tap out put for the tests in that component.

noSpinner     
Type: `boolean`     
If this prop is present then there will be no loading spinner. Defaults to false.

className     
Type: `string`     
Insert a custom class name.

outputMode
Type: `one of ("verbose"|"dot")`
Type of formatting to use for the test output. Defaults to verbose.

## Contributions

Thoughts and PRs are always welcome. Make sure any changes you want to add run correctly in the the development enviroment, which is available by running `yarn start`.

