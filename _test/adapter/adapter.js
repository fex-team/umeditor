/**
 * Created with JetBrains PhpStorm.
 * User: xuheng
 * Date: 13-8-21
 * Time: 上午10:49
 * To change this template use File | Settings | File Templates.
 */
module( 'adapter.adapter' );

test('getEditor',function(){
    var div = document.createElement('div');
    div.id='editor';
    var con=document.createElement('div');
    con.id="contest";
    con.appendChild(div);
    document.body.appendChild(con);
    var ue7=UM.getEditor('editor');
    var ue8=UM.getEditor('editor');

    stop();
    ue8.ready(function(){
        equal(ue8.uid,ue7.uid,'');
        setTimeout(function(){
            UM.delEditor('editor');
            var editor=document.getElementById('editor');
            editor.parentNode.removeChild(editor);
            start();
        },100)
    });
});

test('delEditor',function(){
    var div = document.createElement('div');
    div.id='editor';
    document.body.appendChild(div);
    var ue=UM.getEditor('editor');
    stop();
    ue.ready(function(){
        setTimeout(function(){
            UM.delEditor('editor');
            equal(document.getElementById('editor').tagName.toLowerCase(),'textarea');
            var div=document.getElementById("editor")
            div.parentNode.removeChild(div);
            start();
        },100)
    });
});

test( 'trace 3623 render没有内容时，显示initialContent', function() {
    var sc4 = document.createElement("script");
    sc4.id="sc4";
    sc4.style.width ="800px";
//    sc4.height = "100px";
    document.body.appendChild(sc4);
    var ue4=UM.getEditor('sc4');
    stop();
    ue4.ready(function(){
        equal(ue4.getContent().toLowerCase(),ue4.options.initialContent.toLowerCase(),'标签没有内容，显示initialContent');
        setTimeout(function(){
            UM.delEditor('sc4');
            var editor=document.getElementById('sc4');
            editor.parentNode.removeChild(editor);
            start();
        },200)
    });
} );

test( '判断render有内容时，显示render内容(script)', function() {
    var sc3 = document.createElement("script");
    sc3.id="sc3";
    sc3.type="text/plain";
    sc3.style.width ="800px";

    sc3.text= 'renderinnerhtml';
    document.body.appendChild(sc3);
    var ue3=UM.getEditor('sc3');
    stop();
    ue3.ready(function(){
        equal(ue3.body.firstChild.innerHTML.toLowerCase(),"renderinnerhtml",'标签有内容,显示标签内容');

        setTimeout(function(){
            UM.delEditor('sc3');
            var editor=document.getElementById('sc3');
            editor.parentNode.removeChild(editor);
            start();
        },100)
    });
});