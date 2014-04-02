module( "plugins.basestyle" );

//test( 'bold-在已加粗文本中间去除加粗', function () {//原生问题不修了
//    var editor = te.obj[0];
//    var body = editor.body;
//    var range = te.obj[1];
//    editor.setContent( '<b>hello</b>ssss' );
//    range.setStart( body.firstChild.firstChild, 0 ).collapse( true ).select();
//    editor.execCommand( 'bold' );
//
//    //range = editor.selection.getRange();
//    equal( editor.queryCommandState( 'bold' ), 0, "<strong> 被去掉" );
////    range.insertNode( range.document.createTextNode( 'aa' ) );       /*在当前的range选区插入文本节点*/
////    ua.manualDeleteFillData( editor.body );
////    equal( ua.getChildHTML( body.firstChild ), "aa<strong>hello</strong>ssss", "新文本节点没有加粗" );
//} );


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
    $(div2).remove();
});

test('trace:3941:超链接设置标题',function(){
    var editor = te.obj[0];
    var body = editor.body;
    var range = te.obj[1];
    editor.setContent('<p id="my">university</p>');
    var text = body.firstChild.firstChild;
    range.setStart(text,0).setEnd(text,10).select();
    editor.execCommand('link',{
        url:'www.baidu.com',
        title:'myUniversity'});
    var title = $('a').attr('title');
    equal(title,'myUniversity','设置超链接标题');
});

test('trace:3881:输入空行，内容不可编辑',function(){
    var editor = te.obj[0];
    var body = editor.body;
    var range = te.obj[1];
    editor.setContent('<div><br/><br/><br/><h1>123</h1></div>');
    var text = body.firstChild.lastChild.firstChild;
    range.setStart(text,0).collapse(1).select();
    editor.execCommand('formula','\\int{x}{y}');
    editor.setDisabled();
    var t = $('div').find('br').length;
    equal(t,3,'不可编辑状态显示正确');
    console.log(body.firstChild.children.length,'++++');
    console.log(body.firstChild,'===');
});

test('trace:3880:插入公式',function(){
    var editor = te.obj[0];
    var body = editor.body;
    var range = te.obj[1];
    editor.setContent('<ol><li>x</li><li>hello2</li><li id="3">hello3</li></ol>');
    var text = body.firstChild.firstChild.firstChild;
    range.setStart(text,0).collapse(true).select();
    editor.execCommand('formula','\\int{x}{y}');
    var text3 = $(".mathquill-embedded-latex").attr("data-latex");
    equal(text3,'\\int{x}{y}','公式插入成功');
});

test('trace:3873:无序列表转换',function(){
    var editor = te.obj[0];
    var body = editor.body;
    var range = te.obj[1];
    editor.setContent('<ol><li>hello1</li><li>hello2</li><li id="3">hello3</li></ol>');
    var text = body.firstChild.firstChild.nextSibling.firstChild;
    range.setStart(text,1).collapse(true).select();
    editor.execCommand('insertunorderedlist');
    var text2 = body.children;
    if(text2.length==1){
        console.log(text2,'----==');
        ok(false,'列表转换失败，影响到其他行的状态');
    }else{
    var f = body.firstChild;
    equal(f.tagName,'OL','检测一：有序列表的某一行转无序，未影响其它行');
    var fff = body.firstChild.nextSibling;
    equal(fff.tagName,'UL','检测三：有序列表的某一行转无序，未影响其它行');
    var ff = body.lastChild;
    equal(ff.tagName,'OL','检测二：有序列表的某一行转无序，未影响其它行');
    }
});

test('trace:3869:多次切换源码，保留选区',function(){
    var editor = te.obj[0];
    var body = editor.body;
    var range = te.obj[1];
    editor.setContent('<p>This is a test word</p>');
    var text = body.firstChild.firstChild;
    range.setStart(text,0).setEnd(text,4).select();
    var text2 = editor.selection.getText();
    editor.execCommand('bold');//加粗
    editor.execCommand('italic');//字体倾斜
    editor.execCommand('source');//切换到源码状态
    stop();
    setTimeout(function(){
        editor.execCommand('source');
        var text3 = editor.selection.getText();
        editor.execCommand('source');//第二次切换到源码状态
        editor.execCommand('source');//第二次从源码切换到编辑状态
        var text4 = editor.selection.getText();
        equal(text2,text4,'源码和编辑状态切换，保留选区');
        start();
    },100);
});

test('removeformat-清除格式',function(){
    var editor = te.obj[0];
    var body = editor.body;
    var range = te.obj[1];
    editor.setContent( '<table><tbody><tr><td><b>hello1</b></td><td ></td></tr><tr><td >hello2</td><td ></td></tr></tbody></table>' );
    var tttt = body.firstChild.firstChild.firstChild.firstChild;
    range.selectNode(tttt).select();
    editor.execCommand('removeformat');//清除格式
    equal( ua.getChildHTML( tttt ), 'hello1' ,'不闭合光标，清除格式');//不闭合光标
    editor.execCommand('bold');
    range.setStart(tttt,0).collapse(true).select(); //闭合光标
    editor.execCommand('removeformat');//清除格式
    var tar='<b>hello1</b>';
    if(ua.browser.ie){
        tar = '<strong>hello1</strong>';
    }
    equal( ua.getChildHTML(tttt),tar,'闭合光标，清除格式');
});

test( 'trace:3940:bold-加粗图标状态',function(){
    var editor = te.obj[0];
    var body = editor.body;
    var range = te.obj[1];
    editor.setContent('<p>This is a test word</p>');
    var text = body.firstChild.firstChild;
    range.setStart(text,0).collapse(true).select();//闭合选择
    editor.execCommand('bold');//第一次加粗
    equal(editor.queryCommandState( 'bold' ), 1, '闭合选择，加粗高亮' );
    editor.execCommand('bold');//第二次加粗
    equal(editor.queryCommandState( 'bold' ), 0,'闭合选择,取消加粗高亮' );
    editor.setContent('<p>This is a test word</p>');
    text = body.firstChild.firstChild;
    range.setStart(text,0).setEnd(text,1).select();//不闭合选择
    editor.execCommand('bold');//第一次加粗
    equal(editor.queryCommandState( 'bold' ), 1, '不闭合选择，加粗高亮' );
    editor.execCommand('bold');//第二次加粗
    equal(editor.queryCommandState( 'bold' ), 0,'不闭合选择,取消加粗高亮' );
});

test( 'bold-加粗状态反射', function () {
    var editor = te.obj[0];
    var body = editor.body;
    var range = te.obj[1];
    editor.setContent( '<p>This is a dog</p>' );
    stop();
    setTimeout( function () {
        range.selectNode( body.firstChild ).select();
        editor.execCommand( 'bold' );
        range.setStart( body.firstChild.firstChild.firstChild, 2 ).collapse( true ).select();
        equal( editor.queryCommandState( 'bold' ), 1, '闭合选择，加粗高亮' );
        ua.manualDeleteFillData( editor.body );
        range.setStart( body.firstChild.firstChild.firstChild, 0 ).setEnd( body.firstChild.firstChild.lastChild, 4 ).select();
        equal( editor.queryCommandState( 'bold' ), 1, '不闭合选择，加粗高亮' );
        start();
    }, 100 )
} );

test( 'bold-连续加粗2次', function () {
    var editor = te.obj[0];
    var body = editor.body;
    var range = te.obj[1];
    editor.setContent( '<p>this is a dog</p>' );
    var text = body.firstChild.firstChild;
    range.setStart( text, 0 ).setEnd( text, 3 ).select();
    editor.execCommand( 'bold' );        /*第一次加粗*/
    equal( editor.queryCommandState( 'bold' ), 1, '加粗按钮高亮' );
    text = body.firstChild.lastChild;
    range.setStart( text, 1 ).setEnd( text, 3 ).select();       /*不闭合选区文本*/
    equal( editor.queryCommandState( 'bold' ), 0, '不闭合选择，加粗不高亮' );
    ua.manualDeleteFillData( editor.body );
    editor.execCommand( 'bold' );       /*第二次加粗*/
    stop();
    setTimeout( function () {
    equal( editor.queryCommandState( 'bold' ), 1, '加粗高亮' );
        start();
    }, 100 )
} );

test( 'bold-2个单词，中间有空格第一个单词加粗，第二个单词加粗再去加粗', function () {
    var editor = te.obj[0];
    var body = editor.body;
    var range = te.obj[1];
    body.innerHTML =    '<p>hello world</p>';   //用setContent复现不了这个问题
    var text = body.firstChild.firstChild;
    range.setStart( text, 0 ).setEnd( text, 5 ).select();
    editor.execCommand( 'bold' );
    text = body.firstChild.lastChild;
    range.setStart( text, 1 ).setEnd( text, 6 ).select();
    editor.execCommand( 'bold' );
    editor.execCommand( 'bold' );
    ok( body.firstChild.childNodes.length==3&&body.firstChild.childNodes[1].length ==1, '空格保留');
} );

test( '测试 userAction.manualdeleteFilldata', function () {
    var editor = te.obj[0];
    var body = editor.body;
    var range = te.obj[1];
    editor.setContent( '<p></p>' );
    var fillData = editor.document.createTextNode( domUtils.fillChar );     //  在ie 6,7下，使用appendChild时，需要body先加载，必须将上句document前加editor,否则出错
    body.appendChild( fillData );
    var space = ua.browser.ie ? '&nbsp;' : '<br>';//getContent（）结果：‘<br />’,innerHTML结果：<br>
    notEqual( body.innerHTML.toLowerCase(), '<p>' + space + '</p>', '清除不可见字符前不相等' );
    ua.manualDeleteFillData( body );
    //equal( body.innerHTML.toLowerCase(), '<p>' + space + '</p>', '清除不可见字符后相等' );
    equal(body.innerHTML.toLowerCase(),'<p></p>','清除不可见字符后相等');  //断言合理性待定
} );

test( 'trace 1884:单击B再单击I ', function () {
    if(ua.browser.ie==8)return ;//todo 测试机上有问题,自己的虚拟机上没问题
    var editor = te.obj[0];
    var body = editor.body;
    var range = te.obj[1];
    editor.setContent( '' );
    range.setStart( body.firstChild, 0 ).collapse( 1 ).select();
    editor.execCommand( 'bold' );
    equal( editor.queryCommandState( 'bold' ), 1, 'b高亮' );
    editor.execCommand( 'italic' );
    equal( editor.queryCommandState( 'italic' ), 1, 'b高亮' );
} );

test( 'ctrl+i', function() {
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UM.getEditor('ue');
    editor.ready(function () {
        var range = new UM.dom.Range(editor.document,editor.body);
    var body = editor.body;
    editor.setContent( '<p>没有加粗的文本</p>' );
    range.selectNode( body.firstChild ).select();
    var p = body.firstChild;
    editor.focus();
    setTimeout( function() {
        ua.keydown(editor.body,{'keyCode':73,'ctrlKey':true});
        editor.focus();
        setTimeout( function() {
            if(ua.browser.ie )
                equal( ua.getChildHTML( p ), '<em>没有加粗的文本</em>' );
            else
                equal(ua.getChildHTML(p),'<i>没有加粗的文本</i>');
            te.dom.push(editor.container);
            //UM.delEditor('ue');
            start();
        }, 150 );
    }, 100 );
    });
    stop();
} );


test( 'ctrl+b', function() {
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue1';
    var editor = UM.getEditor('ue1');
    editor.ready(function () {
        var range = new UM.dom.Range(editor.document,editor.body);
    var body = editor.body;
    editor.setContent( '<p>没有加粗的文本</p>' );
    range.selectNode( body.firstChild ).select();
    var p = body.firstChild;
    editor.focus();
    setTimeout( function() {
        ua.keydown(editor.body,{'keyCode':66,'ctrlKey':true});
        editor.focus();
        setTimeout( function() {
            if(!ua.browser.ie)
            {
                equal( ua.getChildHTML( p ), '<b>没有加粗的文本</b>' );

            }
            else
            {
                equal(ua.getChildHTML( p ),'<strong>没有加粗的文本</strong>');

            }
            te.dom.push(editor.container);
            //UM.delEditor('ue');
            start();
        }, 150 );
    }, 100 );
    });
    stop();
} );
test( 'ctrl+u', function() {
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue2';
    var editor = UM.getEditor('ue2');
    editor.ready(function () {
        var range = new UM.dom.Range(editor.document,editor.body);
        var body = editor.body;

        editor.setContent( '<p>没有加粗的文本</p>' );
        setTimeout( function() {
            range.selectNode( body.firstChild ).select();
            editor.focus();
            setTimeout( function() {
                var html = '<span style="text-decoration: underline;">没有加粗的文本</span>';
                ua.checkHTMLSameStyle( html, editor.document, body.firstChild, '文本被添加了下划线' );
                //equal(editor.body.firstChild.firstChild.style.textDecoration,'underline');
                //UM.delEditor('ue');
                te.dom.push(editor.container);
                start();
            }, 150 );
            ua.keydown(editor.body,{'keyCode':85,'ctrlKey':true});
        }, 150 );
    });
    stop();
} );