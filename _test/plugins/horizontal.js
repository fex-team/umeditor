module( "plugins.horizontal" );

//normal
test( 'horizontal', function() {
    var editor = te.obj[0];
    var d = editor.document;
    var range = te.obj[1];
    var db = editor.body;

    editor.setContent( '<b><i>top</i></b><p>bottom</p>' );
    if(!ua.browser.gecko){//ff下bug,用例无法执行，暂停
        setTimeout(function(){
            range.setStart( d.getElementsByTagName( 'i' )[0].firstChild, 0 ).setEnd( db.lastChild.firstChild, 5 ).select();
            editor.execCommand( 'horizontal' );
            if(ua.browser.chrome)
                equal( ua.getChildHTML( db ), '<hr><p>m<br></p>', "horizontal" );
            else
                equal(ua.getChildHTML(db),'<p><b><i><hr></i></b>m</p>');//ie8下这种形式可以接受？
            start();
        },50);
        stop();
    }
} );

test( 'horizontal&&collapsed', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    var db = editor.body;
    editor.setContent( '<b><i>top</i></b><p>bottom</p>' );
    range.setStart( db.lastChild.firstChild, 0 ).collapse( true ).select();
    editor.execCommand( 'horizontal' );
    var spase = ua.browser.chrome?'<p></p>':'';
    equal( ua.getChildHTML( db ), '<p><b><i>top</i></b></p>'+spase+'<hr><p>bottom</p>', "边界不在table里" );
} );
