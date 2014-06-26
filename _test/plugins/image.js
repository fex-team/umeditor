module( 'plugins.image' );
/**
 * 插入视频
 * 插入图像
 * 选区闭合和不闭合
 * 表格中插入图像
 */
test('trace:3886:多实例插入图片',function(){
    var editor = te.obj[0];
    var body = editor.body;
    var range = te.obj[1];
    editor.setContent("<p>123</p>");
    var text = body.firstChild.firstChild;
    range.setStart(text,'0').collapse(true).select();
    var div2 = document.body.appendChild(document.createElement('div'));
    $(div2).css('width', '500px').css('height', '200px').css('border', '1px solid #ccc');
    div2.id = 'testDefault2';
    te.obj[2].render(div2);
    editor.execCommand('insertimage',{
        src:'http://img.baidu.com/hi/jx2/j_0001.gif',
        width:50,
        height:52
    });
    te.obj[2].execCommand('insertimage',{
        src:'http://img.baidu.com/hi/jx2/j_0002.gif',
        width:50,
        height:52
    });
    equal($('img')[0].src,'http://img.baidu.com/hi/jx2/j_0001.gif','实例1，插入图片成功');
    equal($('img')[1].src,'http://img.baidu.com/hi/jx2/j_0002.gif','实例2，插入图片成功');
    stop();
    setTimeout(function(){
        $(div2).remove();
        start();
    },100);
});
test( '插入新图像', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<p><br></p>' );
    range.setStart( body.firstChild, 0 ).collapse( 1 ).select();
    editor.execCommand( 'insertimage', {src:'http://img.baidu.com/hi/jx2/j_0001.gif', width:50, height:52} );

    stop();
    setTimeout(function(){
        ua.manualDeleteFillData( editor.body );
        var img = body.getElementsByTagName( 'img' )[0];
        equal( img.getAttribute( 'src' ), 'http://img.baidu.com/hi/jx2/j_0001.gif', '比较src' );
        equal( img.getAttribute( 'width' ), '50', '比较width' );
        equal( img.getAttribute( 'height' ), '52', '比较height' );
        start();
    },100);
} );

test( '不设宽高，插入图片', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<p><br></p>' );
    range.setStart( body.firstChild, 0 ).collapse( 1 ).select();
    editor.execCommand( 'insertimage', {src:'http://img.baidu.com/hi/jx2/j_0001.gif'} );
    stop();
    setTimeout(function(){
        ua.manualDeleteFillData( editor.body );
        var img = body.getElementsByTagName( 'img' )[0];
        equal( img.getAttribute( 'src' ), 'http://img.baidu.com/hi/jx2/j_0001.gif', '比较src' );
        start();
    },100);
} );

test( '插入对齐方式为居中对齐的图像，新建一个p，在p上设置居中对齐', function () {//三个浏览器都不可以
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<p>hello</p>' );
    range.setStart( body.firstChild, 0 ).collapse( 1 ).select();
    editor.execCommand( 'insertimage', {src:'http://img.baidu.com/hi/jx2/j_0001.gif', width:50, height:51, floatStyle:'center'} );
    stop();
    setTimeout(function(){
        ua.manualDeleteFillData( editor.body );

        var img = body.getElementsByTagName( 'img' )[0];
        equal( body.childNodes.length, 2, '2个p' );
        var p = body.firstChild;
        equal( p.style['textAlign'], 'center', '居中对齐' );
        ok( p.nextSibling.innerHTML.indexOf( 'hello' ) > -1, '第二个p里面是hello' );      //1.2版本在FF中，hello前有不可见字符
        if ( UM.browser.ie )
                equal( img.style['styleFloat'], '', 'float为空' );
        else
                equal( img.style['cssFloat'], '', 'float为空' );
        equal( img.getAttribute( 'src' ), 'http://img.baidu.com/hi/jx2/j_0001.gif', '比较src' );
        equal( img.getAttribute( 'width' ), '50', '比较width' );
        equal( img.getAttribute( 'height' ), '51', '比较height' );
        start();
    },100);
} );


test( 'trace:3600  修改已有图片的属性', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<p><img src="http://img.baidu.com/hi/jx2/j_0004.gif" >hello<img src="http://img.baidu.com/hi/jx2/j_0010.gif" ></p>' );
    setTimeout(function(){
        //range.selectNode( body.firstChild.firstChild).select();//ie8下，无法单独选中图片节点,
        range.setStart(body.firstChild.firstChild,0).setEnd(body.firstChild.childNodes[1],2).select();
        editor.execCommand( 'insertimage', {src:'http://img.baidu.com/hi/jx2/j_0018.gif'} );
        equal( ua.getChildHTML( body.firstChild ), '<img src="http://img.baidu.com/hi/jx2/j_0018.gif">llo<img src="http://img.baidu.com/hi/jx2/j_0010.gif">', '检查插入的图像地址' );
        equal( body.firstChild.childNodes.length, 3, '2个img孩子' );
        start();
    },50);
    stop();
} );

test( 'trace3574 替换图片', function () {  //这个用例的问题  应该是像是没有给用例足够的时间执行一样  所以得到的是undefined，当我一步一步调试的时候，chrome下是通过的
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<p><br></p>' );
    range.setStart( body.firstChild, 0 ).collapse( 1 ).select();
    editor.execCommand( 'insertimage', {src:'../data/test.JPG'} );
    ua.manualDeleteFillData( editor.body );
    range.selectNode( body.firstChild.firstChild ).select();
    editor.execCommand( 'insertimage', {src:'../data/test.JPG', width:'50', height:'80'} );
    var img = body.getElementsByTagName( 'img' )[0];
    equal(img.getAttribute('width'),'50','比较width');
    equal(img.getAttribute('height'),'80','比较width');
    ok(/data\/test\.JPG/.test( img.getAttribute( 'src' )), '比较src' );
} );


test( '选区不闭合插入图像', function () {

    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<p>hello1</p><p>hello2<img src="http://img.baidu.com/hi/jx2/j_0004.gif"></p>' );
    setTimeout(function(){
        range.setStart( body.firstChild.firstChild, 2 ).setEnd( body.lastChild, 2 ).select();
        editor.execCommand( 'insertimage', {src:'http://img.baidu.com/hi/jx2/j_0016.gif', width:'100', height:'100'} );
        setTimeout(function(){
            ua.manualDeleteFillData( editor.body );
            equal( body.childNodes.length, 1, '只有一个p' );
            ua.clearWhiteNode(body.firstChild);
            var img = body.getElementsByTagName('img')[0];
            equal( img.getAttribute( 'src' ), 'http://img.baidu.com/hi/jx2/j_0016.gif', '比较src' );
            equal( img.getAttribute( 'width' ), '100', '比较width' );
            equal( img.getAttribute( 'height' ), '100', '比较height' );
            start();
        },50);

    },50);
    stop();
} );

test( '一次插入多张图片', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<p><br></p>' );
    setTimeout(function(){
        range.setStart( body.firstChild, 0 ).collapse( 1 ).select();
        editor.execCommand( 'insertimage', [{src:'http://img.baidu.com/hi/jx2/j_0001.gif', width:50, height:52},
            {src:'http://img.baidu.com/hi/jx2/j_0002.gif', width:51, height:52},
            {src:'http://img.baidu.com/hi/jx2/j_0003.gif', width:52, height:53} ] );
        setTimeout(function(){
            ua.manualDeleteFillData( editor.body );
            var img = body.getElementsByTagName( 'img' )[0];
            equal( img.getAttribute( 'src' ), 'http://img.baidu.com/hi/jx2/j_0001.gif', '比较src' );
            equal( img.getAttribute( 'width' ), '50', '比较width' );
            equal( img.getAttribute( 'height' ), '52', '比较height' );
            img = body.getElementsByTagName( 'img' )[1];
            equal( img.getAttribute( 'src' ), 'http://img.baidu.com/hi/jx2/j_0002.gif', '比较src' );
            equal( img.getAttribute( 'width' ), '51', '比较width' );
            equal( img.getAttribute( 'height' ), '52', '比较height' );
            img = body.getElementsByTagName( 'img' )[2];
            equal( img.getAttribute( 'src' ), 'http://img.baidu.com/hi/jx2/j_0003.gif', '比较src' );
            equal( img.getAttribute( 'width' ), '52', '比较width' );
            equal( img.getAttribute( 'height' ), '53', '比较height' );
            start();
        },50);
    },50);
    stop();
} );
