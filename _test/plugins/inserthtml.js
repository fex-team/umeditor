module( "plugins.inserthtml" );

test( 'trace 3301：闭合方式插入文本', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<p><br></p>' );
    range.setStart( body.firstChild, 0 ).collapse( 1 ).select();
    editor.execCommand( 'inserthtml', 'hello2' );
    equal( ua.getChildHTML( body ), '<p>hello2<br></p>', '插入文本节点' );
} );

//刘表中插入img
test( '列表中插入img', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<ol><li><p></p></li></ol>');
    var lis = editor.body.getElementsByTagName('li');
    range.setStart( lis[0], 0 ).collapse(true).select();
    editor.execCommand( 'insertimage', {src:'http://img.baidu.com/hi/jx2/j_0001.gif', width:50, height:51} );
    stop();
    setTimeout(function(){
        equal(lis.length,1,'列表长度没有变化');
        ua.manualDeleteFillData(lis[0]);
        if(ua.browser.ie){
            equal(lis[0].firstChild.firstChild.tagName.toLowerCase(),'img','列表中插入img');
            equal(lis[0].firstChild.firstChild.attributes['src'].nodeValue,'http://img.baidu.com/hi/jx2/j_0001.gif','列表中插入img');
        }
        else{
            equal(lis[0].firstChild.tagName.toLowerCase(),'img','列表中插入img');
            equal(lis[0].firstChild.attributes['src'].nodeValue,'http://img.baidu.com/hi/jx2/j_0001.gif','列表中插入img');
        }
        start();
    },50);
});