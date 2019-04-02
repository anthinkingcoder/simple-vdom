/**
 * patch算法之Snabbdom实现
 */
function isString(o) {
  return typeof o === 'string';
}

function patch(oldNode, newNode) {
  let patches = [];
  if (sameNode(oldNode, newNode)) {
    dfs(oldNode, newNode);
  } else {
    replaceElement(oldNode.el.parentNode, oldNode, newNode, patches);
  }
  return patches;
}

function dfs(oldNode, newNode, patches) {
  if (oldNode === newNode) {
    return;
  }
  const el = newNode.el = oldNode.el;
  let changes = diffProps(oldNode.props, newNode.props);
  diffChildren(el, oldNode.childNodes, newNode.childNodes, patches)
  changes.length && patchProps(oldNode, changes, patches)
}

function diffChildren(parentEl, oldCh, newCh, patches) {
  if (!oldCh && !newCh) {
    return;
  }
  let oldStartIndex = 0;
  let newStartIndex = 0;
  let oldEndIndex = oldCh.length - 1;
  let newEndIndex = newCh.length - 1;
  let oldStartNode = oldCh[0];
  let newStartNode = newCh[0];
  let oldEndNode = oldCh[oldEndIndex];
  let newEndNode = newCh[newEndIndex];
  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (oldStartNode === undefined) {
      oldStartIndex += 1;
      oldStartNode = oldCh[oldStartIndex];
    } else if (oldEndNode === undefined) {
      oldEndIndex -= 1;
      oldEndNode = oldCh[oldEndIndex];
    } else if (sameNode(oldStartNode, newStartNode)) {
      dfs(oldStartNode, newStartNode, patches)
      oldStartIndex += 1;
      newStartIndex += 1;
      oldStartNode = oldCh[oldStartIndex];
      newStartNode = newCh[newStartIndex];
    } else if (sameNode(oldEndNode, newEndNode)) {
      dfs(oldEndNode, newEndNode, patches)
      oldEndIndex -= 1;
      newEndIndex -= 1;
      oldEndNode = oldCh[oldEndIndex];
      newEndNode = newCh[newEndIndex];
    } else if (sameNode(oldStartNode, newEndNode)) { //将oldStartNode节点移动到oldEndNode后
      dfs(oldStartNode, newEndNode, patches)
      //如果oldEndIndex已经是oldCh末尾，则为空，否则应该为oldEndNode后一个节点
      moveElement(parentEl, oldStartNode, parentEl.nextSibling());
      oldStartIndex += 1;
      newEndIndex -= 1;
      oldStartNode = oldCh[oldStartIndex];
      newEndNode = newCh[newEndIndex];
    } else if (sameNode(oldEndNode, newStartNode)) {//将oldEndNode节点移动到newStartNode前
      dfs(oldEndNode, newStartNode, patches)
      moveElement(parentEl, oldEndNode, oldStartNode);
      oldEndIndex -= 1;
      newStartIndex += 1;
      oldEndNode = oldCh[oldEndIndex];
      newStartNode = newCh[newStartIndex];
    } else {
      let i = findIndex(oldCh, newStartNode, oldStartIndex, oldEndIndex);
      if (i !== undefined) {
        let node = oldCh[i];
        oldCh[i] = undefined;
        dfs(node, newStartNode, patches)
        moveElement(parentEl, node, oldStartNode, patches);
      } else {
        addElement(parentEl, newStartNode, oldStartNode, patches);
      }
      newStartIndex += 1;
      newStartNode = newCh[newStartIndex];
    }
  }
  if (oldStartIndex <= oldEndIndex) {
    removeNodes(parentEl, oldCh, oldStartIndex, oldEndIndex, patches);
  } else if (newStartIndex <= newEndIndex) {
    //将剩下节点插到当前newEndNode后面
    let beforeNode = newEndIndex + 1 < newCh.length ? newCh[newEndIndex + 1] : null;
    addNodes(parentEl, newCh, newStartIndex, newEndIndex, patches, beforeNode);
  }
}

function addNodes(parentEl, ch, start, end, patches, beforeNode) {
  for (let i = start; i <= end; i++) {
    addElement(parentEl, ch[i], beforeNode, patches)
  }
}

function removeNodes(parentEl, ch, start, end, patches) {
  for (let i = start; i <= end; i++) {
    removeElement(parentEl, ch[i], null, patches)
  }
}

function findIndex(ch, node, start, end) {
  for (let i = start; i <= end; i++) {
    if (sameNode(node, ch[i])) return i;
  }
}


function diffProps(oldProps, newProps) {
  oldProps = oldProps || {};
  newProps = newProps || {};
  let change = [];
  Object.keys(oldProps).forEach(key => {
    //删除
    if (!newProps[key]) {
      change.push({
        name: key
      })
    } else if (oldProps[key] !== newProps[key]) { //更改
      change.push({
        name: key,
        value: newProps[key]
      })
    }
  })
  //新增
  Object.keys(newProps).forEach(key => {
    if (!oldProps[key]) {
      change.push({
        name: key,
        value: newProps[key]
      })
    }
  })
  return change;
}


function sameNode(node1, node2) {
  return node1 && node2 && node1.key === node2.key && node1.tag === node2.tag;
}

function moveElement(parentEl, insertNode, beforeNode, patches) {
  console.log('moveElement:', 'insertNode:', insertNode, 'beforeNode:', beforeNode, patches)
  parentEl.insertBefore(insertNode.el, beforeNode ? beforeNode.el : null)
}

function replaceElement(parentEl, oldNode, newNode, patches) {
  let newEl =  newNode.create();
  parentEl.replaceChild(newEl, oldNode.el)
}

function patchProps(node, props, patches) {
  console.log('props:', node, props)
  let el = node.el;
  props.forEach(prop => {
    if (prop.value) {
      el.setAttribute(prop.name, prop.value);
    } else {
      el.removeAttribute(prop.name);
    }
  })
}

function removeElement(parentEl, childNode, patches) {
  console.log('removeElement:', childNode)
  parentEl.removeChild(childNode.el)
}

function addElement(parentEl, insertNode, beforeNode, patches) {
  console.log('addElement:', 'insertNode:', insertNode, 'beforeNode:', beforeNode)
  let newEl = insertNode.create();
  parentEl.insertBefore(newEl, beforeNode ? beforeNode.el : null)
}

export default patch;


