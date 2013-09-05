module( "plugins.horizontal" );

//normal
test( 'trace 3587　3614:horizontal', function() {
    if(ua.browser.ie)return;//todo ie下有问题
    var editor = te.obj[0];
    var d = editor.document;
    var range = te.obj[1];
    var db = editor.body;

    editor.setContent( '<p>hello</p><b><i>top</i></b><p>bottom</p>' );
        setTimeout(function(){
            range.setStart( d.getElementsByTagName( 'i' )[0].firstChild, 0 ).setEnd( db.lastChild.firstChild, 5 ).select();
            editor.execCommand( 'horizontal' );
            //<p>hello</p><hr>m
            if(ua.browser.gecko)
                equal( ua.getChildHTML( db ), '<p>hello</p><hr>m', "horizontal" );
            else
                equal( ua.getChildHTML( db ), '<p>hello</p><hr><p>m<br></p>', "horizontal" );
            start();
        },50);
        stop();
} );

test( 'horizontal&&collapsed', function() {//ie8下待确定
    if(ua.browser.ie)return;//todo ie下有问题
    var editor = te.obj[0];
    var range = te.obj[1];
    var db = editor.body;
    editor.setContent( '<b><i>top</i></b><p>bottom</p>' );
    range.setStart( db.lastChild.firstChild, 0 ).collapse( true ).select();
    editor.execCommand( 'horizontal' );
    ua.manualDeleteFillData(db);
    var spase = ua.browser.chrome?'<p></p>':'';
    if(ua.browser.ie)
        equal( ua.getChildHTML( db ), '<p><b><i>top</i></b></p>'+spase+'<p><hr>bottom</p>', "边界不在table里" );
    else
        equal( ua.getChildHTML( db ), '<p><b><i>top</i></b></p>'+spase+'<hr><p>bottom</p>', "边界不在table里" );
} );
