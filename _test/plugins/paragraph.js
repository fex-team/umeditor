module( "plugins.paragraph" );
/**
 * h1和p之间的转换
 * 表格中添加p和h1
 * 列表里加h1
 * 传入2个参数，style和attrs
 */

test( 'trace:3595:不闭合h1和p之间的转换', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<p>hello</p>' );
    setTimeout(function(){
    range.selectNode( body.firstChild.firstChild ).select();
    /*p===>h1*/
    var block = ua.browser.ie?'标题 1':'h1';
    editor.execCommand( 'paragraph', 'h1' );
    equal( ua.getChildHTML( body ), '<h1>hello</h1>' );
    equal( editor.queryCommandValue( 'paragraph' ), block, '当前的block元素为h1' );
    /*h1===>p*/
    range.selectNode( body.firstChild.firstChild ).select();
    editor.execCommand( 'paragraph', 'p' );
    equal( ua.getChildHTML( body ), '<p>hello</p>' );
    /*多个段落的部分文本*/
    var block = ua.browser.ie?'标题 3':'h3';
    editor.setContent( '<p>hello</p><h2>hello2</h2>' );
        setTimeout(function(){
    range.setStart( body.firstChild.firstChild, 2 ).setEnd( body.lastChild.firstChild, 1 ).select();
    editor.execCommand( 'paragraph', 'h3' );
    equal( ua.getChildHTML( body ), '<h3>hello</h3><h3>hello2</h3>' );
    equal( editor.queryCommandValue( 'paragraph' ), block, '当前的block元素为h3' );
        start();
    },50);
    },50);
    stop();
} );

test( '闭合h1和p之间的转换', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<p>hello</p><p>hello2</p>' );
    setTimeout(function(){
    range.setStart( body.firstChild.firstChild, 1 ).collapse( 1 ).select();
    /*p===>h1*/
    editor.execCommand( 'paragraph', 'h1' );
    equal( ua.getChildHTML( body ), '<h1>hello</h1><p>hello2</p>' );
    /*h1===>p*/
    var block = ua.browser.ie?'普通':'p';
    range.setStart( body.firstChild.firstChild, 1 ).collapse( 1 ).select();
    editor.execCommand( 'paragraph', 'p' );
    equal( ua.getChildHTML( body ), '<p>hello</p><p>hello2</p>' );
    range.setStart(body.lastChild.firstChild,0).collapse(1).select();
    equal( editor.queryCommandValue( 'paragraph' ), block, '当前的block元素为p' );
        start();
    },50);

stop();
} );

