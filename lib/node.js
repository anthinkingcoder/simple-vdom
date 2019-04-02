export default class Node {
  constructor(tag, props, child, key, text) {
    this.props = props;
    this.tag = tag;
    if (!tag) {
      this.key = text;
      this.text = text;
    } else {
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

    this.el = null;
  }

  render() {
    let root = this.create();
    document.body.appendChild(root);
    return root;
  }

  create() {
    return this._createElement(this.tag, this.props, this.childNodes, this.key, this.text);
  }

  _createElement(tag, props, child, key,text) {
    if (!tag) {
      return document.createTextNode(text);
    }
    let el = document.createElement(tag);
    Object.keys(props).forEach(key => {
      el.setAttribute(key, props[key]);
    })
    if (key) {
      el.setAttribute('key', key);
    }
    if (child) {
      child.forEach(item => {
        let child
        if (item instanceof Node) {
          child = this._createElement(item.tag, item.props, item.childNodes, item.key, item.text);
          item.el = child;
        }
        el.appendChild(child);
      })
    }
    this.el = el;
    return el;
  }
}


