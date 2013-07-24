module("plugins.undo");

/*trace 856*/
test('trace 856 输入文本后撤销按钮不亮', function () {
    var div = document.body.appendChild(document.createElement('div'));
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
            UE.delEditor('ue');
            start();
        }, 500);
    });
    stop();
});

/*trace 617*/
test('trace 617 插入文本、分割线、文本,撤销2次，撤销掉分割线', function () {
    var div = document.body.appendChild(document.createElement('div'));
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
            UE.delEditor('ue');
            start()
        }, 500);
    });
    stop();
});

test('undo--redo', function () {
   //todo 分别插入文本,img,list,link,再undo,redo
});
test('ctrl+z/y', function () {
    var div = document.body.appendChild(document.createElement('div'));
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
                equal(ua.getChildHTML(p), '<strong>没有加粗的文本</strong>');
                ua.keydown(editor.body, {'keyCode':90, 'ctrlKey':true});
                setTimeout(function () {
                    editor.focus();
                    equal(ua.getChildHTML(body.firstChild), '没有加粗的文本');
                    ua.keydown(editor.body, {'keyCode':89, 'ctrlKey':true});
                    editor.focus();
                    setTimeout(function () {
                        equal(ua.getChildHTML(body.firstChild), '<strong>没有加粗的文本</strong>');
                        UE.delEditor('ue');
                        start();
                    },500);
                }, 100);
            }, 150);
        }, 100);
    });
    stop();
});

