/**
 * Created with JetBrains PhpStorm.
 * User: xuheng
 * Date: 13-8-21
 * Time: 上午10:49
 * To change this template use File | Settings | File Templates.
 */
module( 'adapter.adapter' );

test('getEditor--delEditor',function(){
    var div = document.createElement('div');
    div.id='editor2';
    document.body.appendChild(div);
    var ue7=UE.getEditor('editor2');
    ue7.ready(function(){
        var ue8=UE.getEditor('editor2');
        equal(ue8.uid,ue7.uid);
        UE.delEditor('editor2');
        equal(document.getElementById('editor2').tagName.toLowerCase(),'textarea');
    });
});

test( 'render没有内容时，显示initialContent', function() {
    var sc4 = document.createElement("script");
    sc4.id="sc4";
    document.body.appendChild(sc4);
    var ue4=UE.getEditor('sc4');
    stop();
    ue4.ready(function(){
        equal(ue4.body.firstChild.innerHTML.toLowerCase(),ue4.options.initialContent.toLowerCase(),'标签没有内容，显示initialContent');
        sc4 = document.getElementById('sc4');
        sc4.parentNode.removeChild(sc4);
        start();
    });
} );

test( '判断render有内容时，显示render内容(script)', function() {
    var sc3 = document.createElement("script");
    sc3.id="sc3";
    sc3.type="text/plain";
    sc3.text= 'renderinnerhtml';
    document.body.appendChild(sc3);
    var ue3=UE.getEditor('sc3');
    stop();
    ue3.ready(function(){
        equal(ue3.body.firstChild.innerHTML.toLowerCase(),"renderinnerhtml",'标签有内容,显示标签内容');
        sc3 = document.getElementById('sc3');
        sc3.parentNode.removeChild(sc3);
        start();
    });
} );