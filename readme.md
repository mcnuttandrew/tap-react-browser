# tap-react-browser

Has this ever happened to you? You find yourself building a sub application to test out the behaviour of a library in the browser, and you end up needing to visually verify everything. What a hassle!

tap-react-browser is a light wrapper on tape that allows you you to drop a bunch of tests in a sequence into tape, have them run in the order you put in, and come out printed all pretty.


webpack build note:

gotta add
node: {
  fs: 'empty'
}

it's very important!!!


TODOS
- broadcast test status in browser (so that pupeteer can pick it up)
- write more docs
- build a diffing thing
- figure our peer dep on tape
- maybe flow type this lib?
- fonts?


