module( 'plugins.enterkey' );

///*不作处理chrome会产生div*/
test( 'chrome删除div', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    if(ua.browser.chrome){
        editor.body.innerHTML = '<h1>一级标题</h1><div><br/></div>';
        range.setStart( body.firstChild.firstChild, 4 ).collapse( 1 ).select();
        ua.keydown(editor.body,{'keyCode':13});
        range.selectNode(body.lastChild).select();
        var index = editor.undoManger.index;
        var br = ua.browser.ie ? '' : '<br>';
        ua.keyup(editor.body,{'keyCode':13});
        equal(editor.undoManger.list.length,2,'保存现场');
        setTimeout( function () {
            equal( body.childNodes.length, 2, '2个子节点' );
            equal(body.lastChild.tagName.toLowerCase(),'p','div转成p');
            equal(ua.getChildHTML(body),'<h1>一级标题</h1><p><br></p>','检查内容');
            start();
        }, 60 );
        stop();
    }else{
    }
} );
test( 'formatBlock', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<table><tbody><tr><td>  hello1</td><td ></td></tr><tr><td >hello2</td><td ></td></tr></tbody></table>' );
    var tds = editor.body.getElementsByTagName('td');
    range.setStart(tds[0],1).collapse(true).select();
    ua.keydown(editor.body,{'keyCode':13});
    setTimeout( function () {
        ua.keyup(editor.body,{'keyCode':13});
        setTimeout( function () {
            var td = editor.body.getElementsByTagName('td')[0];
            equal(td.firstChild&&td.firstChild.tagName.toLowerCase(),'p','加上p');
            equal(td.firstChild.innerHTML,'hello1','hello1');
            start();
        }, 60 );
    }, 60 );
    stop();
} );
test( '跨td不删', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<table><tbody><tr><td>  hello1</td><td ></td></tr><tr><td >hello2</td><td ></td></tr></tbody></table>' );
    var tds = editor.body.getElementsByTagName('td');
    range.setStart(tds[0],0).setEnd(tds[2],1).select();
    editor.addListener("keydown", function (type, evt) {
        setTimeout( function () {
            ok(evt.defaultPrevented||!evt.returnValue, "keydown");
            start();
        }, 60 );
    });
    ua.keydown(editor.body,{'keyCode':13});
    stop();
} );