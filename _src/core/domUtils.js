/**
 * @file
 * @name UE.dom.domUtils
 * @short DomUtils
 * @import editor.js, core/utils.js,core/browser.js,core/dom/dtd.js
 * @desc UEditor封装的底层dom操作库
 */

var attrFix = ie && browser.version < 9 ? {
        tabindex:"tabIndex",
        readonly:"readOnly",
        "for":"htmlFor",
        "class":"className",
        maxlength:"maxLength",
        cellspacing:"cellSpacing",
        cellpadding:"cellPadding",
        rowspan:"rowSpan",
        colspan:"colSpan",
        usemap:"useMap",
        frameborder:"frameBorder"
    } : {
        tabindex:"tabIndex",
        readonly:"readOnly"
    },
    styleBlock = utils.listToMap([
        '-webkit-box', '-moz-box', 'block' ,
        'list-item' , 'table' , 'table-row-group' ,
        'table-header-group', 'table-footer-group' ,
        'table-row' , 'table-column-group' , 'table-column' ,
        'table-cell' , 'table-caption'
    ]);
var domUtils = dom.domUtils = {
    //节点常量
    NODE_ELEMENT:1,
    NODE_DOCUMENT:9,
    NODE_TEXT:3,
    NODE_COMMENT:8,
    NODE_DOCUMENT_FRAGMENT:11,

    //位置关系
    POSITION_IDENTICAL:0,
    POSITION_DISCONNECTED:1,
    POSITION_FOLLOWING:2,
    POSITION_PRECEDING:4,
    POSITION_IS_CONTAINED:8,
    POSITION_CONTAINS:16,
    //ie6使用其他的会有一段空白出现
    fillChar:ie && browser.version == '6' ? '\ufeff' : '\u200B',
    //-------------------------Node部分--------------------------------
    keys:{
        /*Backspace*/ 8:1, /*Delete*/ 46:1,
        /*Shift*/ 16:1, /*Ctrl*/ 17:1, /*Alt*/ 18:1,
        37:1, 38:1, 39:1, 40:1,
        13:1 /*enter*/
    },
    /**
     * 获取节点A相对于节点B的位置关系
     * @name getPosition
     * @grammar UE.dom.domUtils.getPosition(nodeA,nodeB)  =>  Number
     * @example
     *  switch (returnValue) {
     *      case 0: //相等，同一节点
     *      case 1: //无关，节点不相连
     *      case 2: //跟随，即节点A头部位于节点B头部的后面
     *      case 4: //前置，即节点A头部位于节点B头部的前面
     *      case 8: //被包含，即节点A被节点B包含
     *      case 10://组合类型，即节点A满足跟随节点B且被节点B包含。实际上，如果被包含，必定跟随，所以returnValue事实上不会存在8的情况。
     *      case 16://包含，即节点A包含节点B
     *      case 20://组合类型，即节点A满足前置节点A且包含节点B。同样，如果包含，必定前置，所以returnValue事实上也不会存在16的情况
     *  }
     */
    getPosition:function (nodeA, nodeB) {
        // 如果两个节点是同一个节点
        if (nodeA === nodeB) {
            // domUtils.POSITION_IDENTICAL
            return 0;
        }
        var node,
            parentsA = [nodeA],
            parentsB = [nodeB];
        node = nodeA;
        while (node = node.parentNode) {
            // 如果nodeB是nodeA的祖先节点
            if (node === nodeB) {
                // domUtils.POSITION_IS_CONTAINED + domUtils.POSITION_FOLLOWING
                return 10;
            }
            parentsA.push(node);
        }
        node = nodeB;
        while (node = node.parentNode) {
            // 如果nodeA是nodeB的祖先节点
            if (node === nodeA) {
                // domUtils.POSITION_CONTAINS + domUtils.POSITION_PRECEDING
                return 20;
            }
            parentsB.push(node);
        }
        parentsA.reverse();
        parentsB.reverse();
        if (parentsA[0] !== parentsB[0]) {
            // domUtils.POSITION_DISCONNECTED
            return 1;
        }
        var i = -1;
        while (i++, parentsA[i] === parentsB[i]) {
        }
        nodeA = parentsA[i];
        nodeB = parentsB[i];
        while (nodeA = nodeA.nextSibling) {
            if (nodeA === nodeB) {
                // domUtils.POSITION_PRECEDING
                return 4
            }
        }
        // domUtils.POSITION_FOLLOWING
        return  2;
    },

    /**
     * 返回节点node在父节点中的索引位置
     * @name getNodeIndex
     * @grammar UE.dom.domUtils.getNodeIndex(node)  => Number  //索引值从0开始
     */
    getNodeIndex:function (node, ignoreTextNode) {
        var preNode = node,
            i = 0;
        while (preNode = preNode.previousSibling) {
            if (ignoreTextNode && preNode.nodeType == 3) {
                if(preNode.nodeType != preNode.nextSibling.nodeType ){
                    i++;
                }
                continue;
            }
            i++;
        }
        return i;
    },

    /**
     * 检测节点node是否在节点doc的树上，实质上是检测是否被doc包含
     * @name inDoc
     * @grammar UE.dom.domUtils.inDoc(node,doc)   =>  true|false
     */
    inDoc:function (node, doc) {
        return domUtils.getPosition(node, doc) == 10;
    },
    /**
     * 查找node节点的祖先节点
     * @name findParent
     * @grammar UE.dom.domUtils.findParent(node)  => Element  // 直接返回node节点的父节点
     * @grammar UE.dom.domUtils.findParent(node,filterFn)  => Element  //filterFn为过滤函数，node作为参数，返回true时才会将node作为符合要求的节点返回
     * @grammar UE.dom.domUtils.findParent(node,filterFn,includeSelf)  => Element  //includeSelf指定是否包含自身
     */
    findParent:function (node, filterFn, includeSelf) {
        if (node && !domUtils.isBody(node)) {
            node = includeSelf ? node : node.parentNode;
            while (node) {
                if (!filterFn || filterFn(node) || domUtils.isBody(node)) {
                    return filterFn && !filterFn(node) && domUtils.isBody(node) ? null : node;
                }
                node = node.parentNode;
            }
        }
        return null;
    },
    /**
     * 通过tagName查找node节点的祖先节点
     * @name findParentByTagName
     * @grammar UE.dom.domUtils.findParentByTagName(node,tagNames)   =>  Element  //tagNames支持数组，区分大小写
     * @grammar UE.dom.domUtils.findParentByTagName(node,tagNames,includeSelf)   =>  Element  //includeSelf指定是否包含自身
     * @grammar UE.dom.domUtils.findParentByTagName(node,tagNames,includeSelf,excludeFn)   =>  Element  //excludeFn指定例外过滤条件，返回true时忽略该节点
     */
    findParentByTagName:function (node, tagNames, includeSelf, excludeFn) {
        tagNames = utils.listToMap(utils.isArray(tagNames) ? tagNames : [tagNames]);
        return domUtils.findParent(node, function (node) {
            return tagNames[node.tagName] && !(excludeFn && excludeFn(node));
        }, includeSelf);
    },
    /**
     * 查找节点node的祖先节点集合
     * @name findParents
     * @grammar UE.dom.domUtils.findParents(node)  => Array  //返回一个祖先节点数组集合，不包含自身
     * @grammar UE.dom.domUtils.findParents(node,includeSelf)  => Array  //返回一个祖先节点数组集合，includeSelf指定是否包含自身
     * @grammar UE.dom.domUtils.findParents(node,includeSelf,filterFn)  => Array  //返回一个祖先节点数组集合，filterFn指定过滤条件，返回true的node将被选取
     * @grammar UE.dom.domUtils.findParents(node,includeSelf,filterFn,closerFirst)  => Array  //返回一个祖先节点数组集合，closerFirst为true的话，node的直接父亲节点是数组的第0个
     */
    findParents:function (node, includeSelf, filterFn, closerFirst) {
        var parents = includeSelf && ( filterFn && filterFn(node) || !filterFn ) ? [node] : [];
        while (node = domUtils.findParent(node, filterFn)) {
            parents.push(node);
        }
        return closerFirst ? parents : parents.reverse();
    },

    /**
     * 在节点node后面插入新节点newNode
     * @name insertAfter
     * @grammar UE.dom.domUtils.insertAfter(node,newNode)  => newNode
     */
    insertAfter:function (node, newNode) {
        return node.parentNode.insertBefore(newNode, node.nextSibling);
    },

    /**
     * 删除节点node，并根据keepChildren指定是否保留子节点
     * @name remove
     * @grammar UE.dom.domUtils.remove(node)  =>  node
     * @grammar UE.dom.domUtils.remove(node,keepChildren)  =>  node
     */
    remove:function (node, keepChildren) {

        var parent = node.parentNode,
            child;
        if (parent) {
            if (keepChildren && node.hasChildNodes()) {
                while (child = node.firstChild) {
                    parent.insertBefore(child, node);
                }
            }
            parent.removeChild(node);
        }
        return node;
    },


    /**
     * 检测节点node是否属于bookmark节点
     * @name isBookmarkNode
     * @grammar UE.dom.domUtils.isBookmarkNode(node)  => true|false
     */
    isBookmarkNode:function (node) {
        return node.nodeType == 1 && node.id && /^_baidu_bookmark_/i.test(node.id);
    },
    /**
     * 获取节点node所在的window对象
     * @name  getWindow
     * @grammar UE.dom.domUtils.getWindow(node)  => window对象
     */
    getWindow:function (node) {
        var doc = node.ownerDocument || node;
        return doc.defaultView || doc.parentWindow;
    },


    /**
     * 将一个文本节点node拆分成两个文本节点，offset指定拆分位置
     * @name split
     * @grammar UE.dom.domUtils.split(node,offset)  =>  TextNode  //返回从切分位置开始的后一个文本节点
     */
    split:function (node, offset) {
        var doc = node.ownerDocument;
        if (browser.ie && offset == node.nodeValue.length) {
            var next = doc.createTextNode('');
            return domUtils.insertAfter(node, next);
        }
        var retval = node.splitText(offset);
        //ie8下splitText不会跟新childNodes,我们手动触发他的更新
        if (browser.ie8) {
            var tmpNode = doc.createTextNode('');
            domUtils.insertAfter(retval, tmpNode);
            domUtils.remove(tmpNode);
        }
        return retval;
    },

    /**
     * 检测节点node是否为空节点（包括空格、换行、占位符等字符）
     * @name  isWhitespace
     * @grammar  UE.dom.domUtils.isWhitespace(node)  => true|false
     */
    isWhitespace:function (node) {
        return !new RegExp('[^ \t\n\r' + domUtils.fillChar + ']').test(node.nodeValue);
    },
    /**
     * 获取元素element相对于viewport的位置坐标
     * @name getXY
     * @grammar UE.dom.domUtils.getXY(element)  => Object //返回坐标对象{x:left,y:top}
     */
    getXY:function (element) {
        var x = 0, y = 0;
        while (element.offsetParent) {
            y += element.offsetTop;
            x += element.offsetLeft;
            element = element.offsetParent;
        }
        return { 'x':x, 'y':y};
    },
    /**
     * 为元素element绑定原生DOM事件，type为事件类型，handler为处理函数
     * @name on
     * @grammar UE.dom.domUtils.on(element,type,handler)   //type支持数组传入
     * @example
     * UE.dom.domUtils.on(document.body,"click",function(e){
     *     //e为事件对象，this为被点击元素对戏那个
     * })
     * @example
     * UE.dom.domUtils.on(document.body,["click","mousedown"],function(evt){
     *     //evt为事件对象，this为被点击元素对象
     * })
     */
    on:function (element, type, handler) {
        var types = utils.isArray(type) ? type : [type],
            k = types.length;
        if (k) while (k--) {
            type = types[k];
            if (element.addEventListener) {
                element.addEventListener(type, handler, false);
            } else {
                if (!handler._d) {
                    handler._d = {
                        els : []
                    };
                }
                var key = type + handler.toString(),index = utils.indexOf(handler._d.els,element);
                if (!handler._d[key] || index == -1) {
                    if(index == -1){
                        handler._d.els.push(element);
                    }
                    if(!handler._d[key]){
                        handler._d[key] = function (evt) {
                            return handler.call(evt.srcElement, evt || window.event);
                        };
                    }


                    element.attachEvent('on' + type, handler._d[key]);
                }
            }
        }
        element = null;
    },
    /**
     * 解除原生DOM事件绑定
     * @name un
     * @grammar  UE.dom.donUtils.un(element,type,handler)  //参见<code><a href="#on">on</a></code>
     */
    un:function (element, type, handler) {
        var types = utils.isArray(type) ? type : [type],
            k = types.length;
        if (k) while (k--) {
            type = types[k];
            if (element.removeEventListener) {
                element.removeEventListener(type, handler, false);
            } else {
                var key = type + handler.toString();
                try{
                    element.detachEvent('on' + type, handler._d ? handler._d[key] : handler);
                }catch(e){}
                if (handler._d && handler._d[key]) {
                    var index = utils.indexOf(handler._d.els,element);
                    if(index!=-1){
                        handler._d.els.splice(index,1);
                    }
                    handler._d.els.length == 0 && delete handler._d[key];
                }
            }
        }
    },



    /**
     * 检查节点node是否为块元素
     * @name isBlockElm
     * @grammar UE.dom.domUtils.isBlockElm(node)  => true|false
     */
    isBlockElm:function (node) {
        return node.nodeType == 1 && (dtd.$block[node.tagName] || styleBlock[domUtils.getComputedStyle(node, 'display')]) && !dtd.$nonChild[node.tagName];
    },
    /**
     * 检测node节点是否为body节点
     * @name isBody
     * @grammar UE.dom.domUtils.isBody(node)   => true|false
     */
    isBody:function (node) {
        return  node && node.nodeType == 1 && node.tagName.toLowerCase() == 'body';
    },






    /**
     * 原生方法getElementsByTagName的封装
     * @name getElementsByTagName
     * @grammar UE.dom.domUtils.getElementsByTagName(node,tagName)  => Array  //节点集合数组
     */
    getElementsByTagName:function (node, name,filter) {
        if(filter && utils.isString(filter)){
           var className = filter;
           filter =  function(node){return domUtils.hasClass(node,className)}
        }
        name = utils.trim(name).replace(/[ ]{2,}/g,' ').split(' ');
        var arr = [];
        for(var n = 0,ni;ni=name[n++];){
            var list = node.getElementsByTagName(ni);
            for (var i = 0, ci; ci = list[i++];) {
                if(!filter || filter(ci))
                    arr.push(ci);
            }
        }

        return arr;
    },


    /**
     * 设置节点node及其子节点不会被选中
     * @name unSelectable
     * @grammar UE.dom.domUtils.unSelectable(node)
     */
    unSelectable:ie || browser.opera ? function (node) {
        //for ie9
        node.onselectstart = function () {
            return false;
        };
        node.onclick = node.onkeyup = node.onkeydown = function () {
            return false;
        };
        node.unselectable = 'on';
        node.setAttribute("unselectable", "on");
        for (var i = 0, ci; ci = node.all[i++];) {
            switch (ci.tagName.toLowerCase()) {
                case 'iframe' :
                case 'textarea' :
                case 'input' :
                case 'select' :
                    break;
                default :
                    ci.unselectable = 'on';
                    node.setAttribute("unselectable", "on");
            }
        }
    } : function (node) {
        node.style.MozUserSelect =
            node.style.webkitUserSelect =
                node.style.KhtmlUserSelect = 'none';
    },
    /**
     * 删除节点node上的属性attrNames，attrNames为属性名称数组
     * @name  removeAttributes
     * @grammar UE.dom.domUtils.removeAttributes(node,attrNames)
     * @example
     * //Before remove
     * <span style="font-size:14px;" id="test" name="followMe">xxxxx</span>
     * //Remove
     * UE.dom.domUtils.removeAttributes(node,["id","name"]);
     * //After remove
     * <span style="font-size:14px;">xxxxx</span>
     */
    removeAttributes:function (node, attrNames) {
        attrNames = utils.isArray(attrNames) ? attrNames : utils.trim(attrNames).replace(/[ ]{2,}/g,' ').split(' ');
        for (var i = 0, ci; ci = attrNames[i++];) {
            ci = attrFix[ci] || ci;
            switch (ci) {
                case 'className':
                    node[ci] = '';
                    break;
                case 'style':
                    node.style.cssText = '';
                    !browser.ie && node.removeAttributeNode(node.getAttributeNode('style'))
            }
            node.removeAttribute(ci);
        }
    },
    /**
     * 在doc下创建一个标签名为tag，属性为attrs的元素
     * @name createElement
     * @grammar UE.dom.domUtils.createElement(doc,tag,attrs)  =>  Node  //返回创建的节点
     */
    createElement:function (doc, tag, attrs) {
        return domUtils.setAttributes(doc.createElement(tag), attrs)
    },
    /**
     * 为节点node添加属性attrs，attrs为属性键值对
     * @name setAttributes
     * @grammar UE.dom.domUtils.setAttributes(node,attrs)  => node
     */
    setAttributes:function (node, attrs) {
        for (var attr in attrs) {
            if(attrs.hasOwnProperty(attr)){
                var value = attrs[attr];
                switch (attr) {
                    case 'class':
                        //ie下要这样赋值，setAttribute不起作用
                        node.className = value;
                        break;
                    case 'style' :
                        node.style.cssText = node.style.cssText + ";" + value;
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
    },

    /**
     * 获取元素element的计算样式
     * @name getComputedStyle
     * @grammar UE.dom.domUtils.getComputedStyle(element,styleName)  => String //返回对应样式名称的样式值
     * @example
     * getComputedStyle(document.body,"font-size")  =>  "15px"
     * getComputedStyle(form,"color")  =>  "#ffccdd"
     */
    getComputedStyle:function (element, styleName) {
        //一下的属性单独处理
        var pros = 'width height top left';

        if(pros.indexOf(styleName) > -1){
            return element['offset' + styleName.replace(/^\w/,function(s){return s.toUpperCase()})] + 'px';
        }
        //忽略文本节点
        if (element.nodeType == 3) {
            element = element.parentNode;
        }
        //ie下font-size若body下定义了font-size，则从currentStyle里会取到这个font-size. 取不到实际值，故此修改.
        if (browser.ie && browser.version < 9 && styleName == 'font-size' && !element.style.fontSize &&
            !dtd.$empty[element.tagName] && !dtd.$nonChild[element.tagName]) {
            var span = element.ownerDocument.createElement('span');
            span.style.cssText = 'padding:0;border:0;font-family:simsun;';
            span.innerHTML = '.';
            element.appendChild(span);
            var result = span.offsetHeight;
            element.removeChild(span);
            span = null;
            return result + 'px';
        }
        try {
            var value = domUtils.getStyle(element, styleName) ||
                (window.getComputedStyle ? domUtils.getWindow(element).getComputedStyle(element, '').getPropertyValue(styleName) :
                    ( element.currentStyle || element.style )[utils.cssStyleToDomStyle(styleName)]);

        } catch (e) {
            return "";
        }
        return utils.transUnitToPx(utils.fixColor(styleName, value));
    },

    /**
     * 判断元素element是否包含样式类名className,支持以空格分开的多个类名,多个类名顺序不同也可以比较
     * @name hasClass
     * @grammar UE.dom.domUtils.hasClass(element,className)  =>true|false
     */
    hasClass:function (element, className) {
        if(utils.isRegExp(className)){
            return className.test(element.className)
        }
        className = utils.trim(className).replace(/[ ]{2,}/g,' ').split(' ');
        for(var i = 0,ci,cls = element.className;ci=className[i++];){
            if(!new RegExp('\\b' + ci + '\\b','i').test(cls)){
                return false;
            }
        }
        return i - 1 == className.length;
    },

    /**
     * 阻止事件默认行为
     * @param {Event} evt    需要组织的事件对象
     */
    preventDefault:function (evt) {
        evt.preventDefault ? evt.preventDefault() : (evt.returnValue = false);
    },

    /**
     * 获取元素element的某个样式值
     * @name getStyle
     * @grammar UE.dom.domUtils.getStyle(element,name)  => String
     */
    getStyle:function (element, name) {
        var value = element.style[ utils.cssStyleToDomStyle(name) ];
        return utils.fixColor(name, value);
    },
    /**
     * 为元素element设置样式属性值
     * @name setStyle
     * @grammar UE.dom.domUtils.setStyle(element,name,value)
     */
    setStyle:function (element, name, value) {
        element.style[utils.cssStyleToDomStyle(name)] = value;
        if(!utils.trim(element.style.cssText)){
            this.removeAttributes(element,'style')
        }
    },

    /**
     * 删除_moz_dirty属性
     * @function
     */
    removeDirtyAttr:function (node) {
        for (var i = 0, ci, nodes = node.getElementsByTagName('*'); ci = nodes[i++];) {
            ci.removeAttribute('_moz_dirty');
        }
        node.removeAttribute('_moz_dirty');
    },
    /**
     * 返回子节点的数量
     * @function
     * @param {Node}    node    父节点
     * @param  {Function}    fn    过滤子节点的规则，若为空，则得到所有子节点的数量
     * @return {Number}    符合条件子节点的数量
     */
    getChildCount:function (node, fn) {
        var count = 0, first = node.firstChild;
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
    },

    /**
     * 判断是否为空节点
     * @function
     * @param {Node}    node    节点
     * @return {Boolean}    是否为空节点
     */
    isEmptyNode:function (node) {
        return !node.firstChild || domUtils.getChildCount(node, function (node) {
            return  !domUtils.isBr(node) && !domUtils.isBookmarkNode(node) && !domUtils.isWhitespace(node)
        }) == 0
    },

    /**
     * 判断节点是否为br
     * @function
     * @param {Node}    node   节点
     */
    isBr:function (node) {
        return node.nodeType == 1 && node.tagName == 'BR';
    },
    isFillChar:function (node,isInStart) {
        return node.nodeType == 3 && !node.nodeValue.replace(new RegExp((isInStart ? '^' : '' ) + domUtils.fillChar), '').length
    },

    isEmptyBlock:function (node,reg) {
        if(node.nodeType != 1)
            return 0;
        reg = reg || new RegExp('[ \t\r\n' + domUtils.fillChar + ']', 'g');
        if (node[browser.ie ? 'innerText' : 'textContent'].replace(reg, '').length > 0) {
            return 0;
        }
        for (var n in dtd.$isNotEmpty) {
            if (node.getElementsByTagName(n).length) {
                return 0;
            }
        }
        return 1;
    },

    //判断是否是编辑器自定义的参数
    isCustomeNode:function (node) {
        return node.nodeType == 1 && node.getAttribute('_ue_custom_node_');
    },
    fillNode:function (doc, node) {
        var tmpNode = browser.ie ? doc.createTextNode(domUtils.fillChar) : doc.createElement('br');
        node.innerHTML = '';
        node.appendChild(tmpNode);
    }
};
var fillCharReg = new RegExp(domUtils.fillChar, 'g');