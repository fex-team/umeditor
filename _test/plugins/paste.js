module( 'plugins.paste' );

//不能模拟出真实的粘贴效果，此用例用于检查中间值
test( '粘贴', function() {
    if(ua.browser.ie || ua.browser.opera)return;
    var div = document.body.appendChild( document.createElement( 'div' ) );
    $( div ).css( 'width', '500px' ).css( 'height', '500px' ).css( 'border', '1px solid #ccc' );
    var me = te.obj[2];
    me.render(div);
    stop();
    me.ready(function(){
        var range = new UE.dom.Range( te.obj[2].document ,te.obj[2].body);
        me.focus();
        me.setContent('<p>hello</p>');
        range.setStart(me.body.firstChild,0).collapse(true).select();
        ua.keydown(me.body,{'keyCode':65,'ctrlKey':true});
        ua.keydown(me.body,{'keyCode':67,'ctrlKey':true});
        setTimeout(function(){
            me.focus();
            range.setStart(me.body.firstChild,0).collapse(true).select();
            ua.paste(me.body,{'keyCode':86,'ctrlKey':true});
            equal(me.body.lastChild.id,'baidu_pastebin','检查id');
            equal(me.body.lastChild.style.position,'absolute','检查style');
            div.parentNode.removeChild(div);
            start();
        },50);
        stop();
    });
} );
