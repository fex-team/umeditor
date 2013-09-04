module("core.Selection");

test('getRange--闭合选区的边界情况', function () {
    var div_new = document.createElement('div');
    document.body.appendChild(div_new);
    var editor = new UE.Editor({'autoFloatEnabled': false});
    stop();
    setTimeout(function () {
        editor.render(div_new);
        editor.ready(function () {
            setTimeout(function () {
                var range = new UE.dom.Range(editor.document,editor.body);
                editor.setContent('<p><strong>xxx</strong></p>');
                range.setStart(editor.body.firstChild.firstChild, 0).collapse(true).select();
                range = editor.selection.getRange();
                var strong = editor.body.firstChild.firstChild;
                if(ua.browser.ie&&ua.browser.ie>8){//todo ie9,10改range
                    ok(range.startContainer === strong,'startContainer是strong');
                    ok(range.startOffset == 1,'startOffset是1')
                }
                else{
                    ok(range.startContainer.nodeType == 3, 'startContainer是文本节点');
                    /*startContainer:ie is xxx,others are strong.firstChild*/
                    ok(( range.startContainer === strong.firstChild) && strong.firstChild.length == 1 || (range.startContainer.nodeValue.length == 3 && range.startContainer === strong.lastChild), 'startContainer是xxx左边的占位符或者xxx');
                }
                ua.manualDeleteFillData(editor.body);
                range.setStart(editor.body.firstChild.firstChild, 1).collapse(true).select();
                /*去掉占位符*/
                range = editor.selection.getRange();
                /*可能为(strong，1)或者(xxx，3)*/
                ok(( range.startContainer === strong) || ( range.startContainer === strong.lastChild) && strong.lastChild.length == 1 || (range.startContainer.nodeValue.length == 3 && range.startContainer === strong.firstChild), 'startContainer是xxx或者xxx右边的占位符');
//    ok( range.startContainer.nodeType == 1 ? range.startContainer.tagName.toLowerCase() == 'strong' && range.startOffset == 1 : range.startContainer.data == 'xxx' && range.startOffset == 3, 'strong,1或xxx,3' );

                ua.manualDeleteFillData(editor.body);
                /*p,0*/
                range.setStart(editor.body.firstChild, 0).collapse(true).select();
                range = editor.selection.getRange();
                /*startContainer:ie is xxx,ff is p, chrome is strong*/
//    ok( ( range.startContainer === strong.parentNode.firstChild)&& strong.parentNode.firstChild.length == 1  || (range.startContainer.nodeValue.length == 3 && range.startContainer === strong.firstChild.nextSibling), 'startContainer是第一个占位符或者xxx' );
//    ua.manualDeleteFillData( editor.body );
//    range.setStart( editor.body.firstChild, 1 ).collapse( true ).select();
//    equal( range.startContainer.tagName.toLowerCase(), 'p', 'p,1' );


                te.dom.push(div_new);
                te.obj.push(editor);
                start();
            }, 50);
        });
    }, 50);
});

test('trace 1742  isFocus', function () {
    if (!ua.browser.opera) {
        var div1 = document.createElement('div');
        var div2 = document.createElement('div');
        document.body.appendChild(div1);
        document.body.appendChild(div2);
        var editor1 = new UE.Editor({'initialContent': '<span>hello</span>', 'autoFloatEnabled': false});
        var editor2 = new UE.Editor({'initialContent': '<span>hello</span>', 'autoFloatEnabled': false});
        editor1.render(div1);
        stop();
        editor1.ready(function () {
            editor2.render(div2);
            editor2.ready(function () {
                editor1.focus();
                ok(editor1.selection.isFocus(), '设editor内容是<span> editor1 is focused');
                ok(!editor2.selection.isFocus(), '设editor内容是<span> editor2 is not focused');
                editor2.focus();
                ok(editor2.selection.isFocus(), '设editor内容是<span> editor2 is focused');
                ok(!editor1.selection.isFocus(), '设editor内容是<span> editor1 is not focused');
                div1.parentNode.removeChild(div1);
                div2.parentNode.removeChild(div2);

                var div3 = document.createElement('div');
                var div4 = document.createElement('div');
                document.body.appendChild(div3);
                document.body.appendChild(div4);
                var editor3 = new UE.Editor({'initialContent': '<h1>hello</h1>', 'autoFloatEnabled': false});
                var editor4 = new UE.Editor({'initialContent': '<h1>hello</h1>', 'autoFloatEnabled': false});
                editor3.render(div3);
                editor3.ready(function () {
                    editor4.render(div4);
                    editor4.ready(function () {
                        editor3.focus();
                        ok(editor3.selection.isFocus(), '设editor内容是<h1> editor1 is focused');
                        ok(!editor4.selection.isFocus(), '设editor内容是<h1> editor2 is not focused');
                        editor4.focus();
                        ok(editor4.selection.isFocus(), '设editor内容是<h1> editor2 is focused');
                        ok(!editor3.selection.isFocus(), '设editor内容是<h1> editor1 is not focused');
                        setTimeout(function () {
                            div3.parentNode.removeChild(div3);
                            div4.parentNode.removeChild(div4);
                            start();
                        }, 50);
                    });
                });
            });
        });
    }
});

test( 'getText', function() {
    stop();
    setTimeout( function() {
        var doc = te.dom[1].contentWindow.document;
        var range = new UE.dom.Range( doc ,doc.body);
        var div = doc.createElement( 'div' );
        doc.body.appendChild( div );
        div.innerHTML = '<em></em><span>spanText</span><strong>first</strong>second';

        range.setStart( div.firstChild, 0 ).setEnd( div.lastChild, 1 ).select();
        var selection = new UE.dom.Selection( doc );

        var text = selection.getText();
        equal( text, 'spanTextfirsts', 'check getText function' );
        start();
    }, 20 );
} );



test('hasNativeRange', function () {

    var div_new = document.createElement('div');
    document.body.appendChild(div_new);
    var editor = new UE.Editor({'autoFloatEnabled': false});
    stop();
    setTimeout(function () {
        editor.render(div_new);
        editor.ready(function () {
            setTimeout(function () {
                editor.focus();
                ok(editor.selection.hasNativeRange());
                var rng = new UE.dom.Range(document,document.body);
                rng.setStart(document.body,0).setCursor();

                ok(!editor.selection.hasNativeRange())
                start();
            }, 50);
        });
    }, 50);
});