import {createTextNode, createNode} from '../lib/createElement';
import patch from '../lib/patch';
let virtualDom = createNode('ul', { class: 'list' }, [
  createNode('li', { class: 'item' }, [createTextNode('1')],'A'),
  createNode('li', { class: 'item' }, [createTextNode('2')],'B'),
  createNode('li', { class: 'item' }, [createTextNode('3')],'C'),
  createNode('li', { class: 'item' }, [createTextNode('4')],'D'),
], 'root');

virtualDom.render()
let virtualDom2 =createNode('ul', { class: 'list-group',width:'30px' }, [
  createNode('li', { class: 'item' }, [createTextNode('1'),createTextNode('2')],'A'),
  createNode('li', { class: 'item' }, [createTextNode('3')],'B'),
  createNode('li', { class: 'item' }, [createTextNode('5')],'E'),
  createNode('li', { class: 'item' }, [createTextNode('4')],'C'),
  createNode('li', { class: 'item' }, [createTextNode('6')],'F'),
], 'root')

setTimeout(() => {
  patch(virtualDom, virtualDom2)
}, 3000)


