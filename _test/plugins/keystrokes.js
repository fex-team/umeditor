/**
 * Created by JetBrains PhpStorm.
 * User: dongyancen
 * Date: 12-10-9
 * Time: 下午6:52
 * To change this template use File | Settings | File Templates.
 */
module( "plugins.keystrokes" );

test('trace 3613 删除br标签',function(){
    var editor = te.obj[0];
    editor.setContent('<p><img src="http://img.baidu.com/hi/jx2/j_0015.gif"/><br/></p><p><em>hello1</em></p>');
    var range = te.obj[1];
    setTimeout(function(){
        range.setStart( editor.body.firstChild,2 ).collapse(true).select();
        ua.keydown(editor.body,{'keyCode':8});
        ua.keyup(editor.body,{'keyCode':8});
        equal(ua.getChildHTML(te.obj[0].body),'<p><img src=\"http://img.baidu.com/hi/jx2/j_0015.gif\"></p><p><em>hello1</em></p>','删除br标签');
        start();
    },20);
    stop();
});


test('删除块元素，块元素在后',function(){
    var editor = te.obj[0];
    editor.setContent( '<h1>hello<br></h1><h2><img src="http://img.baidu.com/hi/jx2/j_0015.gif" /></h2>' );
    var range = te.obj[1];
    setTimeout(function(){
        range.setStart( editor.body.lastChild.lastChild,0 ).setEnd(editor.body.lastChild.lastChild,1).select();
        ua.keydown(editor.body,{'keyCode':8});
        ua.keyup(editor.body,{'keyCode':8});
        setTimeout(function(){
            equal(te.obj[0].undoManger.index,1,'');
            var html = '<h1>hello<br></h1>';
            if(!ua.browser.opera)
                equal(ua.getChildHTML(te.obj[0].body),html,'删除块元素');
            start();
        },20);
    },20);
    stop();
});

test('删除块元素，块元素在前',function(){
    var editor = te.obj[0];
    editor.setContent( '<h2><img src="http://img.baidu.com/hi/jx2/j_0015.gif" /></h2><h1>hello<br></h1>' );
    var range = te.obj[1];
    setTimeout(function(){
        range.setStart( editor.body.firstChild,0 ).setEnd(editor.body.firstChild,1).select();
        ua.keydown(editor.body,{'keyCode':8});
        ua.keyup(editor.body,{'keyCode':8});
        setTimeout(function(){
            equal(te.obj[0].undoManger.index,1,'');
            var html = '<h1>hello<br></h1>';
            equal(ua.getChildHTML(te.obj[0].body),html,'删除块元素');
            start();
        },20);
    },20);
    stop();
});


test('删除自闭合标签',function(){
    var editor = te.obj[0];
    editor.setContent( '<h1>hello<br></h1><p>he<img src="http://img.baidu.com/hi/jx2/j_0015.gif" />oll</p>' );
    var range = te.obj[1];
    setTimeout(function(){
        range.setStart( editor.body.lastChild,1 ).setEnd(editor.body.lastChild,2).select();
        ua.keydown(editor.body,{'keyCode':8});
        ua.keyup(editor.body,{'keyCode':8});
        setTimeout(function(){
            equal(te.obj[0].undoManger.index,1,'');
            var html = '<h1>hello<br></h1><p>heoll</p>';
            equal(ua.getChildHTML(te.obj[0].body),html,'删除自闭合标签');
            start();
        },20);
    },20);
    stop();
});

test('全选后，退格，剩下空p',function(){
    var editor = te.obj[0];
    editor.setContent( 'hello' );
    var range = te.obj[1];
    range.selectNode( editor.body.firstChild ).select();
    editor.execCommand( 'bold' );
    editor.execCommand('selectall');
    ua.keydown(editor.body,{'keyCode':8});
    ua.keyup(editor.body,{'keyCode':8});
    stop();
    setTimeout(function(){
        var br = ua.browser.ie?'':'<br>';
        equal(ua.getChildHTML(te.obj[0].body),'<p>'+br+'</p>','全选后，退格，剩下空p');
        start();
    },20);
});


//todo 这个检查存在问题，如何检查 evt.preventDefault();？
test('在h1内输入del',function(){
    var editor = te.obj[0];
    editor.setContent( '<h1><br></h1><p>hello</p>' );
    var range = te.obj[1];
    setTimeout(function(){
        range.setStart(editor.body.childNodes[0],0).collapse(true).select(true);
        ua.keydown(te.obj[0].body,{'keyCode':46});
        ua.keyup(te.obj[0].body,{'keyCode':46});
        setTimeout(function(){
            equal(ua.getChildHTML(te.obj[0].body),'<h1><br></h1><p>hello</p>','在h1内输入del');
            start();
        },20);
    },20);
    stop();
});


test( '删除inline的标签', function() {
    var editor = te.obj[0];
    editor.setContent( '<p><strong><em>hello world</em><span>wasai</span></strong></p>' );
    var range = te.obj[1];
    setTimeout(function(){
        var strong = editor.body.firstChild.firstChild;
        range.selectNode( strong ).select();
        ua.keydown(editor.body,{'keyCode':8});
        ua.keyup(editor.body,{'keyCode':8});
        setTimeout(function(){
            ua.manualDeleteFillData( editor.body );
            equal( editor.body.firstChild.tagName.toLowerCase(), 'p', 'strong 以及子inline节点都被删除' );
            if ( !ua.browser.ie )
                equal( editor.body.lastChild.innerHTML, '<br>', '内容被删除了' );
            else
                equal( editor.body.lastChild.innerHTML, '', '内容被删除了' );
            start();
        },20);
    },20);
    stop();
} );

/*trace 1089*/
test( '跨行选择2个块元素', function() {
    var editor = te.obj[0];
    editor.setContent( '<p><strong>hello world<span>wasai</span></strong></p><div><em><span>hello 2</span></em></div>' );
    var range = te.obj[1];
    setTimeout(function(){
        var body = editor.body;
        range.setStart( body.firstChild, 0 ).setEnd( body.lastChild,1 ).select();
        ua.keydown(editor.body,{'keyCode':8});
        ua.keyup(editor.body,{'keyCode':8});
        setTimeout(function(){
            ua.manualDeleteFillData( editor.body );
            range = editor.selection.getRange();
            equal( body.childNodes.length, 1, 'div被删除，保留p' );
            var br = ua.browser.ie?"":"<br>";
            equal( ua.getChildHTML( body ), '<p>'+br+'</p>' );
            start();
        },20);
    },20);
    stop();
} );

//test('删除空节点 ',function(){
//        var editor = te.obj[0];
//        editor.setContent('<p><em><span style="color: red"><br></span></em></p>') ;
//        var range = te.obj[1];
//        setTimeout(function(){
//            range.setStartAtFirst(editor.body.getElementsByTagName('span')[0]).collapse(true).select(true);
//            ua.keyup(te.obj[0].body,{'keyCode':8});
//            setTimeout(function(){
//                var br = ua.browser.ie?'':'<br>';
//                equal(ua.getChildHTML(editor.body),'<p>'+br+'</p>','删除空节点');
//                start();
//            },20);
//        },20);
//        stop();
//});