/**
 * @file DOMUtil 基类
 * @author Phinome
 * @date 2016-07-10
 */
import utils from './utils';
import dtd from './dtd';
import {browser, ie} from './browser';

// 节点常量
const NODE_ELEMENT = 1;
const NODE_DOCUMENT = 9;
const NODE_TEXT = 3;
const NODE_COMMENT = 8;
const NODE_DOCUMENT_FRAGMENT = 11;

// 位置关系
const POSITION_IDENTICAL = 0;
const POSITION_DISCONNECTED = 1;
const POSITION_FOLLOWING = 2;
const POSITION_PRECEDING = 4;
const POSITION_IS_CONTAINED = 8;
const POSITION_CONTAINS = 16;

// -------------------------Node部分--------------------------------
const keys = {
    8: 1, // Backspace
    46: 1, // Delete
    16: 1, // Shift
    17: 1, // Ctrl
    18: 1, // Alt
    37: 1,
    38: 1,
    39: 1,
    40: 1,
    13: 1 // enter
};
// ie6使用其他的会有一段空白出现
let fillChar = ie && browser.version === '6' ? '\ufeff' : '\u200B';
let attrFix = {
    tabindex: 'tabIndex',
    readonly: 'readOnly'
};
let styleBlock = utils.listToMap([
    '-webkit-box', '-moz-box', 'block',
    'list-item', 'table', 'table-row-group',
    'table-header-group', 'table-footer-group',
    'table-row', 'table-column-group', 'table-column',
    'table-cell', 'table-caption'
]);
let fillCharReg = new RegExp(fillChar, 'g');

/**
 * 设置节点node及其子节点不会被选中
 * @name unSelectable
 * @grammar UM.dom.domUtils.unSelectable(node)
 */
let unSelectable = ie && browser.ie9below || browser.opera ? function (node) {
    // for ie9
    node.onselectstart = function () {
        return false;
    };
    node.onclick = node.onkeyup = node.onkeydown = function () {
        return false;
    };
    node.unselectable = 'on';
    node.setAttribute('unselectable', 'on');
    for (let i = 0, ci; ci = node.all[i++];) {
        switch (ci.tagName.toLowerCase()) {
            case 'iframe' :
            case 'textarea' :
            case 'input' :
            case 'select' :
                break;
            default :
                ci.unselectable = 'on';
                node.setAttribute('unselectable', 'on');
        }
    }
} : function (node) {
    node.style.MozUserSelect = node.style.webkitUserSelect
        = node.style.msUserSelect = node.style.KhtmlUserSelect = 'none';
};

export default class DOMUtil {
    static getDomNode(node, start, ltr, startFromChild, fn, guard) {
        let tmpNode = startFromChild && node[start];
        let parent;
        !tmpNode && (tmpNode = node[ltr]);
        while (!tmpNode && (parent = (parent || node).parentNode)) {
            if (parent.tagName === 'BODY' || guard && !guard(parent)) {
                return null;
            }
            tmpNode = parent[ltr];
        }
        if (tmpNode && fn && !fn(tmpNode)) {
            return  DOMUtil.getDomNode(tmpNode, start, ltr, false, fn);
        }
        return tmpNode;
    }
    static breakParent(node, parent) {
        let tmpNode;
        let parentClone = node;
        let clone = node;
        let leftNodes;
        let rightNodes;
        do {
            parentClone = parentClone.parentNode;
            if (leftNodes) {
                tmpNode = parentClone.cloneNode(false);
                tmpNode.appendChild(leftNodes);
                leftNodes = tmpNode;
                tmpNode = parentClone.cloneNode(false);
                tmpNode.appendChild(rightNodes);
                rightNodes = tmpNode;
            }
            else {
                leftNodes = parentClone.cloneNode(false);
                rightNodes = leftNodes.cloneNode(false);
            }
            while (tmpNode = clone.previousSibling) {
                leftNodes.insertBefore(tmpNode, leftNodes.firstChild);
            }
            while (tmpNode = clone.nextSibling) {
                rightNodes.appendChild(tmpNode);
            }
            clone = parentClone;
        } while (parent !== parentClone);
        tmpNode = parent.parentNode;
        tmpNode.insertBefore(leftNodes, parent);
        tmpNode.insertBefore(rightNodes, parent);
        tmpNode.insertBefore(node, rightNodes);
        DOMUtil.remove(parent);
        return node;
    }
    static trimWhiteTextNode(node) {
        function remove(dir) {
            let child;
            while ((child = node[dir]) && child.nodeType === 3 && DOMUtil.isWhitespace(child)) {
                node.removeChild(child);
            }
        }
        remove('firstChild');
        remove('lastChild');
    }

    static getPosition(nodeA, nodeB) {
        // 如果两个节点是同一个节点
        if (nodeA === nodeB) {
            return 0;
        }
        let node;
        let parentsA = [nodeA];
        let parentsB = [nodeB];
        node = nodeA;
        while (node = node.parentNode) {
            // 如果nodeB是nodeA的祖先节点
            if (node === nodeB) {
                return 10;
            }
            parentsA.push(node);
        }
        node = nodeB;
        while (node = node.parentNode) {
            // 如果nodeA是nodeB的祖先节点
            if (node === nodeA) {
                return 20;
            }
            parentsB.push(node);
        }
        parentsA.reverse();
        parentsB.reverse();
        if (parentsA[0] !== parentsB[0]) {
            return 1;
        }
        let i = -1;
        while (i++, parentsA[i] === parentsB[i]) {
        }
        nodeA = parentsA[i];
        nodeB = parentsB[i];
        while (nodeA = nodeA.nextSibling) {
            if (nodeA === nodeB) {
                return 4;
            }
        }
        return  2;
    }

    static getNodeIndex(node, ignoreTextNode) {
        let preNode = node;
        let i = 0;
        while (preNode = preNode.previousSibling) {
            if (ignoreTextNode && preNode.nodeType === 3) {
                if (preNode.nodeType !== preNode.nextSibling.nodeType) {
                    i++;
                }
                continue;
            }
            i++;
        }
        return i;
    }

    static inDoc(node, doc) {
        return DOMUtil.getPosition(node, doc) === 10;
    }


    static findParent(node, filterFn, includeSelf) {
        if (node && !DOMUtil.isBody(node)) {
            node = includeSelf ? node : node.parentNode;
            while (node) {
                if (!filterFn || filterFn(node) || DOMUtil.isBody(node)) {
                    return filterFn && !filterFn(node) && DOMUtil.isBody(node) ? null : node;
                }
                node = node.parentNode;
            }
        }
        return null;
    }

    static findParentByTagName(node, tagNames, includeSelf, excludeFn) {
        tagNames = utils.listToMap(utils.isArray(tagNames) ? tagNames : [tagNames]);
        return this.findParent(node, function (node) {
            return tagNames[node.tagName] && !(excludeFn && excludeFn(node));
        }, includeSelf);
    }

    static findParents(node, includeSelf, filterFn, closerFirst) {
        let parents = includeSelf && (filterFn && filterFn(node) || !filterFn) ? [node] : [];
        while (node = DOMUtil.findParent(node, filterFn)) {
            parents.push(node);
        }
        return closerFirst ? parents : parents.reverse();
    }

    static insertAfter(node, newNode) {
        return node.parentNode.insertBefore(newNode, node.nextSibling);
    }

    static remove(node, keepChildren) {
        let parent = node.parentNode;
        let child;
        if (parent) {
            if (keepChildren && node.hasChildNodes()) {
                while (child = node.firstChild) {
                    parent.insertBefore(child, node);
                }
            }
            parent.removeChild(node);
        }
        return node;
    }

    static getNextDomNode(node, startFromChild, filterFn, guard) {
        return DOMUtil.getDomNode(node, 'firstChild', 'nextSibling', startFromChild, filterFn, guard);
    }
    static getPreDomNode(node, startFromChild, filterFn, guard) {
        return DOMUtil.getDomNode(node, 'lastChild', 'previousSibling', startFromChild, filterFn, guard);
    }


    static isBookmarkNode(node) {
        return node.nodeType === 1 && node.id && /^_baidu_bookmark_/i.test(node.id);
    }

    static getWindow(node) {
        let doc = node.ownerDocument || node;
        return doc.defaultView || doc.parentWindow;
    }


    static getCommonAncestor(nodeA, nodeB) {
        if (nodeA === nodeB)
            return nodeA;
        let parentsA = [nodeA] , parentsB = [nodeB], parent = nodeA, i = -1;
        while (parent = parent.parentNode) {
            if (parent === nodeB) {
                return parent;
            }
            parentsA.push(parent);
        }
        parent = nodeB;
        while (parent = parent.parentNode) {
            if (parent === nodeA) {
                return parent;
            }
            parentsB.push(parent);
        }
        parentsA.reverse();
        parentsB.reverse();
        while (i++, parentsA[i] === parentsB[i]) {
        }
        return i === 0 ? null : parentsA[i - 1];

    }

    static clearEmptySibling(node, ignoreNext, ignorePre) {
        function clear(next, dir) {
            let tmpNode;
            while (next && !DOMUtil.isBookmarkNode(next) && (DOMUtil.isEmptyInlineElement(next)
            // 这里不能把空格算进来会吧空格干掉，出现文字间的空格丢掉了
            || !new RegExp('[^\t\n\r' + fillChar + ']').test(next.nodeValue))) {
                tmpNode = next[dir];
                DOMUtil.remove(next);
                next = tmpNode;
            }
        }
        !ignoreNext && clear(node.nextSibling, 'nextSibling');
        !ignorePre && clear(node.previousSibling, 'previousSibling');
    }


    static split(node, offset) {
        let doc = node.ownerDocument;
        if (browser.ie && offset === node.nodeValue.length) {
            let next = doc.createTextNode('');
            return DOMUtil.insertAfter(node, next);
        }
        return node.splitText(offset);
    }


    static isWhitespace(node) {
        return !new RegExp('[^ \t\n\r' + fillChar + ']').test(node.nodeValue);
    }

    static getXY(element) {
        let x = 0;
        let y = 0;
        while (element.offsetParent) {
            y += element.offsetTop;
            x += element.offsetLeft;
            element = element.offsetParent;
        }
        return {x, y};
    }

    static isEmptyInlineElement(node) {
        if (node.nodeType !== 1 || !dtd.$removeEmpty[node.tagName]) {
            return 0;
        }
        node = node.firstChild;
        while (node) {
            // 如果是创建的bookmark就跳过
            if (DOMUtil.isBookmarkNode(node)) {
                return 0;
            }
            if (node.nodeType === 1 && !DOMUtil.isEmptyInlineElement(node)
                || node.nodeType === 3 && !DOMUtil.isWhitespace(node)
            ) {
                return 0;
            }
            node = node.nextSibling;
        }
        return 1;
    }


    static isBlockElm(node) {
        return node.nodeType === 1 && (dtd.$block[node.tagName]
            || styleBlock[DOMUtil.getComputedStyle(node, 'display')]) && !dtd.$nonChild[node.tagName];
    }


    static getElementsByTagName(node, name, filter) {
        if (filter && utils.isString(filter)) {
            let className = filter;
            filter = function (node) {
                let result = false;
                $.each(utils.trim(className).replace(/[ ]{2,}/g, ' ').split(' '), function (i, v) {
                    if ($(node).hasClass(v)) {
                        result = true;
                        return false;
                    }
                });
                return result;
            };
        }
        name = utils.trim(name).replace(/[ ]{2,}/g, ' ').split(' ');
        let arr = [];
        for (let n = 0, ni; ni = name[n++];) {
            let list = node.getElementsByTagName(ni);
            for (let i = 0, ci; ci = list[i++];) {
                if (!filter || filter(ci)) {
                    arr.push(ci);
                }
            }
        }
        return arr;
    }


    static removeAttributes(node, attrNames) {
        attrNames = utils.isArray(attrNames) ? attrNames : utils.trim(attrNames).replace(/[ ]{2,}/g, ' ').split(' ');
        for (let i = 0, ci; ci = attrNames[i++];) {
            ci = attrFix[ci] || ci;
            switch (ci) {
                case 'className':
                    node[ci] = '';
                    break;
                case 'style':
                    node.style.cssText = '';
                    let val = node.getAttributeNode('style');
                    !browser.ie && val && node.removeAttributeNode(val);
            }
            node.removeAttribute(ci);
        }
    }

    static createElement(doc, tag, attrs) {
        return DOMUtil.setAttributes(doc.createElement(tag), attrs);
    }

    static setAttributes(node, attrs) {
        for (let attr in attrs) {
            if (attrs.hasOwnProperty(attr)) {
                let value = attrs[attr];
                switch (attr) {
                    case 'class':
                        // ie下要这样赋值，setAttribute不起作用
                        node.className = value;
                        break;
                    case 'style' :
                        node.style.cssText = node.style.cssText + ';' + value;
                        break;
                    case 'innerHTML':
                        node[attr] = value;
                        break;
                    case 'value':
                        node.value = value;
                        break;
                    default:
                        node.setAttribute(attrFix[attr] || attr, value);
                }
            }
        }
        return node;
    }


    static getComputedStyle(element, styleName) {
        return utils.transUnitToPx(utils.fixColor(styleName, $(element).css(styleName)));
    }


    static removeStyle(element, name) {
        if (browser.ie) {
            // 针对color先单独处理一下
            if (name === 'color') {
                name = '(^|;)' + name;
            }
            element.style.cssText = element.style.cssText.replace(new RegExp(name + '[^:]*:[^;]+;?', 'ig'), '');
        }
        else {
            if (element.style.removeProperty) {
                element.style.removeProperty(name);
            }
            else {
                element.style.removeAttribute(utils.cssStyleToDomStyle(name));
            }
        }


        if (!element.style.cssText) {
            DOMUtil.removeAttributes(element, ['style']);
        }
    }


    static getStyle(element, name) {
        let value = element.style[utils.cssStyleToDomStyle(name)];
        return utils.fixColor(name, value);
    }

    static setStyle(element, name, value) {
        element.style[utils.cssStyleToDomStyle(name)] = value;
        if (!utils.trim(element.style.cssText)) {
            DOMUtil.removeAttributes(element, 'style');
        }
    }

    static removeDirtyAttr(node) {
        for (let i = 0, ci, nodes = node.getElementsByTagName('*'); ci = nodes[i++];) {
            ci.removeAttribute('_moz_dirty');
        }
        node.removeAttribute('_moz_dirty');
    }

    static getChildCount(node, fn) {
        let count = 0;
        let first = node.firstChild;
        fn = fn || function () {
                return 1;
            };
        while (first) {
            if (fn(first)) {
                count++;
            }
            first = first.nextSibling;
        }
        return count;
    }


    static isEmptyNode(node) {
        return !node.firstChild || DOMUtil.getChildCount(node, function (node) {
                return  !DOMUtil.isBr(node) && !DOMUtil.isBookmarkNode(node) && !DOMUtil.isWhitespace(node);
            }) === 0;
    }


    static isBr(node) {
        return node.nodeType === 1 && node.tagName === 'BR';
    }
    static isFillChar(node, isInStart) {
        return node.nodeType === 3 && !node.nodeValue.replace(new RegExp((isInStart ? '^' : '')
                + fillChar), '').length;
    }

    static isEmptyBlock(node, reg) {
        if (node.nodeType !== 1) {
            return 0;
        }
        reg = reg || new RegExp('[ \t\r\n' + fillChar + ']', 'g');
        if (node[browser.ie ? 'innerText' : 'textContent'].replace(reg, '').length > 0) {
            return 0;
        }
        for (let n in dtd.$isNotEmpty) {
            if (dtd.$isNotEmpty.hasOwnProperty(n) && node.getElementsByTagName(n).length) {
                return 0;
            }
        }
        return 1;
    }

    // 判断是否是编辑器自定义的参数
    static isCustomeNode(node) {
        return node.nodeType === 1 && node.getAttribute('_ue_custom_node_');
    }
    static fillNode(doc, node) {
        let tmpNode = browser.ie ? doc.createTextNode(fillChar) : doc.createElement('br');
        node.innerHTML = '';
        node.appendChild(tmpNode);
    }
    static isBoundaryNode(node, dir) {
        let tmp;
        while (!DOMUtil.isBody(node)) {
            tmp = node;
            node = node.parentNode;
            if (tmp !== node[dir]) {
                return false;
            }
        }
        return true;
    }

    static isBody(node) {
        return $(node).hasClass('edui-body-container');
    }
}
