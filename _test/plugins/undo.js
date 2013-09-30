module("plugins.undo");
//test('', function () {
//    stop()
//});
test( 'trace 3643  更改部分内容,点击 undo,redo,undo,这时redo按钮高亮', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent('<p>hello1</p>');
    setTimeout(function () {
        range.selectNode(editor.body.firstChild).select();
        editor.execCommand('underline');
        equal(editor.queryCommandState('undo'), 0, 'undo按钮高亮');
        equal(editor.queryCommandState('redo'), -1, 'redo按钮高亮');
        editor.execCommand('Undo');
        equal(editor.queryCommandState('undo'), -1, 'undo按钮高亮');
        equal(editor.queryCommandState('redo'), 0, 'redo按钮高亮');
        editor.execCommand('redo');
        equal(editor.queryCommandState('undo'), 0, 'undo按钮高亮');
        equal(editor.queryCommandState('redo'), -1, 'redo按钮高亮');
        editor.execCommand('Undo');
        equal(editor.queryCommandState('undo'), -1, 'undo按钮高亮');
        equal(editor.queryCommandState('redo'), 0, 'redo按钮高亮');
        start();
    }, 50);
    stop();
} );

test( 'trace 3645  设置一段文本为有序列表,再设成无序列表,undo', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent('<p>hello1</p><p>hello2</p>');
    setTimeout(function () {
        range.setStart(body.firstChild, 0).setEnd(body.lastChild, 1).select();
        editor.execCommand('insertorderedlist');
        equal(body.firstChild.tagName.toLowerCase(), 'ol', 'insertorderedlist-检查列表的类型');
        equal(body.firstChild.childNodes.length, 2, '2个孩子');
        editor.execCommand('insertunorderedlist');
        equal(body.firstChild.tagName.toLowerCase(), 'ul', 'insertunorderedlist-检查列表的类型');
        equal(body.firstChild.childNodes.length, 2, '2个孩子');
        editor.execCommand('Undo');
        //这个trace 出现问题的时候,undo之后,列表会变成4行
        equal(body.firstChild.tagName.toLowerCase(), 'ol', 'Undo-检查列表的类型');
        equal(body.firstChild.childNodes.length, 2, '2个孩子');
        start();
    }, 50);
    stop();
} );

function getDiv(){
    var div = document.body.appendChild(document.createElement('div'));
    return div.appendChild(document.createElement('div'));
}

test('输入文本后撤销按钮不亮', function () {
    var div = getDiv();
    div.id = 'ue';
    var editor = UM.getEditor('ue');
    editor.ready(function () {
        var range = new UM.dom.Range(editor.document,editor.body);
        editor.setContent('<p></p>');
        range.setStart(editor.body.firstChild, 0).collapse(true).select();
        ua.keydown(editor.body);
        range.insertNode(editor.document.createTextNode('hello'));
        ua.keydown(editor.body);
        setTimeout(function () {
            equal(editor.queryCommandState('undo'), 0, '模拟输入文本后撤销按钮应当高亮');
            UM.delEditor('ue');
            div&&te.dom.push(div);
            start();
        }, 500);
    });
    stop();
});

test('插入文本、分割线、文本,撤销2次，撤销掉分割线', function () {
    var div = getDiv();
    div.id = 'ue';
    var editor = UM.getEditor('ue');
    editor.ready(function () {
        var range = new UM.dom.Range(editor.document,editor.body);
        editor.setContent('<p></p>');

        //输入文本
        range.setStart(editor.body.firstChild, 0).collapse(true).select();
        ua.keydown(editor.body);
        range.insertNode(editor.document.createTextNode('hello'));
        if (!ua.browser.ie)
            ua.compositionstart(editor.body);
        ua.keyup(editor.body);
        //输入分割符
        range.setStartAfter(editor.body.lastChild).collapse(true).select();
        editor.execCommand('Horizontal');
        //输入文本
        range.setStartAfter(editor.body.lastChild).collapse(true).select();
        ua.keydown(editor.body);
        range.insertNode(editor.document.createTextNode('hello'));
        if (!ua.browser.ie)
            ua.compositionend(editor.body);
        ua.keyup(editor.body);

        editor.execCommand('Undo');
        editor.execCommand('Undo');
        equal(editor.body.getElementsByTagName('hr').length, 0, '分割线已删除');
        setTimeout(function () {
            UM.delEditor('ue');
            div&&te.dom.push(div);
            start()
        }, 500);
    });
    stop();
});

test('undo--redo', function () {
   //todo 分别插入文本,img,list,link,再undo,redo
});
test('ctrl+z/y', function () {
    var div = getDiv();
    div.id = 'ue';
    var editor = UM.getEditor('ue');
    editor.ready(function () {
        var range = new UM.dom.Range(editor.document,editor.body);
        var body = editor.body;
        editor.setContent('<p>没有加粗的文本</p>');
        range.selectNode(body.firstChild).select();
        var p = body.firstChild;
        editor.focus();
        setTimeout(function () {
            ua.keydown(editor.body, {'keyCode':66, 'ctrlKey':true});
            setTimeout(function () {
                if(ua.browser.ie)
                equal(ua.getChildHTML(p),'<strong>没有加粗的文本</strong>');
                else
                equal(ua.getChildHTML(p), '<b>没有加粗的文本</b>');
                ua.keydown(editor.body, {'keyCode':90, 'ctrlKey':true});
                setTimeout(function () {
                    editor.focus();
                    equal(ua.getChildHTML(body.firstChild), '没有加粗的文本');
                    ua.keydown(editor.body, {'keyCode':89, 'ctrlKey':true});
                    editor.focus();
                    setTimeout(function () {
                        equal(ua.getChildHTML(body.firstChild), '<strong>没有加粗的文本</strong>');
                        UM.delEditor('ue');
                        div&&te.dom.push(div);
                        start();
                    },500);
                }, 100);
            }, 150);
        }, 100);
    });
    stop();
});

test('reset,index', function () {
    var editor = te.obj[0];
    var br = (ua.browser.ie&&ua.browser.ie<9)? '&nbsp;': '';
    var range = te.obj[1];
    editor.setContent('<p></p>');
    range.setStart(editor.body.firstChild,0).collapse(true).select();
    editor.execCommand('horizontal');
    var listLength = editor.undoManger.list.length;
    ok(listLength>0,'检查undoManger.list');
    equal(editor.undoManger.index,1,'检查undoManger.index');
    editor.undoManger.undo();
    equal(editor.undoManger.list.length,listLength,'undo操作,undoManger.list不变');
    equal(editor.undoManger.index,0,'undo操作,undoManger.index-1');
    equal(ua.getChildHTML(editor.body), '<p></p>', '检查内容');
    editor.reset();
    equal(editor.undoManger.list.length,0,'reset,undoManger.list清空');
    equal(editor.undoManger.index,0,'reset,undoManger.index清空');
    editor.undoManger.redo();
    ua.manualDeleteFillData(editor.body);
    equal(ua.getChildHTML(editor.body), '<p>'+br+'</p>','检查内容');

});