class Node {
  constructor(tag, props, child, key) {
    this.props = props;
    this.tag = tag;
    if (Array.isArray(child)) {
      this.childNodes = child;
    } else if (typeof child === 'string') {
      this.key = child;
      this.childNodes = [];
    }
    if (key) {
      this.key = key;
    }
  }
  render () {

  }
  toString() {
    return {
      key,
      tag
    }
  }
}


module.exports = Node;