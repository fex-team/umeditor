module( "plugins.removeformat" );

/*trace 3570*/
test( 'trace 3570:对包含超链接的文本清除样式', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p><span style="color:red">hello</span><a href="http://www.baidu.com/" style="font-size: 16pt;">baidu</a></p>' );
    range.selectNode(editor.body.firstChild).select();
    editor.execCommand( 'removeformat' );
    equal(ua.getChildHTML(editor.body), '<p>hello<a href=\"http://www.baidu.com/\" _href=\"http://www.baidu.com/\">baidu</a></p>', '对包含超链接的文本去除样式' );
} );

test( 'trace 3612 清除超链接的颜色', function () {
    var editor = te.obj[2];
    var div = document.body.appendChild( document.createElement( 'div' ) );
    $( div ).css( 'width', '500px' ).css( 'height', '500px' ).css( 'border', '1px solid #ccc' );
    editor.render(div);
    stop();
    setTimeout(function(){
        var range = new UE.dom.Range( te.obj[2].document,te.obj[2].body );
        editor.setContent('<a href="http://www.baidu.com/">baidu</a>');
        range.selectNode(editor.body.firstChild).select();
        editor.execCommand( 'forecolor', 'rgb(255,0,0)' );
        //var html = '<a href="http://www.baidu.com/" _href=\"http://www.baidu.com/\" style="color: rgb(255, 0, 0); text-decoration: underline;"><span style="color: rgb(255, 0, 0);">baidu</span></a>';//editor里得到的是这个结果，mini不是
        //ua.checkHTMLSameStyle( html, editor.document, editor.body.firstChild, '查看加了颜色后超链接的样式' );
        if(ua.browser.ie){
            var html = '<p><a href="http://www.baidu.com/"><span style="color:rgb(255,0,0)">baidu</span></a></p>';
            equal(editor.getContent(editor.body),html,'查看加了颜色后的超链接样式');
        }
        else{
            var html = '<p><a href="http://www.baidu.com/"><span style="color:#ff0000">baidu</span></a></p>';
            equal(editor.getContent(editor.body),html,'查看加了颜色后的超链接样式');
        }
        editor.execCommand( 'removeformat' );
        var cl = ua.browser.ie && ua.browser.ie == 8 ? 'class=\"\"' : "";
        html = '<p><a href=\"http://www.baidu.com/\" _href=\"http://www.baidu.com/\">baidu</a></p>';
        equal(ua.getChildHTML(editor.body),html,'查看清除样式后超链接的样式');
        div.parentNode.removeChild(div);
        start();
    },500);
} );

test( 'trace 3605 清除样式的区域有多个inline元素嵌套', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<p><em><strong>hello1</strong></em></p><p><strong><em>hello2</em></strong></p>' );
    var strs = body.getElementsByTagName( 'strong' );
    range.setStart( strs[0].firstChild, 2 ).setEnd( strs[1].firstChild.lastChild, 3 ).select();
    editor.execCommand( 'removeformat' );
    equal( ua.getChildHTML( body ), '<p><em><strong>he</strong></em>llo1</p><p>hel<strong><em>lo2</em></strong></p>' );
} );



//test( '指定删除某一个span', function () {//不闭合选择chrome下可以，ff下是清除了所有样式，但是手动操作，ff无反应，ie下是样式完全不改变
//    var editor = te.obj[0];
//    var range = te.obj[1];
//    var body = editor.body;
//    editor.setContent( '<p><span style="color:blue;"></span>hello2<span style="color:red;font-size: 12px"></span></p>' );
//    range.selectNode(body.firstChild).select();
//    editor.execCommand( 'removeformat');
//   // ua.checkHTMLSameStyle('hello2<span style="font-size: 12px"></span>',editor.document,body.firstChild,'清除span corlor');
//    //equal(editor.getContent(editor.body),'<p>hello2<span style="font-size: 12px"></span><p>','清除');
//    equal(ua.getChildHTML(body),'<p>hello2<span style="color:red;font-size: 12px"></span></p>');
//} );



test( '不闭合方式清除样式', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<p><em><strong>hello1</strong></em></p><p><strong><em>hello2</em></strong></p>' );
    //range.setStart( body.firstChild.firstChild, 0 ).collapse( 1 ).select();
    range.selectNode(body.firstChild.firstChild).select();
    editor.execCommand( 'removeformat' );
    equal( ua.getChildHTML( body ), '<p>hello1</p><p><strong><em>hello2</em></strong></p>' );
} );