module('core.Range');

var checkBookmark = function (bookmark, pre, latter, id) {
    same(bookmark['start'], pre, '检查start返回值');
    same(bookmark['end'], latter, '检查end返回值');
    equal(bookmark['id'], id, '检查id');
};

test('init', function () {
    expect(6);
    var div = te.dom[2];
    var range = new UE.dom.Range(document);
    ua.checkResult(range, null, null, null, null, true, 'for init range');
    same(range.document, document, 'check current document of range');
});


test('setStart/startEnd 自闭合元素', function () {
    var range = new UE.dom.Range(document);
    var div = te.dom[2];
    var img = document.createElement('img');
    div.appendChild(img);
    range.setStart(img, 0);
    ua.checkResult(range, div, div, 0, 0, true, "endContainer is null");
    range.setEnd(img, 0);
    ua.checkResult(range, div, div, 0, 1, false, "startContainer is not null");
    range.startContainer = null;
    range.setEnd(img, 0);
    ua.checkResult(range, div, div, 1, 1, true, "startContainer is null");
    range.setStart(img, 0);
    ua.checkResult(range, div, div, 0, 1, false, "endContainer is not null");
});

test('setStart/startEnd--nodeType不为1', function () {
    var range = new UE.dom.Range(document);
    var div = te.dom[2];
    var text = document.createTextNode("text");
    div.appendChild(text);
    range.setStart(text, 0);
    ua.checkResult(range, text, text, 0, 0, true, "endContainer is null");
    range.setEnd(text, 1);
    ua.checkResult(range, text, text, 0, 1, false, "startContainer is not null");
});

test('setStart/setEnd--nodeType为1', function () {
    var range = new UE.dom.Range(document);
    var div = te.dom[2];
    range.setStart(div, 0);
    ua.checkResult(range, div, div, 0, 0, true, "endContainer is null");
    range.setEnd(div, 1);
    ua.checkResult(range, div, div, 0, 1, false, "startContainer is not null");
});
/*
 * 测的内容比较多，updateCollapse，setEndPoint，setStart，setEnd，collapse
 * 因为updateCollapse和setEndPoint无法通过Range对象获取， 必须间接调用验证
 */
test('setStartAfter,setStartBefore', function () {
    var div = te.dom[2];
    div.innerHTML = '<span></span><a></a>';
    var span = div.firstChild;
    var a = div.lastChild;
    var range = new UE.dom.Range(document);
    range.setStartAfter(a);
    equal(range.startOffset, 2, 'check startOffset for setStartAfter--boundary testing');
    range.setStartAfter(span);
    equal(range.startOffset, 1, 'check startOffset for setStartAfter');
    range.setStartBefore(span);
    equal(range.startOffset, 0, 'check startOffset for setStartBefore--boundary testing');
    range.setStartBefore(a);
    equal(range.startOffset, 1, 'check startOffset for setStartBefore');
    var txtNode = document.createTextNode("text");
    div.innerHTML = "";
    div.appendChild(txtNode);
    range.setStartBefore(txtNode);
    equal(range.startOffset, 0, 'check startOffset in text node');
});

test('setEndAfter,setEndBefore', function () {
    var div = te.dom[2];
    div.innerHTML = '<span></span><a></a>';
    var span = div.firstChild;
    var a = div.lastChild;
    var range = new UE.dom.Range(document);
    range.setEndAfter(a);
    equal(range.endOffset, 2, 'check startOffset for setEndAfter--boundary testing');
    range.setEndAfter(span);
    equal(range.endOffset, 1, 'check startOffset for setEndAfter');
    range.setEndBefore(span);
    equal(range.endOffset, 0, 'check startOffset for setEndBefore--boundary testing');
    range.setEndBefore(a);
    equal(range.endOffset, 1, 'check startOffset for setEndBefore');
});

/* 校验collapse方法 */
test('collapse', function () {
    var text = document.createTextNode('TextNode');
    te.dom[2].appendChild(text);
    var range = new UE.dom.Range(document);
    range.setStart(text, 1);
//    ua.checkResult(range.endContainer,range.startContainer,0)
    ok(range.collapsed, 'check collapse method true--setStart');
    equal(range.startContainer, range.endContainer, 'compare startContainer and endContainer--setStart');
    range.startContainer = null;
    range.setEnd(text, 0);
    equal(range.startContainer, range.endContainer, 'compare startContainer and endContainer--setEnd');
    equal(range.startOffset, range.endOffset, 'compare startOffset and endOffset--setEnd');
    ok(range.collapsed, 'check collapsed is true--setEnd');
    var img = document.createElement("img");
    range.insertNode(img).selectNode(img);
    equal(range.startContainer, range.endContainer, "img startContainer and endContainer is same，but startOffset and endOffset is not same");
});

//TODO 空节点<div></div>

test('selectNode', function () {
    var div = te.dom[2];
    div.innerHTML = "text!";
    div.id = 'div_id';
    var range = new UE.dom.Range(document);
    range.selectNode(div);
    var index = ua.getIndex(div);
    ua.checkResult(range, document.body, document.body, index, index + 1, false, 'check selectNode');
});

test('selectNode--空节点', function () {
    var div = te.dom[2];
    var range = new UE.dom.Range(document);
    range.selectNode(div);
    var index = ua.getIndex(div);
    ua.checkResult(range, document.body, document.body, index, index + 1, false, 'check selectNode');
});

test('selectNode--空文本节点', function () {
    var div = te.dom[2];
    var range = new UE.dom.Range(document);
    var textNode = document.createTextNode('');
    div.appendChild(textNode);
    range.selectNode(div);
    var index = ua.getIndex(div);
    ua.checkResult(range, document.body, document.body, index, index + 1, false, 'check selectNode');
});

test('selectNodeContents', function () {
    expect(15);
    var div = te.dom[2];
    div.innerHTML = '<div>text</div><a>';
    var text = div.firstChild.firstChild;
    var range = new UE.dom.Range(document);
    range = range.selectNodeContents(div);
    ua.checkResult(range, div, div, 0, 2, false, 'selectNodeContents');
    /*textNode*/
    range = range.selectNodeContents((text));
    ua.checkResult(range, text, text, 0, 4, false, 'selectNodeContents for textNode');
    div.innerHTML = '<b>xxx<i>xxx</i>xxx</b>';
    range = new UE.dom.Range(document);
    range = range.selectNodeContents(div.firstChild);
    ua.checkResult(range, div.firstChild, div.firstChild, 0, 3, false, 'selectNodeContents');

});


test('cloneRange', function () {
    expect(5);
    var div = te.dom[2];
    var range = new UE.dom.Range(document);
    div.innerHTML = '<div>cloneRange</div>';
    range.setStart(div, 0);
    range.setEnd(div, 1);
    var cloneRange = range.cloneRange(range);
    ua.checkResult(range, cloneRange.startContainer, cloneRange.endContainer,
        cloneRange.startOffset, cloneRange.endOffset, false, 'cloneRange');
});


/*循环缩进子节点，直到子节点元素类型不为1或为自闭合元素*/
test('shrinkBoundary--not ignore end', function () {
    var div = te.dom[2];
    var range = new UE.dom.Range(document);
//    $('#test').css('background','red');
    div.innerHTML = '<div>div1_text</div><a>a_text</a><div><span>span_text</span>div3_text</div>';

    var a = div.firstChild.nextSibling;
    var div_2 = div.lastChild;
    range.setStart(div, 1).setEnd(div, 3);
    range.shrinkBoundary();
    ua.checkResult(range, a, div_2, 0, 2, false, 'shrinkBoundary--not ignore end');
});

test('shrinkBoundary--ignoreEnd', function () {
    var div = te.dom[2];
    var range = new UE.dom.Range(document);
    div.innerHTML = "<div><p>p_text</p></div>";
    var div_child = div.firstChild;
    var p = div_child.firstChild;
    range.setStart(div_child, 0).setEnd(div_child, 0);
    //TODO
    range.shrinkBoundary(true);
    ua.checkResult(range, p, p, 0, 0, true, '检查前后闭合是否一致');
});
test('shrinkBonudaryl', function () {
    var div = te.dom[2];
    var range = new UE.dom.Range(document);
    div.innerHTML = '<b><i>xxxx</i>xxxxxxx</b>';
    /*ignoreEnd=true*/
    range.selectNodeContents(div).shrinkBoundary(true);

    var i = div.firstChild.firstChild;
    ua.checkResult(range, i, div, 0, 1, false, 'shrinkBoundary--ignoreEnd');
    /*ignoreEnd = null*/
    var b = div.firstChild;
    range.selectNodeContents(div).shrinkBoundary();
    ua.checkResult(range, i, b, 0, b.childNodes.length, false, 'shrinkBoundary--not ignoreEnd');

    div.innerHTML = 'xxxx<b><i><u></u></i></b>ssss';
    var u = div.getElementsByTagName('u')[0];
    range.selectNode(div.getElementsByTagName('b')[0]).shrinkBoundary();
    ua.checkResult(range, u, u, 0, 0, true, '初始startContainer和endContainer相同');

    div.innerHTML = '<table><tr><td>sssss</td></tr></table>';
    var td = div.getElementsByTagName('td')[0];
    var table = div.firstChild;
    range.setStart(table, 0).setEnd(table.getElementsByTagName('tr')[0], 1).shrinkBoundary();
    ua.checkResult(range, td, td, 0, 1, false, '初始startContainer和endContainer不同');

    div.innerHTML = '<img/>';
    range.setStart(div, 0).setEnd(div, 1).shrinkBoundary();
    ua.checkResult(range, div, div, 0, 1, false, '子节点为自闭合元素，未能进入函数内部的逻辑');

    div.innerHTML = 'text';
    var text = div.firstChild;
    range.setStart(text, 1).setEnd(text, 4).shrinkBoundary();
    ua.checkResult(range, text, text, 1, 4, false, '节点为文本节点，未能进入函数内部的逻辑');

    range.setStart(div, 0).setEnd(div, 1).shrinkBoundary();
    ua.checkResult(range, div, div, 0, 1, false, '子节点为文本节点，未能进入函数内部的逻辑');

    range.setStart(div, 0).setEnd(div, 0).shrinkBoundary();
    ua.checkResult(range, div, div, 0, 0, true, '元素collapsed');

    range.setStart(div, 0).setEnd(text, 4).shrinkBoundary();
    ua.checkResult(range, div, text, 0, 4, false, 'endContainer为文本节点');
});


/*调整边界，针对TextNode*/
test('txtToElmBoundary', function () {
    var div = te.dom[2];
    div.innerHTML = 'text_node';
    var range = new UE.dom.Range(document);
    var text = div.firstChild;
    /*endOffset大于text的长度*/
    range.setStart(text, 0).setEnd(text, 10);
    range.txtToElmBoundary();
    ua.checkResult(range, div, div, 0, 1, false, 'endOffset大于text的长度');
    /*endOffset小于text的长度*/
    range.setStart(text, 1).setEnd(text, 4).txtToElmBoundary();
    ua.checkResult(range, text, text, 1, 4, false, 'endOffset小于text长度');
    range.setStart(text, 1).setEnd(text, 10).txtToElmBoundary();
    ua.checkResult(range, text, div, 1, 1, false, 'startOffset不为0，endOffset大于text长度');
    /*startOffset和endOffset都大于text长度*/
    range.setStart(text, 10).setEnd(text, 11).txtToElmBoundary();
    ua.checkResult(range, div, div, 1, 1, true, 'endOffset和startOffset大于text长度');
    /*startOffset和endOffset都等于0*/
    range.setStart(text, 0).setEnd(text, 0).txtToElmBoundary();
    ua.checkResult(range, text, text, 0, 0, true, 'startOffset和endOffset为0');
});

/*切分文本节点*/
test('trimBonudary', function () {
    var div = te.dom[2];
    div.innerHTML = '<table border="1"><tr><td>td_xxxx<b><i><u>u_text</u></i></b></td></tr></table>';
    var range = new UE.dom.Range(document);
    var td = div.getElementsByTagName('td')[0];
    var td_text = td.firstChild;
    /*startOffset为0，在第一个孩子节点前插入*/
    range.setStart(td_text, 0).setEnd(td_text, 5);

    range.trimBoundary();
    ua.checkResult(range, td, td, 0, 1, false, '切分文本节点');
    /*text_node被切分为2个文本节点*/
    equal(td_text.data, "td_xx", "check text of tr");

    var u = div.getElementsByTagName('u')[0];
    var u_text = u.firstChild;

    /*startOffset=0 && collapsed=true，则不对后面的文本节点进行操作*/
    range.setStart(u_text, 0).setEnd(u_text, 0);
    range.trimBoundary();
    ua.checkResult(range, u, u, 0, 0, true, 'startOffset=endOffset=0');

    /*endOffset大于text的长度，从左边切'*/
    range.setStart(u_text, 3).setEnd(u_text, 10);
    range.trimBoundary().select();
    ua.checkResult(range, u, u, 1, 2, false, 'endOffset大于text的长度');
    equal(u_text.data, 'u_t', '从左边切分textNode');

    /*endOffset大小于text的长度，从中间切'*/
    range.setStart(u_text, 1).setEnd(u_text, 2);
    range.trimBoundary();
    ua.checkResult(range, u, u, 1, 2, false, 'endOffset小于text的长度');
    equal(u_text.data, 'u', '从中间切分textNode');

    div.innerHTML = '123456';
    range.setStart(div.firstChild, 2).setEnd(div.firstChild, 4).trimBoundary(true);
    ua.checkResult(range, div, div.lastChild, 1, 2, false, 'ignoreEnd');
});

/*前面尽可能往右边跳，后面尽可能往左边跳*/
test('adjustmentBoundary--startContainer为文本节点', function () {
    var range = new UE.dom.Range(document);
    var div = te.dom[2];
    div.innerHTML = 'div_text<p><span id="span">span_text</span></p>div_text2<p id="p">p_text<em>em_text</em></p>';
    var span_text = document.getElementById('span').firstChild;
    var p = document.getElementById('p');
    range.setStart(span_text, 9).setEnd(p, 0);
    range.adjustmentBoundary();
    ua.checkResult(range, div, div, 2, 3, false, 'startContainer为文本节点');

});

//TODO
test('adjustmentBoundary--非文本节点', function () {
    var range = new UE.dom.Range(document);
    var div = te.dom[2];
    div.innerHTML = 'div_text<p><span id="span">span_text</span></p>div_text2<p id="p">p_text<em>em_text</em></p>';
    var span = document.getElementById('span');
    var p = document.getElementById('p');
    range.setStart(span, 1).setEnd(p, 0);
    range.adjustmentBoundary();
    ua.checkResult(range, div, div, 2, 3, false, 'startContainer为非文本节点');

});


test('selectNodeContents', function () {
    var div = te.dom[2];
    div.innerHTML = '<b>xxxx</b>div_text';
    var range = new UE.dom.Range(document);
    /*选中非文本节点*/
    range.selectNodeContents(div);
    ua.checkResult(range, div, div, 0, 2, false, 'selectNodeContents');
    /*选中文本节点*/
    range.selectNodeContents(div.lastChild);
    ua.checkResult(range, div.lastChild, div.lastChild, 0, 8, false, 'selectNodeContents--');
});

test('insertNode--文本中插入', function () {
    var div = te.dom[2];
    var range = new UE.dom.Range(document);
    div.innerHTML = 'div_text1<p>p_text</p>xxx<em>em_text</em>xxxxxxx<b>xxxx|xxx</b><p>bbbbb</p>text2_div';
    var p_text = div.firstChild.nextSibling.firstChild;
    range.setStart(p_text, 1).setEnd(p_text, 2);
    /*插入块元素*/
    var new_div = document.createElement('div');
    range.insertNode(new_div);

    ua.checkResult(range, p_text.parentNode, new_div.nextSibling, 1, 1, false, '插入div');

    /*插入文本节点，原来闭合*/
    var em_text = div.getElementsByTagName('em')[0].firstChild;
    range.setStart(em_text, 0).setEnd(em_text, 0);
    range.insertNode(document.createTextNode('new_text'));
    ua.checkResult(range, em_text.parentNode, em_text.parentNode, 0, 1, false, '闭合情况下插入文本');
    /*插入inline元素*/
    range.setStart(div.firstChild, 1).setEnd(div.lastChild, 1);
    range.insertNode(document.createElement('i'));
    ua.checkResult(range, div, div.lastChild, 1, 1, false, '插入inline元素');
});

test('inserNode--块元素中插入', function () {
    var div = te.dom[2];
    var range = new UE.dom.Range(document);
    div.innerHTML = 'div_text1<p>p_text</p>xxx<em>em_text</em>xxxxxxx<b>xxxx|xxx</b><p>bbbbb</p>text2_div';
//	var p_text = div.firstChild.nextSibling.firstChild;
    range.setStart(div, 1).setEnd(div.lastChild, 2);
    /*插入块元素*/
    var new_div = document.createElement('div');
    range.insertNode(new_div);

    ua.checkResult(range, div, div.lastChild, 1, 2, false, '插入div');

});

test('insertNode--插入的节点为endContainer孩子', function () {
    var div = te.dom[2];
    var range = new UE.dom.Range(document);
    div.innerHTML = 'xxx<p>xxxxx</p>xxx<em>xxx</em>xxxxxxx<b>xxxx|xxx</b><p>bbbbb</p>xx';
    var length = div.childNodes.length;
    range.setStart(div, 1).setEnd(div, length);
    var new_div = document.createElement('div');
    new_div.innerHTML = 'xxxx<div>div_text<span></span></div><i>i_text</i><img /><em>em_text</em>xxxx';
    range.insertNode(new_div);
    ua.checkResult(range, div, div, 1, length + 1, false, '插入节点为endContainer的孩子');
    equal(ua.getHTML(div), '<div id="test">xxx<div>xxxx<div>div_text<span></span></div><i>i_text</i><img><em>em_text</em>xxxx</div><p>xxxxx</p>xxx<em>xxx</em>xxxxxxx<b>xxxx|xxx</b><p>bbbbb</p>xx</div>')
});

test('insertNode--插入的fragment为endContainer孩子', function () {
    var div = te.dom[2];
    var range = new UE.dom.Range(document);
    var frag = document.createDocumentFragment();

    div.innerHTML = 'xxx<p>xxxxx</p>xxx<em>xxx</em>xxxxxxx<b>xxxx|xxx</b><p>bbbbb</p>xx';
    var length = div.childNodes.length;
    range.setStart(div, 1).setEnd(div, div.childNodes.length);
    var new_div = document.createElement('div');
    frag.appendChild(new_div);
    frag.appendChild(document.createTextNode('text'));
    frag.appendChild(document.createElement('span'));
    range.insertNode(frag);
    ua.checkResult(range, div, div, 1, length + 3, false, '插入fragment为endContainer的孩子');
    equal(ua.getHTML(div), '<div id="test">xxx<div></div>text<span></span><p>xxxxx</p>xxx<em>xxx</em>xxxxxxx<b>xxxx|xxx</b><p>bbbbb</p>xx</div>', '比较innerHTML');
});

test('createBookmark/moveToBookmark--元素不闭合', function () {
    var div = te.dom[2];
    var range = new UE.dom.Range(document);
    div.innerHTML = 'first_text<b><i>i_text</i>xxxxxxx</b><span id="span">span_text</span><p id="second"><em>em_text</em>p_text</p>';
    var bookmark = range.selectNode(div).createBookmark();
    ua.checkResult(range, document.body, document.body, ua.getIndex(div), ua.getIndex(div) + 1, false, "元素不闭合,创建书签");
    ok(/_baidu_bookmark_start_/.test(div.previousSibling.id), '检查div的前一个兄弟');
    ok(/_baidu_bookmark_end_/.test(div.nextSibling.id), '检查div的后一个兄弟');
    /*moveToBookmark*/
    range.moveToBookmark(bookmark);
    ua.checkResult(range, document.body, document.body, ua.getIndex(div), ua.getIndex(div) + 1, false, "元素不闭合，删除书签");
    ok(!/_baidu_bookmark_start_/.test(div.previousSibling.id), '检查div的前面书签是否被删除');

    range.setStart(div, 2).setEnd(div, 3);
    var bookmark = range.createBookmark(true);
    ua.checkResult(range, div, div, 3, 4, false, "元素不闭合，插入span");
    var preId = document.getElementById('span').previousSibling.id;
    var latterId = document.getElementById('span').nextSibling.id;
    var reg = /_baidu_bookmark_start_/;
    ok(/_baidu_bookmark_start_/.test(preId), '检查前面span的id');
    ok(/_baidu_bookmark_end_/.test(latterId), '检查后面span的id');
    checkBookmark(bookmark, preId, latterId, true);

    range.moveToBookmark(bookmark);
    ua.checkResult(range, div, div, 2, 3, false, 'moveToBookmark');
    equal(ua.getHTML(div), '<div id="test">first_text<b><i>i_text</i>xxxxxxx</b><span id="span">span_text</span><p id="second"><em>em_text</em>p_text</p></div>');

});

test('createBookmark/moveToBookmark--span嵌套', function () {
    var div = te.dom[2];
    var range = new UE.dom.Range(document);
    div.innerHTML = 'first_text<b><i>i_text</i>xxxxxxx</b><span id="span">span_text</span><p id="second"><em>em_text</em>p_text</p>';
    var span = document.getElementById('span');
    range.setStart(span, 0).setEnd(span, 1);
    var bookmark = range.createBookmark();
    var pre = span.firstChild;
    var latter = span.lastChild;
    ua.checkResult(range, span, span, 1, 2, false, 'span嵌套');
    ok(/_baidu_bookmark_start_/.test(pre.id), '检查前面span的id');
    ok(/_baidu_bookmark_end_/.test(latter.id), '检查后面span的id');
    checkBookmark(bookmark, pre, latter, undefined);
});

test('createBookmark/moveToBookmark--元素闭合', function () {
    var div = te.dom[2];
    var range = new UE.dom.Range(document);
    div.innerHTML = 'first_text<b><i>i_text</i>xxxxxxx</b><span id="span">span_text</span><p id="second"><em id="em">em_text</em>p_text</p>';
    var em_text = document.getElementById('em').firstChild;
    var em = em_text.parentNode;
    range.setStart(em_text, 1).setEnd(em_text, 1);
    var bookmark = range.createBookmark(true, true);
    ua.checkResult(range, em, em, 2, 2, true, '元素闭合');
    var pre = em.firstChild.nextSibling;
    checkBookmark(bookmark, pre.id, null, true);
    equal('_baidu_bookmark_start_', pre.id, '检查前面span的id');

});


test('getClosedNode', function () {
    var div = te.dom[2];
    var range = new UE.dom.Range(document);
    div.innerHTML = 'xxx<span>xxx</span><img />xxxx';
    range.setStart(div, 2).setEnd(div, 3);
    same(range.getClosedNode(), div.lastChild.previousSibling, 'check result is img');

    range.setStart(div, 2).collapse(true);
    equal(range.getClosedNode(), null, 'check null return result');

    range.setStart(div, 0).setEnd(div, 1);
    equal(range.getClosedNode(), null, 'get null result');

});

test('b节点取range', function () {
    var div = te.dom[2];
    var editor = new UE.Editor({'autoFloatEnabled':false});
    stop();
    editor.render(div);
    editor.ready(function () {
        var range = new UE.dom.Range(editor.document);
        editor.setContent('<p>hello<strong>hello1</strong>hello2</p>');
        range.setStart(editor.body.firstChild.lastChild, 0).collapse(1).select();
        range = editor.selection.getRange();
        if ((ua.browser.ie &&ua.browser.ie < 9) || ua.browser.webkit)
            ua.checkResult(range, editor.body.firstChild.lastChild.previousSibling, editor.body.firstChild.lastChild.previousSibling, 1, 1, true, '节点后--check range');
        else if(ua.browser.ie &&ua.browser.ie > 8)//todo ie9,10改range
            ua.checkResult(range, editor.body.firstChild, editor.body.firstChild, 3, 3, true, '节点后--check range');
        else
            ua.checkResult(range, editor.body.firstChild.lastChild.previousSibling, editor.body.firstChild.lastChild.previousSibling, 0, 0, true, '节点后--check range');

        range.setStart(editor.body.firstChild.firstChild.nextSibling, 0).collapse(1)
        range.select();
        range = editor.selection.getRange();
        if (ua.browser.webkit)
            ua.checkResult(range, editor.body.firstChild.firstChild.nextSibling.firstChild, editor.body.firstChild.firstChild.nextSibling.firstChild, 1, 1, true, '节点内文本节点前--check range');
        else if (ua.browser.ie&&ua.browser.ie < 9)
            ua.checkResult(range, editor.body.firstChild.childNodes[1].childNodes[1], editor.body.firstChild.childNodes[1].childNodes[1], 0, 0, true, '节点内文本节点前--check range');
        else if(ua.browser.ie &&ua.browser.ie > 8)//todo ie9,10改range
            ua.checkResult(range, editor.body.firstChild.childNodes[1], editor.body.firstChild.childNodes[1], 1, 1, true, '节点内文本节点前--check range');
        else
            ua.checkResult(range, editor.body.firstChild.firstChild.nextSibling.firstChild, editor.body.firstChild.firstChild.nextSibling.firstChild, 0, 0, true, '节点内文本节点前--check range');

        range.setStart(editor.body.firstChild.childNodes[1], 0).collapse(1).select();
        range = editor.selection.getRange();
        if (ua.browser.webkit)
            ua.checkResult(range, editor.body.firstChild.childNodes[1].firstChild, editor.body.firstChild.childNodes[1].firstChild, 1, 1, true, 'b节点--check range');
        else if (ua.browser.ie&&ua.browser.ie < 9)
            ua.checkResult(range, editor.body.firstChild.childNodes[1].childNodes[1], editor.body.firstChild.childNodes[1].childNodes[1], 0, 0, true, '节点内文本节点前--check range');
        else if(ua.browser.ie &&ua.browser.ie > 8)//todo ie9,10改range
            ua.checkResult(range, editor.body.firstChild.childNodes[1], editor.body.firstChild.childNodes[1], 1, 1, true, '节点内文本节点前--check range');
        else
            ua.checkResult(range, editor.body.firstChild.childNodes[1].firstChild, editor.body.firstChild.childNodes[1].firstChild, 0, 0, true, 'b节点--check range');
        start();
    });
});

test('文本节点中间取range', function () {
    var div = te.dom[2];
    var editor = new UE.Editor({'autoFloatEnabled':false});
    stop();
    editor.render(div);
    editor.ready(function () {
        var range = new UE.dom.Range(editor.document);
        editor.setContent('<p>hello2</p>');
        range.setStart(editor.body.firstChild.firstChild, 2).collapse(1).select();
        range = editor.selection.getRange();        if (ua.browser.ie&&ua.browser.ie < 9)
            ua.checkResult(range, editor.body.firstChild.lastChild, editor.body.firstChild.lastChild, 0, 0, true, 'check range');
        else if(ua.browser.ie &&ua.browser.ie > 8)//todo ie9,10改range
            ua.checkResult(range, editor.body.firstChild, editor.body.firstChild, 2, 2, true, 'check range');
        else
            ua.checkResult(range, editor.body.firstChild.lastChild, editor.body.firstChild.lastChild, 2, 2, true, 'check range');
        start();
    });
});

//test( 'select--closedNode', function() {
//    var div = te.dom[2];
//    var range = new UE.dom.Range( document );
//    div.innerHTML = 'div_text<span style="color:red">span_text</span><img />div2_text<em>em_text</em>';
////    range.setStart(div.getElementsBytagName('img'),0).setEnd(div.)
////    var span = div.firstChild.nextSibling;
////    range.setStart(span,1).setEnd(div,4);
////    range.select();
////
////     ua.checkResult(range,span,div,1,4,false,'check range');
////    range.insertNode(document.createTextNode('aa'));
////    var selection = new UE.dom.Selection( document );
////    var nativeRange = selection.getRange();
//    //TODO
//} );

test('range.createAddress,range.moveAddress', function () {
    function equalRange(rngA, rngB) {
        return rngA.startContainer === rngB.startContainer && rngA.startOffset === rngB.startOffset
            && rngA.endContainer === rngB.endContainer && rngA.endOffset === rngB.endOffset

    }

    var div = te.dom[0];
    var rng = new UE.dom.Range(document);
    div.innerHTML = '<b>xxxx</b>';
    var addr = rng.setStart(div.firstChild, 0).collapse(true).createAddress(true);
    var rng1 = new UE.dom.Range(document);
    rng1.moveToAddress(addr);
    ok(equalRange(rng, rng1));
    div.innerHTML = 'aaa';
    div.appendChild(document.createTextNode('aaa'));
    div.appendChild(document.createTextNode('aaa'));
    addr = rng.setStart(div.lastChild, 0).setEnd(div.lastChild, div.lastChild.nodeValue.length).createAddress();
    rng1.moveToAddress(addr);
    ok(equalRange(rng, rng1));
    addr = rng.setStart(div.lastChild, 0).setEnd(div.lastChild, div.lastChild.nodeValue.length).createAddress(false, true);
    div.innerHTML = 'aaaaaabbb';
    rng1.moveToAddress(addr);

    div.innerHTML = 'aaaaaabbb<b>sss</b>';
    addr = rng.setStartAfter(div.lastChild.firstChild).collapse(true).createAddress(false);
    rng1.moveToAddress(addr);
    ok(equalRange(rng, rng1))
    div.innerHTML = '';
    div.appendChild(document.createTextNode(domUtils.fillChar));
    div.appendChild(document.createTextNode('aaa'));
    addr = rng.setStartAtLast(div).collapse(true).createAddress(false, true);
    div.innerHTML = 'aaa';
    rng1.moveToAddress(addr);
    rng.setStartAtLast(div).collapse(true);
    ok(equalRange(rng, rng1));
    div.innerHTML = 'aaa<b>sss</b>';
    div.appendChild(document.createTextNode(domUtils.fillChar));
    addr = rng.setStartAtLast(div).collapse(true).createAddress(false, true);
    div.innerHTML = 'aaa<b>sss</b>';
    rng1.moveToAddress(addr);
    rng.setStartAtLast(div).collapse(true);
    ok(equalRange(rng, rng1));
    div.innerHTML = 'aaa';
    div.appendChild(document.createTextNode(domUtils.fillChar));
    div.appendChild(document.createTextNode('aaa'));
    //空节点有占位
    addr = rng.setStart(div.firstChild.nextSibling, 0).collapse(true).createAddress(false, true);
    div.innerHTML = 'aaaaaa';
    rng1.moveToAddress(addr);
    rng.setStart(div.firstChild, 3).collapse(true);
    ok(equalRange(rng, rng1));
});

test('equals', function () {
    var div = te.dom[2];
    var rng = new UE.dom.Range(document);
    div.innerHTML = '<b>xxxx</b>';
    rng.setStart(div.firstChild, 0).collapse(true);
    var rng2 = rng.cloneRange();
    ok(rng.equals(rng2))
});