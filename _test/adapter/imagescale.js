/**
 * Created with JetBrains PhpStorm.
 * User: dongyancen
 * Date: 13-8-1
 * Time: 下午3:41
 * To change this template use File | Settings | File Templates.
 */
module( 'adapter.imagescale' );

test( 'webkit下图片可以被选中并出现八个角', function() {
    if ( ua.browser.webkit ) {
        var sc = document.createElement("script");
        sc.id="sc";
        sc.type = "text/plain";
        document.body.appendChild(sc);
        var editor = UM.getEditor(sc.id, {initialFrameWidth:800,initialFrameHeight:320,autoHeightEnabled:true});
        editor.ready(function () {
            editor.setContent( '<p>修正webkit下图片选择的问题<img src="" width="200" height="100" />修正webkit下图片选择的问题</p>' );
            var img = editor.body.getElementsByTagName( 'img' )[0];
            var p = editor.body.firstChild;
            ua.click( img );
            var range = editor.selection.getRange();
            ua.checkResult( range, p, p, 1, 2, false, '检查当前的range是否为img' );
            var scale = editor.$container.find('.edui-scale')[0];
            ok(scale && scale.style.display!='none', "检查八个角是否已出现");
            ok($(img).width() == $(scale).width() && $(img).height() == $(scale).height(), "检查八个角和图片宽高度是否相等");
            setTimeout(function(){
                UM.clearCache(sc.id);
                domUtils.remove(editor.container);
                    start();
            },100);
        });
        stop();
    }
} );

test( '鼠标点击图片外的其他区域时，八个角消失', function() {
    if ( ua.browser.webkit ) {
        var sc = document.createElement("script");
        sc.id="sc";
        sc.type = "text/plain";
        document.body.appendChild(sc);
        var editor = UM.getEditor(sc.id, {initialFrameWidth:800,initialFrameHeight:320,autoHeightEnabled:true});
        editor.ready(function () {
            editor.setContent( '<p>修正webkit下图片选择的问题<img src="" width="200" height="100" />修正webkit下图片选择的问题</p>' );
            var img = editor.body.getElementsByTagName( 'img' )[0];
            var p = editor.body.firstChild;
            ua.click( img );
            var scale = editor.$container.find('.edui-scale')[0];
            ok(scale && scale.style.display!='none', "检查八个角是否已出现");
            ua.mousedown( editor.$container[0], {clientX: 100, clientY: 100} );
            ok(scale && scale.style.display=='none', "检查八个角是否已消失");
            setTimeout(function(){
                UM.clearCache(sc.id);
                domUtils.remove(editor.container);
                start();
            },100);
        });
        stop();
    }
} );

test( '键盘有操作时，八个角消失', function() {
    if ( ua.browser.webkit ) {
        var sc = document.createElement("script");
        sc.id="sc";
        sc.type = "text/plain";
        document.body.appendChild(sc);
        var editor = UM.getEditor(sc.id, {initialFrameWidth:800,initialFrameHeight:320,autoHeightEnabled:true});
        editor.ready(function () {
            editor.setContent( '<p>修正webkit下图片选择的问题<img src="" width="200" height="100" />修正webkit下图片选择的问题</p>' );
            var img = editor.body.getElementsByTagName( 'img' )[0];
            var p = editor.body.firstChild;
            ua.click( img );
            var scale = editor.$container.find('.edui-scale')[0];
            ok(scale && scale.style.display!='none', "检查八个角是否已出现");
            ua.keydown( editor.$container[0] );
            ok(scale && scale.style.display=='none', "检查八个角是否已消失");
            setTimeout(function(){
                UM.clearCache(sc.id);
                domUtils.remove(editor.container);
                start();
            },100);
        });
        stop();
    }
} );

test( '八个角显示时，鼠标快速按下然、放开，八个角不消失', function() {
    if ( ua.browser.webkit ) {
        var sc = document.createElement("script");
        sc.id="sc";
        sc.type = "text/plain";
        document.body.appendChild(sc);
        var editor = UM.getEditor(sc.id, {initialFrameWidth:800,initialFrameHeight:320,autoHeightEnabled:true});
        editor.ready(function () {
            editor.setContent( '<p>修正webkit下图片选择的问题<img src="" width="200" height="100" />修正webkit下图片选择的问题</p>' );
            var img = editor.body.getElementsByTagName( 'img' )[0];
            var p = editor.body.firstChild;
            ua.click( img );
            var scale = editor.$container.find('.edui-scale')[0];
            ok(scale && scale.style.display!='none', "检查八个角是否已出现");
            ua.mousedown( scale );
            setTimeout(function(){
                ua.mouseup( scale );
            },10);
            setTimeout(function(){
                ok(scale && scale.style.display!='none', "检查八个角是否正常显示");
                setTimeout(function(){
                    UM.clearCache(sc.id);
                    domUtils.remove(editor.container);
                    start();
                },100);
            },400);

        });
        stop();
    }
} );

test( '八个角显示时，鼠标快速按下然、放开，八个角不消失', function() {
    if ( ua.browser.webkit ) {
        var sc = document.createElement("script");
        sc.id="sc";
        sc.type = "text/plain";
        document.body.appendChild(sc);
        var editor = UM.getEditor(sc.id, {initialFrameWidth:800,initialFrameHeight:320,autoHeightEnabled:true});
        editor.ready(function () {
            editor.setContent( '<p>修正webkit下图片选择的问题<img src="" width="200" height="100" />修正webkit下图片选择的问题</p>' );
            var img = editor.body.getElementsByTagName( 'img' )[0];
            var p = editor.body.firstChild;
            ua.click( img );
            var scale = editor.$container.find('.edui-scale')[0];
            ok(scale && scale.style.display!='none', "检查八个角是否已出现");
            ua.mousedown( scale );
            setTimeout(function(){
                ua.mouseup( scale );
            },400);
            setTimeout(function(){
                ok(scale && scale.style.display=='none', "检查八个角是否消失");
                setTimeout(function(){
                    UM.clearCache(sc.id);
                    domUtils.remove(editor.container);
                    start();
                },100);
            },500);
        });
        stop();
    }
} );