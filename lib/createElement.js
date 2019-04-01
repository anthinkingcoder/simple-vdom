const Node = require('./node');
function createElement(tag, props, child, key) {
  return new Node(tag, props, child, key);
}
module.exports = createElement;