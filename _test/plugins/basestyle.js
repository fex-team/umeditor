module( "plugins.basestyle" );

test( 'bold-在已加粗文本中间去除加粗', function () {//原生问题不修了
    if(ua.browser.ie==11)return;
    var editor = te.obj[0];
    var body = editor.body;
    var range = te.obj[1];
    editor.setContent( '<b>hello</b>ssss' );
    range.setStart( body.firstChild.firstChild, 0 ).collapse( true ).select();
    editor.execCommand( 'bold' );

    range = editor.selection.getRange();
    equal( editor.queryCommandState( 'bold' ), 0, "<strong> 被去掉" );
    range.insertNode( range.document.createTextNode( 'aa' ) );       /*在当前的range选区插入文本节点*/
    ua.manualDeleteFillData( editor.body );
    var str = 'aa<strong>hello</strong>ssss';
    if(ua.browser.ie)
    {str = "<strong></strong><span>aa</span><strong>hello</strong>ssss";}
    else if(ua.browser.webkit)
    {str = '<b></b>aa<b>hello</b>ssss';}
    else{
        str = 'aa<span></span><b>hello</b>ssss';
    }
    equal( ua.getChildHTML( body.firstChild ), str, "新文本节点没有加粗" );
} );

test( 'trace:3940:bold-加粗图标状态',function(){
    var editor = te.obj[0];
    var body = editor.body;
    var range = te.obj[1];
    editor.setContent('<p>This is a test word</p>');
    var text = body.firstChild.firstChild;
    range.setStart(text,0).collapse(true).select();//闭合选择
    editor.execCommand('bold');//第一次加粗
//    equal(editor.queryCommandState( 'bold' ), 1, '闭合选择，加粗高亮' );
    var flag = true;
    if(UM.browser.ie){
        if(UM.browser.version==11)
        {
            flag = false;
        }
    }
    if(flag){
    editor.execCommand('bold');//第二次加粗
    equal(editor.queryCommandState( 'bold' ), 0,'闭合选择,取消加粗高亮' );
    }
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