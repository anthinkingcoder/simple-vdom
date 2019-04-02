import Node from './node'
function createNode(tag, props, child, key) {
  return new Node(tag, props, child, key);
}

function createTextNode(text) {
  return new Node(undefined, undefined, undefined, undefined, text)
}
export  {
  createNode,
  createTextNode
}