module( 'core.domUtils' );

//test('', function () {
//    stop()
//});

test('覆盖getElementsByTagName',function(){
    var div = te.dom[2];
    div.innerHTML = "<table id='table'><tbody id='tbody'><tr id='1'><td><p>name</p></td></tr><tr id='2'><td>id</td></tr></tbody></table><p class='lm'>wang</p>";
    var num = UM.dom.domUtils.getElementsByTagName(div,'p','lm').length;
    equal(num,1,'筛选成功');
});

test('覆盖removeStyle',function(){
    var flag = false;
    var div = te.dom[2];
    div.innerHTML = "<div><span id='test' style='color: red; background: blue;'>123</span></div>";
    var node = div.firstChild.firstChild;
    UM.dom.domUtils.removeStyle(node,'COLOR');
    if(div.innerHTML.indexOf('red')<0){
        flag = true;
    }
    ok(flag,'成功删除样式1');
    div.innerHTML = "<span id='test' style='color: red; background: blue;'>123</span>";
    var flag2 = false;
    var node2 = div.firstChild
    UM.dom.domUtils.removeStyle(node2,'background');
    if(div.innerHTML.indexOf('blue')<0){
        flag2 = true;
    }
    ok(flag,'成功删除样式2');
});

test('覆盖getCommonAncestor',function(){
    var editor2 = new UM.Editor({'UEDITOR_HOME_URL':'../../../', 'autoFloatEnabled':true,webAppKey:'Qr0M9yTEoLIiUSXXQTtq7yFt'});
    var div2 = document.body.appendChild(document.createElement('div'));
    $(div2).css('width', '500px').css('height', '500px').css('border', '1px solid #ccc');
    editor2.render(div2);
    div2.innerHTML="<p id='a'>123</p>";
    var node4 = div2.firstChild;
    var div = te.dom[2];
    var editor = te.dom[4];
    div.innerHTML = "<table id='table'><tbody id='tbody'><tr id='1'><td>name</td></tr><tr id='2'><td>id</td></tr></tbody></table><p>wang</p>";
    var node1 = div.firstChild.firstChild.firstChild;
    var node2 = div.firstChild.firstChild.lastChild.firstChild;
    var result = UM.dom.domUtils.getCommonAncestor(node1,node2);
    equal(result.id,'tbody','两个不同的孩子节点成功找到父亲节点');
    var node3 = div.firstChild.firstChild.firstChild;
    var result2 = UM.dom.domUtils.getCommonAncestor(node3,node3);
    equal(result2.id,1,'两个相同的节点返回该节点本身');
    stop();
    var div = te.dom[2];
    div.innerHTML = "<span>span</span><img  /><b>bbb</b>xxx";
    var iframe = te.dom[1];
    setTimeout( function() {
        var frame_doc = iframe.contentWindow.document || iframe.contentDocument;
        var frame_div = frame_doc.createElement( 'div' );
        frame_doc.body.appendChild( frame_div );
        var domUtils = te.obj[3];
        /*A和B在不同dom树上*/
        var result3 = UM.dom.domUtils.getCommonAncestor(div,frame_div);
        equal(result3,null,'两个不同同一棵树上的节点返回null');
        start();
    }, 50 );
});

test( 'getPosition--A和B是同一个节点', function() {
    var div = te.dom[2];
    div.innerHTML = "<span>span</span><img  /><b>bbb</b>xxx";
    var span_text = div.firstChild.firstChild;
    var domUtils = te.obj[3];
    equal( domUtils.getPosition( span_text, span_text ), 0, 'identical node' );
} );


test( 'getPosition--A和B是兄弟节点', function() {
    var div = te.dom[2];
    div.innerHTML = "<span>span</span><img  /><b>bbb</b>xxx";
    var span_text = div.firstChild.firstChild;
    var div_text = div.lastChild;
    var domUtils = te.obj[3];
    /*span_text在div_text前面*/
    equal( domUtils.getPosition( span_text, div_text ), domUtils.POSITION_PRECEDING, 'preceding node' );
    /*div_text在span_text后面*/
    equal( domUtils.getPosition( div_text, span_text ), domUtils.POSITION_FOLLOWING, 'following node' );
} );


test( 'getPosition--A是B的祖先', function() {
    var div = te.dom[2];
    div.innerHTML = "<span>span</span><img  /><b>bbb</b>xxx";
    var span_text = div.firstChild.firstChild;
    var domUtils = te.obj[3];
    /*A是B的祖先*/
    equal( domUtils.getPosition( div, span_text ), domUtils.POSITION_CONTAINS + domUtils.POSITION_PRECEDING, 'preceding node' );
    /*A是B的子孙*/
    equal( domUtils.getPosition( span_text, div ), domUtils.POSITION_IS_CONTAINED + domUtils.POSITION_FOLLOWING, 'following node' );
} );

test( 'getPosition--A和B在不同dom树上', function() {
    stop();
    expect( 1 );
    var div = te.dom[2];
    div.innerHTML = "<span>span</span><img  /><b>bbb</b>xxx";
    var iframe = te.dom[1];
    setTimeout( function() {
        var frame_doc = iframe.contentWindow.document || iframe.contentDocument;
        var frame_div = frame_doc.createElement( 'div' );
        frame_doc.body.appendChild( frame_div );
        var domUtils = te.obj[3];
        /*A和B在不同dom树上*/
        equal( domUtils.getPosition( div, frame_div ) & 1, 1, 'A和B不在同一个dom树上' );
        start();
    }, 50 );

} );

test( 'getNodeIndex', function() {
    var div = te.dom[2];
    var domUtils = te.obj[3];
    div.innerHTML = '<strong>ddddd</strong><!----><!--hhhhh--><span></span><b>xxxxx</b><p id="p"><br /><img /><table id="table"><tr><td>dddd</td></tr></table></p>';
    var comment = div.firstChild.nextSibling.nextSibling;
    equal( domUtils.getNodeIndex( comment ), 2, 'check commnet index' );
    var td_text = document.getElementById( 'table' ).firstChild.firstChild.firstChild;
    equal( domUtils.getNodeIndex( td_text ), 0, 'check textNode index' );
    equal( domUtils.getNodeIndex( div.firstChild ), 0, 'check strong label index' );
    equal( domUtils.getNodeIndex( (document.getElementById( 'p' )) ), 5, 'check p label index' );
} );

test( 'findParent--body', function() {
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UM.getEditor('ue');
    editor.ready(function () {
        var domUtils = UM.dom.domUtils;
        equal(domUtils.findParent(editor.body), null, 'find parent for body');
        UM.clearCache('ue');
        te.dom.push(editor.container);
        start();
    });
    stop();
} );

/*找符合条件的上一个节点，如果条件为空则找父节点*/
test( 'findParent--tester为空', function() {
    var domUtils = te.obj[3];
    var div = te.dom[2];
    div.innerHTML = '<strong>ddddd</strong><!----><!--hhhhh--><span id="span">span</span><b>xxxxx</b><p id="p"><br /><img /><table id="table"><tr><td>dddd</td></tr></table></p>';
    var span_text = document.getElementById( 'span' ).firstChild;
    same( domUtils.findParent( span_text ), span_text.parentNode, 'find parent' );
} );

test( 'findParent--tester不为空', function() {
    var domUtils = te.obj[3];
    var div = te.dom[2];
    div.innerHTML = '<strong>ddddd</strong><!----><!--hhhhh--><span id="span">span</span><b>xxxxx</b><p id="p"><br /><img /><table id="table"><tr><td>dddd</td></tr></table></p>';
    var span_text = document.getElementById( 'span' ).firstChild;
    var div1 = domUtils.findParent( span_text, function( node ) {
        if ( node.id == "test" )
            return true;
        return false;
    } );
    same( div1, div, 'find parent' );
} );


/*不考虑includeSelf的时候取body的parent的情况*/
test( 'findParentByTagName--body', function() {
    var domUtils = te.obj[3];
    var div = te.dom[2];
    same( domUtils.findParentByTagName( document.body, 'body' ), null, 'parent is self' );
} );


test( 'findParentByTagName--tagName为字符串', function() {
    var domUtils = te.obj[3];
    var div = te.dom[2];
    div.innerHTML = '<strong>ddddd</strong><!----><!--hhhhh--><span id="span">span</span><b>xxxxx</b><p id="p"><br /><img /><table id="table"><tr><td>dddd</td></tr></table></p>';
    var br = document.getElementById( 'p' ).firstChild;
    same( domUtils.findParentByTagName( br, 'div' ), div, 'tagName为字符串' );
    same( domUtils.findParentByTagName( br, 'em' ), null, 'tagName为字符串返回null' );
} );

test( 'findParentByTagName--tagName为字符串数组', function() {
    var domUtils = te.obj[3];
    var div = te.dom[2];
    div.innerHTML = '<strong>ddddd</strong><!----><!--hhhhh--><span id="span">span</span><b>xxxxx</b><p id="p"><br /><img /><table id="table"><tr><td>dddd</td></tr></table></p>';
    var br = document.getElementById( 'p' ).firstChild;
    var tagName = ['em','p','div'];
    same( domUtils.findParentByTagName( br, tagName ), document.getElementById( 'p' ), 'tagName为字符串数组，找出第一个符合条件的父节点' );
} );


test( 'findParentByTagName--文本节点', function() {
    var domUtils = te.obj[3];
    var div = te.dom[2];
    div.innerHTML = '<strong>ddddd</strong><!----><!--hhhhh--><span id="span">span</span><b>xxxxx</b><p id="p"><br /><img /><table id="table"><tr><td>dddd</td></tr></table></p>';
    var span_text = document.getElementById( 'span' ).firstChild;
    var tagName = ['em','p','div'];
    same( domUtils.findParentByTagName( span_text, tagName ), div, '文本节点' );
} );

test( 'findParents', function() {
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UM.getEditor('ue');
    editor.ready(function () {
        var domUtils = UM.dom.domUtils;
        var div = editor.body;
        div.innerHTML = '<strong>ddddd</strong><!----><!--hhhhh--><span id="span">span</span><b>xxxxx</b><p id="p"><br /><img /><table id="table"><tr><td>dddd</td></tr></table></p>';
        var span_text = document.getElementById('span').firstChild;
        /*includeSelf*/
        var parents = domUtils.findParents(span_text, true);
        equal(parents.length, 3, 'check parent count');
        same(parents[0], editor.body, 'first  parent is body');
        same(parents[1], document.getElementById('span'), 'second parent is div');
        same(parents[2], span_text, 'last parent is self');
        /*不逆序存放祖先节点,closerFirst=false*/
        parents = domUtils.findParents(span_text, false, null, true);
        equal(parents.length, 2, 'check parent count');
        same(parents[0], document.getElementById('span'), 'first parent is span');
        same(parents[1], editor.body, 'last parent is body');
        UM.clearCache('ue');
        te.dom.push(editor.container);
        start();
    });
    stop();
} );


test( 'findParents--tester', function() {
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UM.getEditor('ue');
    editor.ready(function () {
        var domUtils = UM.dom.domUtils;
        var div = editor.body;
        div.innerHTML = '<div><p id="p"><br /><img id="img" /><table id="table"><tr><td>dddd</td></tr></table></p></div>';
        var img = document.getElementById('img');
        var parents = domUtils.findParents(img, false, function (node) {
            if (node.tagName.toLowerCase() == 'div' || node.tagName.toLowerCase() == 'body')
                return false;
            return true;
        });
        equal(parents.length, 1, 'check parent count');
        same(parents[0], div.firstChild.firstChild, 'first  parent is p');
        UM.clearCache('ue');
        te.dom.push(editor.container);
        start();
    });
    stop();
} );

test( 'insertAfter', function() {
    var domUtils = te.obj[3];
    var div = te.dom[2];
    var textNode = document.createTextNode( 'text' );
    domUtils.insertAfter( div, textNode );
    te.dom.push( textNode );
    equal( textNode, div.nextSibling, 'insertAfter' );
} );

test( 'remove--not keep children', function() {
    var domUtils = te.obj[3];
    var div = te.dom[2];
    div.innerHTML = "<p>xxx<span><em>xxxx</em>xxxx</span></p><div>xxxx</div>";
    var text = div.firstChild.firstChild;
    var p = div.firstChild;
    /*删除文本节点*/
    var node = domUtils.remove( text );
    equal( ua.getChildHTML( div ), '<p><span><em>xxxx</em>xxxx</span></p><div>xxxx</div>' );
    same( text, node, 'check removed textNode' );
    /*删除有孩子的节点*/
    node = domUtils.remove( p );
    equal( ua.getChildHTML( div ), '<div>xxxx</div>' );
    same( node, p, 'check removed p' );
} );

test( 'remove-- keep children', function() {
    var domUtils = te.obj[3];
    var div = te.dom[2];
    div.innerHTML = '<p id="p">xxx<span><em>xxxx</em>xxxx</span><img /></p><div>xxxx</div>';
    var text = div.firstChild.firstChild;
    var p = div.firstChild;
    /*删除文本节点*/
    var node = domUtils.remove( text, true );
    equal( ua.getChildHTML( div ), '<p id="p"><span><em>xxxx</em>xxxx</span><img></p><div>xxxx</div>' );
    same( text, node, 'check removed textNode' );
    /*删除有孩子的节点*/
    node = domUtils.remove( p, true );
    equal( ua.getChildHTML( div ), '<span><em>xxxx</em>xxxx</span><img><div>xxxx</div>' );
    same( node.id, p.id, 'check removed p' );
} );

test( 'isBookmarkNode', function() {
    var domUtils = te.obj[3];
    var div = te.dom[2];
    var range = te.obj[2];
    div.innerHTML = '<span><em>xxxx</em>xxxx</span><img><div>xxxx</div>';
    range.setStart( div, 0 ).setEnd( div, 1 );
    range.createBookmark();
    ok( domUtils.isBookmarkNode( div.firstChild ), 'is BookmarkNode' );
    ok( !domUtils.isBookmarkNode( div.firstChild.nextSibling ), 'not BookmarkNode' );

} );

test( 'getWindow', function() {
    var div = te.dom[2];
    var domUtils = te.obj[3];
    var w = domUtils.getWindow( div );
    ok( w === self.window, 'check window' );
} );

test( 'getWindow--iframe', function() {
    var f = te.dom[1];
    var domUtils = te.obj[3];
    expect( 1 );
    var frame_doc = f.contentWindow.document || f.contentDocument;
    stop();
    setTimeout( function() {
        var frame_div = frame_doc.createElement( 'div' );
        frame_doc.body.appendChild( frame_div );
        var w = domUtils.getWindow( frame_div );
        ok( f.contentWindow === w, 'same window' );
        start();
    } );

} );

test( 'isWhitespace', function() {
    var div = te.dom[2];
    var domUtils = te.obj[3];
    div.innerHTML = "aaa\ufeff\u200B\t\t\n\r";
    ok( !domUtils.isWhitespace( div.firstChild ), 'not whiteSpace' );
    div.innerHTML = UM.browser.ie && UM.browser.version == '6' ? '\ufeff' : '\u200B' + '\t\t\n\r';
    ok( domUtils.isWhitespace( div.firstChild ), 'is whiteSpace' );
} );

test( 'split--offset正常', function() {
    var div = te.dom[2];
    var domUtils = te.obj[3];
    div.innerHTML = '<span>span</span> >';
    var span = div.firstChild;
    domUtils.split( span.firstChild, 2 );
    equal( span.childNodes.length, 2, 'check child count' );
    equal( span.childNodes[0].data, 'sp', 'check firstChild' );
    equal( span.childNodes[1].data, 'an', 'check secondChild' );
} );

test( 'split--offset=0', function() {
    var div = te.dom[2];
    var domUtils = te.obj[3];
    div.innerHTML = '<span>span</span> >';
    var span = div.firstChild;
    domUtils.split( span.firstChild, 0 );
    equal( span.childNodes.length, 2, 'check child count' );
    equal( span.childNodes[0].data, '', 'check firstChild' );
    equal( span.childNodes[1].data, 'span', 'check secondChild' );
} );

test( 'split--offset=data.length', function() {
    var div = te.dom[2];
    var domUtils = te.obj[3];
    div.innerHTML = '<span>span</span> >';
    var span = div.firstChild;
    domUtils.split( span.firstChild, 4 );
    equal( span.childNodes.length, 2, 'check child count' );
    equal( span.childNodes[0].data, 'span', 'check firstChild' );
    equal( span.childNodes[1].data, '', 'check secondChild' );
} );

/*求相对视窗的位置而不是实际位置*/
//test( 'getXY', function() {
//    var div = te.dom[2];
//    var domUtils = te.obj[3];
//    equal( domUtils.getXY( div )['x'], ua.findPosition( div )[0] - document.documentElement.scrollLeft, 'check X' );
//    equal( domUtils.getXY( div )['y'], ua.findPosition( div )[1] - document.documentElement.scrollTop, 'check Y' );
//
//} );

//
//test( 'on--跨iframe加载', function() {
//    expect( 1 );
//    var domUtils = te.obj[3];
//    var op = {
//        onafterstart : function( f ) {
//            domUtils.on( f, 'load', function() {
//                ok( true, 'on load of iframe success' );
//            } );
//        },
//        ontest : function() {
//            this.finish();
//        }
//    };
//    ua.frameExt( op );
//} );
//

//test( 'on- 给不同的dom元素绑定相同的事件', function() {
//    var domUtils = te.obj[3];
//    expect( 2 );
//    var div2 = document.body.appendChild( document.createElement( 'div' ) );
//    div2.id = 'test2';
//    te.dom.push( div2 );
//    var handle = function( e ) {
//        ok( true, e.type + ' event triggered' );
//    };
//    domUtils.on( te.dom[2], 'mouseover', handle);
//    domUtils.on( te.dom[1], 'mouseover', handle );
//
//    ua.mouseover( te.dom[2] );
//    ua.mouseover( te.dom[1] );
//} );
//test( 'un- 给不同的dom元素绑定相同的事件,解除一个，另一个仍然有效', function() {
//    var domUtils = te.obj[3];
//    expect( 1 );
//    var div2 = document.body.appendChild( document.createElement( 'div' ) );
//    div2.id = 'test2';
//    te.dom.push( div2 );
//    var handle = function( e ) {
//        ok( true, e.type + ' event triggered' );
//    };
//    domUtils.on( te.dom[2], 'mouseover', handle);
//    domUtils.on( te.dom[1], 'mouseover', handle );
//    domUtils.un( te.dom[2],'mouseover', handle );
//    ua.mouseover( te.dom[2] );
//    ua.mouseover( te.dom[1] );
//} );
///*绑定多个事件*/
//test( 'on', function() {
//    var domUtils = te.obj[3];
//    expect( 2 );
//    domUtils.on( te.dom[2], ['mouseover','keypress'], function( e ) {
//        ok( true, e.type + ' event triggered' );
//    } );
//    ua.mouseover( te.dom[2] );
//    ua.keypress( te.dom[2] );
//} );
//test( "test case sensitive", function() {
//    var div = te.dom[2];
//    var domUtils = te.obj[3];
//    if ( ua.browser.ie ) {
//        ok( true, 'IE下不支持诸如DOMNodeInserted等mutation事件' );
//        return;
//    }
//    // ok(false, 'TODO: 添加大小写敏感事件的on绑定和un取消用例,比如DOMMouseScroll');
//    expect( 2 );
//    domUtils.on( div, 'DOMNodeInserted', function() {
//        ok( true, '用DOMNodeInserted测试大小写敏感事件的on绑定' );
//        domUtils.un( div, 'DOMNodeInserted' );
//    } );
//    div.appendChild( document.createElement( 'div' ) );
//    div.appendChild( document.createElement( 'div' ) );
//} );
//
//test( "un--取消注册unload事件", function() {
//    expect( 1 );
//    var domUtils = te.obj[3];
//    var div = te.dom[2];
//    var handle_a = function() {
//        ok( true, "check unload" );
//    };
//    domUtils.on( div, "click", handle_a );
//    /* 直接调用ua提供的接口跨浏览器接口，屏蔽浏览器之间的差异 */
//    ua.click( div );
//    domUtils.un( div, "click", handle_a );
//    ua.click( div );
//} );
//
//
//test( "un--同一个回调注册多个事件，后面事件会将第一个事件dhandler覆盖掉", function() {
//    expect( 1 );
//    var domUtils = te.obj[3];
//    var div = te.dom[2];
//    var handle_a = function() {
//        ok( true, "应当只会执行一次" );
//    };
//    /* 直接调用ua提供的接口跨浏览器接口，屏蔽浏览器之间的差异 */
//    domUtils.on( div, "click", handle_a );
//    domUtils.on(div,'dbclick',handle_a);
//    ua.click( div );
//    domUtils.un( div, "click", handle_a );
//    ua.click( div );
//} );
//
//test( "un--同一个回调同一个事件注册2次", function() {
//    expect( 1 );
//    var domUtils = te.obj[3];
//    var div = te.dom[2];
//    var handle_a = function() {
//        ok( true, "check unload" );
//    };
//    /* 直接调用ua提供的接口跨浏览器接口，屏蔽浏览器之间的差异 */
//    domUtils.on( div, "click", handle_a );
//    domUtils.on(div,'click',handle_a);
//    ua.click( div );
//    domUtils.un( div, "click", handle_a );
//    ua.click( div );
//} );
//
//test( "un--同一个事件取消注册三次", function() {
//    expect( 1 );
//    var domUtils = te.obj[3];
//    var div = te.dom[2];
//    var handle_a = function() {
//        ok( true, "check unload" );
//    };
//    /* 直接调用ua提供的接口跨浏览器接口，屏蔽浏览器之间的差异 */
//    domUtils.on( div, "click", handle_a );
//    ua.click( div );
//    domUtils.un( div, "click", handle_a );
//    domUtils.un( div, "click", handle_a );
//    domUtils.un( div, "click", handle_a );
//    ua.click( div );
//} );

test( 'isBlockElm', function() {
    var div = te.dom[2];
    var domUtils = te.obj[3];
    /*isindex,noframes是特例，在这里不做验证*/
    var blockElms = ['address','blockquote','center','dir','div','dl','fieldset','form','h1','h2','h3','h4','h5','h6','hr','menu','ol','p','pre','table','ul'];
    var k = blockElms.length;
    while ( k ) {
        var elm = document.createElement( blockElms[k - 1] );
        div.appendChild( elm );
        ok( domUtils.isBlockElm( elm ), elm.tagName + ' is block elm' );
        k--;
    }
    blockElms = ['a','abbr','acronym','b','bdo','big','br','cite','code','dfn','em','font','i','img','input','kbd','label','q','s','samp','select','small','span','strike','strong','sub','sp','textarea','tt','u','noscript' ];
    k = blockElms.length;
    while ( k ) {
        var elm = document.createElement( blockElms[k - 1] );
        div.appendChild( elm );
        ok( !domUtils.isBlockElm( elm ), elm.tagName + ' is not block elm' );
        k--;
    }
} );

test( 'isbody', function() {
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UM.getEditor('ue');
    editor.ready(function () {
        var domUtils = UM.dom.domUtils;
        ok(domUtils.isBody(editor.body), 'is body');
        UM.clearCache('ue');
        te.dom.push(editor.container);
        start();
    });
    stop();
} );

test( 'getElementsByTagName', function() {
    var div = te.dom[2];
    var domUtils = UM.dom.domUtils;
    div.innerHTML = '<p><u><em></em></u><span>xxxx</span><u><i>uitext</i></u><br /></p><div>xxxx</div> <p>xxxx</p>';
    var elms = domUtils.getElementsByTagName( div, 'p' );
    equal( elms.length, 2, 'check elem count' );
    equal( elms[0].innerHTML.toLowerCase(), '<u><em></em></u><span>xxxx</span><u><i>uitext</i></u><br>', 'check first p' );
    equal( elms[1].innerHTML, 'xxxx', 'check second p' );
} );

test( 'unselectable--检查赋值是否成功', function() {
    var div = te.dom[2];
    var domUtils = UM.dom.domUtils;
    div.innerHTML = '<div><p>xxxx<span><b><i>xxx</i></b>xxxx</span></p>dddd<p><img /><a>aaaa</a></p></div>';
    domUtils.unSelectable( div );
    if ( UM.browser.gecko || UM.browser.webkit || (UM.browser.ie &&UM.browser.version==11) ) {
        equal( div.style.MozUserSelect || div.style.KhtmlUserSelect || div.style.MSUserSelect, 'none', 'webkit or gecko unselectable' );
    } else {
        equal( div.unselectable, 'on', '检查unselectable属性' );
        for ( var i = 0,ci; ci = div.all[i++]; ) {
            equal( ci.unselectable, 'on', '检查子节点unselectable属性' );
        }
    }
} );

test( 'unselectable--检查是否真的不能选中', function() {
    var div = te.dom[2];
    var domUtils = UM.dom.domUtils;
    div.innerHTML = '<p>xxx</p>';
    //TODO ie下如何选中文本节点需要重新想一想，用程序选择文本貌似不会考虑unselectable属性，都是可以选中的
    if ( ! ua.browser.ie && !ua.browser.opera) {
//        var rng = document.body.createTextRange();
//          domUtils.unselectable( div );
//        rng.moveToElementText( div )
//        /*开始位置处向前移动一个字符，结束位置处向后移动一个字符*/
//        rng.moveEnd( 'character', 1 );
//        rng.moveStart( 'character', -1 );
//        rng.select();
//        equal( rng.text, '', 'after unselectable' );
//    } else {
        var r = te.obj[2];
        r.selectNode( div.firstChild ).select();
        equal( ua.getSelectedText(), 'xxx', 'before unselectable' );
        /*禁止选中*/
        domUtils.unSelectable( div );
        r.selectNode( div.firstChild ).select();
        equal( ua.getSelectedText(), '', 'after unselectable' );
    }
} );

/*不支持第二个参数为字符串，必须为数组*/
//test( 'removeAttributes--删除一个属性', function() {
//    var div = te.dom[2];
//    div.innerHTML = '<div class="div_class" name="div_name"></div>';
//    var domUtils = UM.dom.domUtils;
//    domUtils.removeAttributes( div.firstChild, 'class' );
//    equal( ua.getChildHTML( div ), '<div name="div_name"></div>' );
//} );

test( 'removeAttributes--删除多个属性，包括style', function() {
    var div = te.dom[2];
    div.innerHTML = '<div class="div_class" name="div_name" style="color:red;font-size:12px"></div>';
    var domUtils = UM.dom.domUtils;
    /*诡异模式下className可以删除，而非诡异模式下不能删除*/
    domUtils.removeAttributes( div.firstChild, ['class','name','style'] );
    equal( ua.getChildHTML( div ), '<div></div>' );
} );

test( 'setAttributes--设置class,style', function() {
    var div = te.dom[2];
    var domUtils = UM.dom.domUtils;
    div.innerHTML = '<div></div>';
    domUtils.setAttributes( div.firstChild, {'class':'div_class','id':'div_id','style':'color:red;font-size:12px;'} );
    var div_new = document.createElement( 'div' );
    div_new.id = 'test';
    div_new.innerHTML = '<div class="div_class" id="div_id" style="color:red;font-size:12px"></div>';
    ok( ua.haveSameAllChildAttribs( div, div_new ), 'check attributes' );
} );

test( 'getComputedStyle', function() {
    var div = te.dom[2];
    var domUtils = UM.dom.domUtils;
    div.innerHTML = '<div class="div_class" name="div_name" style="color:red;font-size:12px"></div><span></span>';
    equal( domUtils.getComputedStyle( div.firstChild, 'font-size' ), '12px' );
    equal( domUtils.getComputedStyle( div.firstChild, 'display' ), 'block' );
    equal( domUtils.getComputedStyle( div.lastChild, 'display' ), 'inline' );
    equal( domUtils.getComputedStyle( div.firstChild, 'width' ),div.firstChild.offsetWidth + 'px');
    div.innerHTML = '<div class="div_class" name="div_name" style="width:30px;"></div><span></span>';
    equal( domUtils.getComputedStyle( div.firstChild, 'width' ),'30px');
} );

test( 'getComputedStyle--获取默认的背景色', function() {
    var div = te.dom[2];
    var domUtils = UM.dom.domUtils;
    div.innerHTML = '<div>hello</div>';
    /*chrome下不作特殊处理得到的结果是rgba(0,0,0,0)，处理后是结果是“”*/
    var result = UM.browser.webkit ? "" : "transparent";
    equal( domUtils.getComputedStyle( div, 'background-color' ), result, '默认背景色为透明色' );
} );

test( 'trace 3629 getComputedStyle-border', function() {
    if(ua.browser.ie==9)return;//todo trace 3629
    var div = te.dom[2];
    var domUtils = UM.dom.domUtils;
    div.innerHTML = '<table style="border: 5px solid red"></table>';
    var s  =( (ua.browser.ie&&ua.browser.ie>8)||ua.browser.gecko)?'left-':'';
    equal( domUtils.getComputedStyle( div.firstChild, 'border-'+s+'width' ), '5px' );
    equal( domUtils.getComputedStyle( div.lastChild, 'border-'+s+'style' ), 'solid' );
    equal( ua.formatColor(domUtils.getComputedStyle( div.lastChild, 'border-'+s+'color' )).toUpperCase(), "#FF0000" );
} );
//修复ie下的一个bug，如果在body上强制设了字体大小，h1的字体大小就会继承body的字体，而没有办法取到真是的字体大小
test( 'getComputedStyle-在body上设置字体大小', function() {
    var domUtils = UM.dom.domUtils;
    var editor = new UM.Editor({'autoFloatEnabled':false});
    var div = document.body.appendChild( document.createElement( 'div' ) );
    editor.render( div );
    stop();
    editor.ready(function(){
        var body = editor.body;
        var range = new UM.dom.Range( editor.document );
        var h1 = body.appendChild( editor.document.createElement( 'h1' ) );
//    editor.body.style['fontSize'] = '10px';
//   h1的字体大小不是10px
        var fontSize = '32px';
        equal( domUtils.getComputedStyle( h1, 'font-size' ), fontSize, 'body的fontSize属性不应当覆盖p的fontSize属性' );
//    editor.setContent( '<h2>这是h2的文本<a>这是一个超链接</a></h2>' );
        start();
    });
} );

test( "preventDefault", function() {
    expect( 1 );
    var div = te.dom[2];
    var domUtils = UM.dom.domUtils;
    /*img用来撑大页面*/
    var img = document.createElement( 'img' );
    img.src = upath + 'test.jpg';
    img.style.height = "2000px";
    div.appendChild( img );
    document.body.appendChild( div );
    var a = document.createElement( 'a' );
    a.setAttribute( "href", "#" );
    a.innerHTML = 'ToTop';
    a.target = '_self';
    document.body.appendChild( a );
    window.scrollTo( 0, document.body.scrollHeight );

//    UserAction.beforedispatch = function( e ) {
//        e = e || window.event;
//        domUtils.preventDefault( e );
//    };
    a.onclick = function( e ) {
        domUtils.preventDefault( e );
    }
    UserAction.click( a );
    var top = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    ok( top != 0, "preventDefault" );
    document.body.removeChild( a );
} );

test( 'getStyle--color is red', function() {
    var div = te.dom[2];
    var domUtils = UM.dom.domUtils;
    div.innerHTML = '<div class="div_class div_class2 div_class3" name="div_name" style="top:13px;color:red;font-size:12px"></div>';
    equal( domUtils.getStyle( div.firstChild, 'color' ), 'red', 'check color' );
    equal( domUtils.getStyle( div.firstChild, 'font-size' ), '12px', 'check font size' );
    equal( domUtils.getStyle( div.firstChild, 'top' ), '13px', 'check top' );
} );

test( 'getStyle--color is rgb', function() {
    var div = te.dom[2];
    var domUtils = UM.dom.domUtils;
    div.innerHTML = '<div class="div_class div_class2 div_class3" name="div_name" style="top:13px;color:rgb(255,0,0);font-size:12px"></div>';
    equal( domUtils.getStyle( div.firstChild, 'color' ), '#FF0000', 'check color' );
    equal( domUtils.getStyle( div.firstChild, 'font-size' ), '12px', 'check font size' );
    equal( domUtils.getStyle( div.firstChild, 'top' ), '13px', 'check top' );
} );

test( 'getStyle--color is #ff0000', function() {
    var div = te.dom[2];
    var domUtils = UM.dom.domUtils;
    div.innerHTML = '<div class="div_class div_class2 div_class3" name="div_name" style="top:13px;color:#ff0000;font-size:12px"></div>';
    equal( domUtils.getStyle( div.firstChild, 'color' ).toUpperCase(), '#FF0000', 'check color' );
    equal( domUtils.getStyle( div.firstChild, 'font-size' ), '12px', 'check font size' );
    equal( domUtils.getStyle( div.firstChild, 'top' ), '13px', 'check top' );
} );


//test( 'getStyle--border', function() {
//    var div = te.dom[2];
//    div.innerHTML = '<table style="border: 5px solid red"><tr><td></td></tr></table>';
//} );
test( 'removeDirtyAttr', function() {
    var div = te.dom[2];
    var domUtils = UM.dom.domUtils;
    div.innerHTML = '<div><span>xxx</span><img /></div>xx';
    $( div ).attr( '_moz_dirty', 'xxxx' );
    for ( var i = 0,ci,nodes = div.getElementsByTagName( '*' ); ci = nodes[i++]; ) {
        $( ci ).attr( '_moz_dirty', 'xxx' );
    }
    domUtils.removeDirtyAttr( div );

    for ( var i = 0,ci,nodes = div.getElementsByTagName( '*' ); ci = nodes[i++]; ) {
        equal( $( ci ).attr( '_moz_dirty' ), undefined, 'check  dirty attr ' );
    }
    equal( $( div ).attr( '_moz_dirty' ), undefined, 'check  dirty attr' );
} );

test( 'getChildCount', function() {
    var div = te.dom[2];
    var domUtils = UM.dom.domUtils;
    div.innerHTML = '<div name="div_name" style="top:13px;color:#ff0000;font-size:12px"><p><span>xxx<b><u></u></b></span></p><span>xxxx</span>xxx<img/>xxx</div>';
    var divChild = div.firstChild;
    equal( domUtils.getChildCount( div ), 1, 'one childNode' );
    equal( domUtils.getChildCount( divChild ), 5, '5 childs' );
    equal( domUtils.getChildCount( divChild.firstChild.firstChild ), 2, 'inline span' );
    equal( domUtils.getChildCount( divChild.lastChild ), 0, 'text node have no child' );
    equal( domUtils.getChildCount( divChild.lastChild.previousSibling ), 0, 'img have no child' );

} );

test( 'setStyle', function() {
    var div = te.dom[2];
    var domUtils = UM.dom.domUtils;
    div.innerHTML = '<div style="float: left"><p style="background: red"></p></div>';
    /*修改float值*/
    domUtils.setStyle( div.firstChild, 'float', 'right' );
    equal( $( div.firstChild ).css( 'float' ), 'right', '浮动方式改为了right' );
    domUtils.setStyle( div.firstChild.firstChild, 'text-indent', '10px' );
    equal( $( div.firstChild.lastChild ).css( 'text-indent' ), '10px', '设置了缩进样式' );
} );

//zhuwenxuan add
test( 'isEmptyNode', function() {
    var div = te.dom[2];
    var domUtils = UM.dom.domUtils;
    div.innerHTML = " \t\t\n\r";
    ok(domUtils.isEmptyNode(div));
    div.innerHTML = '<div><i></i><b>dasdf</b></div>';
    equal(false,domUtils.isEmptyNode(div));
} );

//zhuwenxuan add
test( 'isBr', function() {
    var domUtils = UM.dom.domUtils;
    var div = te.dom[2];
    div.innerHTML = "<br>";
    equal(true,domUtils.isBr(div.firstChild));
} );

//zhuwenxuan add
test( 'isFillChar', function() {
    var domUtils = UM.dom.domUtils;
    var div = te.dom[2];
    domUtils.fillNode(document,div);
    if(ua.browser.ie){
        ok(domUtils.isFillChar(div.lastChild));
    }
} );


//zhuwenxuan add
test( 'isEmptyBlock', function() {
    var domUtils = UM.dom.domUtils;
    var div = te.dom[2];
    domUtils.fillNode(document,div);
    ok(domUtils.isEmptyBlock(div));
    var span = document.createElement("span");
    equal(1,domUtils.isEmptyBlock(span));
    span.innerHTML = "asdf";
    equal(0,domUtils.isEmptyBlock(span));
} );

//zhuwenxuan add
test( 'fillNode', function() {
    var domUtils = UM.dom.domUtils;
    var div = te.dom[2];
    domUtils.fillNode(document,div);
    ok(div.innerHTML.length>0);
} );