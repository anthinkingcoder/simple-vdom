const createElement = require('../lib/createElement');
const diff = require('../lib/diff')
// let virtualDom = createElement('ul', { class: 'list' }, [
//   createElement('li', { class: 'item' }, 'A'),
//   createElement('li', { class: 'item' }, 'B'),
//   createElement('li', { class: 'item' }, 'C'),
//   createElement('li', { class: 'item' }, 'D'),
// ], 'root');
//
// let virtualDom2 =createElement('ul', { class: 'list-group' }, [
//   createElement('li', { class: 'item' }, 'B'),
//   createElement('li', { class: 'item' }, 'A'),
//   createElement('li', { class: 'item' }, 'C'),
//   createElement('li', { class: 'item' }, 'D'),
//   createElement('li', { class: 'item' }, 'E'),
// ], 'root')
//
// let patches = diff(virtualDom, virtualDom2)



let virtualDom = createElement('ul', { class: 'list' }, [
  createElement('li', { class: 'item' }, 'A'),
  createElement('li', { class: 'item' }, 'B'),
], 'root');

let virtualDom2 =createElement('ul', { class: 'list' }, [
  createElement('li', { class: 'item' }, 'E'),
  createElement('li', { class: 'item' }, 'D'),
  createElement('li', { class: 'item' }, 'A'),
  createElement('li', { class: 'item' }, 'C'),
], 'root')

let patches = diff(virtualDom, virtualDom2)

Object.keys(patches).forEach((key) => {
  console.log(`${key}:${JSON.stringify(patches[key])}`)
})
