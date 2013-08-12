module( "plugins.horizontal" );

//normal
test( 'horizontal', function() {
    var editor = te.obj[0];
    var d = editor.document;
    var range = te.obj[1];
    var db = editor.body;

    editor.setContent( '<b><i>top</i></b><p>bottom</p>' );
    setTimeout(function(){
        range.setStart( d.getElementsByTagName( 'i' )[0].firstChild, 0 ).setEnd( db.lastChild.firstChild, 5 ).select();
        editor.execCommand( 'horizontal' );
        var spase = ua.browser.ie?'':'<br>';
        equal( ua.getChildHTML( db ), "<hr><p>m"+spase+"</p>", "horizontal" );
        start();
    },50);
    stop();
} );

test( 'horizontal&&collapsed', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    var db = editor.body;
    editor.setContent( '<b><i>top</i></b><p>bottom</p>' );
    range.setStart( db.lastChild.firstChild, 0 ).collapse( true ).select();
    editor.execCommand( 'horizontal' );
    var spase = ua.browser.ie?'':'<br>';
    equal( ua.getChildHTML( db ), "<p><b><i>top</i></b></p><hr><p>bottom"+spase+"</p>", "边界不在table里" );
} );
