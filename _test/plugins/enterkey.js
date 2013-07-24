module( 'plugins.enterkey' );

test( 'br做回车,选区非闭合', function () {
    te.dom[0].parentNode.removeChild(te.dom[0]);
    var div2 = document.body.appendChild( document.createElement( 'div' ) );
    $( div2 ).css( 'width', '500px' ).css( 'height', '500px' ).css( 'border', '1px solid #ccc' );
    te.dom.push(div2);
    UE.plugins.table = function(){};
    var editor = new UE.Editor({'initialContent':'<p>欢迎使用ueditor</p>','autoFloatEnabled':false,'enterTag':'br'});
    te.obj.push(editor);
    editor.render(div2);
    stop();
    editor.ready(function(){
        var range = new UE.dom.Range( editor.document );
        te.obj.push(range);
        editor.setContent('<p>hello</p>' );
        te.obj[4].setStart(editor.body.firstChild.firstChild,1).setEnd(editor.body.firstChild.firstChild,3).select();
        ua.keydown(editor.body,{'keyCode':13});
        setTimeout(function(){
            ua.manualDeleteFillData(te.obj[3].body);
            var html = 'h<br>lo';
            equal(ua.getChildHTML(te.obj[3].body.firstChild),html,'<br>做回车');
            editor.setContent('<h1>hello<br></h1><p><img src="http://img.baidu.com/hi/jx2/j_0015.gif" /><a href="http://www.baidu.com"></a></p>' );
            te.obj[4].setStart( editor.body.lastChild,0 ).setEnd(editor.body.lastChild,1).select();
            ua.keydown(editor.body,{'keyCode':13});
            setTimeout(function(){
                ua.manualDeleteFillData(te.obj[3].body);
                var html = 'hello<br>';
                equal(ua.getChildHTML(te.obj[3].body.firstChild),html,'<br>做回车');
                editor.setContent('<h1>hello<br></h1><p>he<img src="http://img.baidu.com/hi/jx2/j_0015.gif" />oll</p>' );
                te.obj[4].setStart( editor.body.lastChild,1 ).setEnd(editor.body.lastChild,2).select();
                ua.keydown(editor.body,{'keyCode':13});
                setTimeout(function(){
                    ua.manualDeleteFillData(te.obj[3].body);
                    var html = 'hello<br>';
                    equal(ua.getChildHTML(te.obj[3].body.firstChild),html,'<br>做回车');
                    editor.setContent('<h1>hello<br></h1><p><img src="http://img.baidu.com/hi/jx2/j_0015.gif" /><br></p>' );
                    te.obj[4].setStart( editor.body.lastChild,0 ).setEnd(editor.body.lastChild,1).select();
                    ua.keydown(editor.body,{'keyCode':13});
                    setTimeout(function(){
                        ua.manualDeleteFillData(te.obj[3].body);
                        var html = 'hello<br>';
                        equal(ua.getChildHTML(te.obj[3].body.firstChild),html,'<br>做回车');
                        editor.setContent('<h1>hello<br></h1><p><img src="http://img.baidu.com/hi/jx2/j_0015.gif" /><a href="http://www.baidu.com">www.baidu.com</a></p>' );
                        te.obj[4].setStart( editor.body.lastChild,0 ).setEnd(editor.body.lastChild,1).select();
                        ua.keydown(editor.body,{'keyCode':13});
                        setTimeout(function(){
                            ua.manualDeleteFillData(te.obj[3].body);
                            var html = 'hello<br>';
                            equal(ua.getChildHTML(te.obj[3].body.firstChild),html,'<br>做回车');
                            te.dom[1].parentNode.removeChild(te.dom[1]);
                            start();
                        },20);
                    },20);
                },20);
            },20);
        },20);
    });
} );

test( 'br做回车，选区闭合', function () {
    te.dom[0].parentNode.removeChild(te.dom[0]);
    var div2 = document.body.appendChild( document.createElement( 'div' ) );
    $( div2 ).css( 'width', '500px' ).css( 'height', '500px' ).css( 'border', '1px solid #ccc' );
    te.dom.push(div2);
    UE.plugins.table = function(){};
    var editor = new UE.Editor({'initialContent':'<p>欢迎使用ueditor</p>','autoFloatEnabled':false,'enterTag':'br'});
    te.obj.push(editor);
    editor.render(div2);
    stop();
    editor.ready(function () {
        var range = new UE.dom.Range(editor.document);
        te.obj.push(range);
        editor.setContent('<p>hello</p>');

        setTimeout(function () {
            te.obj[4].setStart(editor.body.firstChild.firstChild, 1).collapse(true).select();
            ua.keydown(editor.body, {'keyCode':13});
            setTimeout(function () {
                ua.manualDeleteFillData(te.obj[3].body);
                var html = 'h<br>ello';
                equal(ua.getChildHTML(te.obj[3].body.firstChild), html, '<br>做回车，选区闭合');
                te.dom[1].parentNode.removeChild(te.dom[1]);
                start();
            }, 50);
        }, 50);
    });
} );

test( 'br做回车，选区闭合,在节点尾部输入回车，要插入2个br', function () {
    te.dom[0].parentNode.removeChild(te.dom[0]);
    var div2 = document.body.appendChild( document.createElement( 'div' ) );
    $(div2).css('width', '500px').css('height', '500px').css('border', '1px solid #ccc');
    te.dom.push(div2);
    UE.plugins.table = function () {
    };
    var editor = new UE.Editor({'initialContent':'<p>欢迎使用ueditor</p>', 'autoFloatEnabled':false, 'enterTag':'br'});
    te.obj.push(editor);
    editor.render(div2);
    stop();
    editor.ready(function () {
        var range = new UE.dom.Range(editor.document);
        te.obj.push(range);
        editor.setContent('<p>hello</p>');
        setTimeout(function () {
            te.obj[4].setStart(editor.body.firstChild.firstChild, 5).collapse(true).select();
            ua.keydown(editor.body, {'keyCode':13});
            setTimeout(function () {
                ua.manualDeleteFillData(te.obj[3].body);
                var html = 'hello<br><br>';
                equal(ua.getChildHTML(te.obj[3].body.firstChild), html, '<br>做回车，选区闭合,在节点尾部输入回车');
                te.dom[1].parentNode.removeChild(te.dom[1]);
                start();
            }, 50);
        }, 50);
    });
});


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
