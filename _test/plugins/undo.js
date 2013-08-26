module("plugins.undo");
function getDiv(){
    var div = document.body.appendChild(document.createElement('div'));
    return div.appendChild(document.createElement('div'));
}

test('输入文本后撤销按钮不亮', function () {
    var div = getDiv();
    div.id = 'ue';
    var editor = UE.getEditor('ue');
    editor.ready(function () {
        var range = new UE.dom.Range(editor.document);
        editor.setContent('<p></p>');
        range.setStart(editor.body.firstChild, 0).collapse(true).select();
        ua.keydown(editor.body);
        range.insertNode(editor.document.createTextNode('hello'));
        ua.keydown(editor.body);
        setTimeout(function () {
            equal(editor.queryCommandState('undo'), 0, '模拟输入文本后撤销按钮应当高亮');
            UE.clearCache('ue');
            div&&te.dom.push(div);
            start();
        }, 500);
    });
    stop();
});

test('插入文本、分割线、文本,撤销2次，撤销掉分割线', function () {
    var div = getDiv();
    div.id = 'ue';
    var editor = UE.getEditor('ue');
    editor.ready(function () {
        var range = new UE.dom.Range(editor.document);
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
            UE.clearCache('ue');
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
    var editor = UE.getEditor('ue');
    editor.ready(function () {
        var range = new UE.dom.Range(editor.document);
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
                        UE.clearCache('ue');
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
    var br = ua.browser.ie? '&nbsp;': '';
    editor.setContent('<p></p>');
    editor.focus();
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