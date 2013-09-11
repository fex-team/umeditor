/**
 * Created with JetBrains PhpStorm.
 * User: dongyancen
 * Date: 13-8-1
 * Time: 下午3:41
 * To change this template use File | Settings | File Templates.
 */
module( 'ui.scale' );

test( '鼠标在八个角上拖拽改变图片大小', function() {
    if ( ua.browser.webkit ) {
        var sc = document.createElement("script");
        sc.id="sc";
        sc.type = "text/plain";
        document.body.appendChild(sc);
        var editor = UM.getEditor(sc.id, {initialFrameWidth:800,initialFrameHeight:320,autoHeightEnabled:true});
        editor.ready(function () {
            editor.setContent( '<p>修正webkit下图片选择的问题<img src="" width="200" height="100" />修正webkit下图片选择的问题</p>' );
            var img = editor.body.getElementsByTagName( 'img' )[0];

            var $scale = $.eduiscale({'$wrap':editor.$container}).css('zIndex', editor.options.zIndex);
            editor.$container.append($scale);
            $scale.edui().show($(img));
            ok($scale.css('display')!='none', "检查八个角是否已出现");

            var width = $scale.width(),
                height = $scale.height();

            ua.mousedown( $scale.find('.edui-scale-hand0')[0], {clientX: 322, clientY: 281} );
            ua.mousemove( document, {clientX: 352, clientY: 301} );
            equal(width-$scale.width(), 30, "检查鼠标拖拽中图片宽度是否正确 --");
            equal(height-$scale.height(), 20, "检查鼠标拖拽中图片高度是否正确 --");

            ua.mousemove( document, {clientX: 382, clientY: 321} );
            ua.mouseup( document, {clientX: 382, clientY: 321} );
            equal(width-$scale.width(), 60, "检查鼠标拖拽完毕图片高度是否正确 --");
            equal(height-$scale.height(), 40, "检查鼠标拖拽完毕图片高度是否正确 --");
            ok($(img).width() == $scale.width() && $(img).height() == $scale.height(), "检查八个角和图片宽高度是否相等");

            $scale.edui().hide();
            ok($scale.css('display')=='none', "检查八个角是否已消失");
            domUtils.remove(editor.container);
            start();
        });
        stop();
    }
} );