module( "plugins.link" );

/*trace 879*/
test( '同时去多个超链接', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p><a href="http://www.baidu.com/">hello</a>first<a href="http://www.google.com/">second</a></p><p>third<a href="http://www.sina.com/">sina</a></p><table><tbody><tr><td><a href="http://www.baidu.com/">baidu</a></td></tr></tbody></table>' );
    stop();
    setTimeout(function () {
    range.selectNodeContents( editor.body ).select();
    editor.execCommand( 'unlink' );
    equal( editor.body.firstChild.innerHTML, 'hellofirstsecond', '第一段去掉超链接' );
    equal( editor.body.firstChild.nextSibling.innerHTML, 'thirdsina', '第二段去掉超链接' );
    start();
    }, 100);
} );

test( '光标闭合且没有超链接', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p>hello</p>' );
    range.setStart( editor.body.firstChild, 0 ).collapse( 1 ).select();
    editor.execCommand( 'unlink' );
    equal( ua.getChildHTML( editor.body ), '<p>hello</p>', '没有超链接什么都不做' );
} );


//test( '给图片添加超链接', function () {//ie8下无法选中 单个图像节点
//    var editor = te.obj[0];
//    var range = te.obj[1];
//    editor.setContent( '<p><img  style="width: 200px;height: 200px" src="http://umeditor.baidu.com/img/logo.png">hello</p>' );
//    range.selectNode( editor.body.firstChild.firstChild ).select();
//    editor.execCommand( 'link', {href:'http://www.baidu.com/'} );
//    //var html = '<a  href="http://www.baidu.com/" ><img  src="http://umeditor.baidu.com/img/logo.png" _src=\"http://umeditor.baidu.com/img/logo.png" style="width: 200px;height: 200px" ></a>hello';
//    var html1 = '<a href=\"http://www.baidu.com/\"><img style=\"width: 200px;height: 200px\" src=\"http://umeditor.baidu.com/img/logo.png\"></a>hello';
//    if(ua.browser.ie)
//        ua.checkHTMLSameStyle( html1, editor.document, editor.body.firstChild, '给图片添加超链接' );
//    else
//        equal(editor.body.firstChild.innerHTML.toLowerCase(),html1,'给图片添加超链接');
//} );

test( '去除链接--选中区域包含超链接和非超链接', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<p>hello</p><p>hello2<a href="www.fanfou.com">famfou</a>hello3</p>' );
    range.setStart( body.firstChild, 0 ).setEnd( body.lastChild, 3 ).select();
    editor.execCommand('unlink');
    var html = '<p>hello</p><p>hello2famfouhello3</p>';
    equal(editor.getContent(editor.body),html,'去掉选中区域中的超链接');
} );


test( '插入超链接', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p>hello</p>' );
    range.setStart( editor.body.firstChild, 1 ).collapse( 1 ).select();
    editor.execCommand( 'link', {href:'www.baidu.com'} );
    var a = editor.body.getElementsByTagName( 'a' )[0];
    range.selectNode( a ).select();
    range = editor.selection.getRange();
    same( editor.queryCommandValue( 'link' ), a, 'link value is a' );
    equal( ua.getChildHTML( editor.body ), '<p>hello<a href="www.baidu.com">www.baidu.com</a></p>' );
    equal( editor.queryCommandState( 'unlink' ), 0, 'link state is 0' );
} );

test( '对现有的超链接修改超链接地址', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<p><a href="http://www.baidu.com">http://www.baidu.com</a>hello<a href="www.google.com">google</a></p>' );
    var a1 = body.firstChild.firstChild;
    range.selectNode( a1 ).select();

    editor.execCommand( 'link', {href:'ueditor.baidu.com'} );
    a1 = body.firstChild.firstChild;
    equal( a1.getAttribute( 'href' ), 'ueditor.baidu.com', 'check href' );
    //equal( a1.innerHTML, 'umeditor.baidu.com', 'innerHTML也相应变化' );  //ff下的超链接和取消都不好用   显示演示的是会改变  ie和chrome的是不会改变(有问题，要确认一下)

    var a2 = body.firstChild.getElementsByTagName( 'a' )[1];
    range.selectNode( a2 ).select();
    editor.execCommand( 'link', {href:'mp3.baidu.com'} );
    a2 = body.firstChild.getElementsByTagName( 'a' )[1];

    equal( a2.getAttribute( 'href' ), 'mp3.baidu.com', 'check href for second a link' );
    equal( a2.innerHTML, 'google', 'innerHTML不变' );
} );


