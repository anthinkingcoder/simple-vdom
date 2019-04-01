const Node = require('./node');
const ChangeState = require('./changeState')

function diff(oldNode, newNode) {
  let patches = {};
  dfs(oldNode, newNode, 0, patches);
  return patches;
}

function dfs(oldNode, newNode, index, patches) {
  let curPatches = [];
  if (sameNode(oldNode, newNode)) {
    let changes = diffProps(oldNode.props, newNode.props);
    changes.length && curPatches.push({type: ChangeState.PROPS, value: changes})
    diffChildren(oldNode.childNodes, newNode.childNodes, index, patches)
  } else {
    curPatches.push({
      type: ChangeState.REPLACE,
      node: newNode
    })
  }
  if (patches[index]) {
    patches[index] = patches[index].concat(curPatches);
  } else if (curPatches.length) {
    patches[index] = curPatches;
  }
}

function diffChildren(oldCh, newCh, index, patches) {
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
      dfs(oldStartNode, newStartNode, oldStartIndex + index + 1, patches)
      oldStartIndex += 1;
      newStartIndex += 1;
      oldStartNode = oldCh[oldStartIndex];
      newStartNode = newCh[newStartIndex];
    } else if (sameNode(oldEndNode, newEndNode)) {
      dfs(oldEndNode, newEndNode, oldEndIndex + index + 1, patches)
      oldEndIndex -= 1;
      newEndIndex -= 1;
      oldEndNode = oldCh[oldEndIndex];
      newEndNode = newCh[newEndIndex];
    } else if (sameNode(oldStartNode, newEndNode)) {
      dfs(oldStartNode, newEndNode, oldStartIndex + index + 1, patches)
      patches[oldStartIndex + index + 1] = patches[oldStartIndex + index + 1] || []
      patches[oldStartIndex + index + 1].push({
        type: ChangeState.MOVE,
        insertNode: oldStartNode,
        beforeNode: null
      });
      oldStartIndex += 1;
      newEndIndex -= 1;
      oldStartNode = oldCh[oldStartIndex];
      newEndNode = newCh[newEndIndex];
    } else if (sameNode(oldEndNode, newStartNode)) {
      dfs(oldEndNode, newStartNode, oldEndIndex + index + 1, patches)
      patches[oldEndIndex + index + 1] = patches[oldEndIndex + index + 1] || []
      patches[oldEndIndex + index + 1].push({
        type: ChangeState.MOVE,
        insertNode: oldEndNode,
        beforeNode: oldStartNode
      });
      oldEndIndex -= 1;
      newStartIndex += 1;
      oldEndNode = oldCh[oldEndIndex];
      newStartNode = newCh[newStartIndex];
    } else {
      let i = findIndex(oldCh, newStartNode, oldStartIndex, oldEndIndex);
      if (i !== undefined) {
        let node = oldCh[i];
        patches[i + index + 1] = patches[i + index + 1] || []
        oldCh[i] = undefined;
        dfs(node, newStartNode, i + index + 1, patches)
        patches[i + index + 1].push({
          type: ChangeState.MOVE,
          insertNode: node,
          beforeNode: oldStartNode
        })
      } else {
        patches[index] = patches[index] || []
        patches[index].push({
          type: ChangeState.ADD,
            insertNode: newStartNode,
            beforeNode: oldStartNode
        })
      }
      newStartIndex += 1;
      newStartNode = newCh[newStartIndex];
    }
  }
  if (oldStartIndex <= oldEndIndex) {
    removeNodes(index, oldCh, oldStartIndex, oldEndIndex, patches);
  } else if (newStartIndex <= newEndIndex) {
    addNodes(index, newCh, newStartIndex, newEndIndex, patches);
  }
}

function addNodes(index, ch, start, end, patches) {
  patches[index] = patches[index] || [];
  for (let i = start; i <= end; i++) {
    patches[index].push({
      type: ChangeState.ADD,
      insertNode: ch[i],
      beforeNode: null
    })
  }
}

function removeNodes(index, ch, start, end, patches) {
  patches[index] = patches[index] || [];
  for (let i = start; i <= end; i++) {
    patches[index].push({
      type: ChangeState.REMOVE,
      node: ch[i]
    })
  }
}

function findIndex(ch, node, start, end) {
  for (let i = start; i <= end; i++) {
    if (sameNode(node, ch[i])) return i;
  }
}


function diffProps(oldProps, newProps) {
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


module.exports = diff;


