/**
 * Created with JetBrains PhpStorm.
 * User: Jinqn
 * Date: 13-8-19
 * Time: 下午5:17
 * To change this template use File | Settings | File Templates.
 */
module( 'adapter.source' );

test( '判断有没有触发fullscreenchanged事件', function () {
    var editor = te.obj[0];
    editor.ready(function () {
        editor.execCommand( 'source' );
        var $textarea = editor.$container.find('textarea');
        editor.fireEvent('fullscreenchanged');
        equal($textarea.width(), editor.$body.width()-10, "textarea的宽是否正确");
        equal($textarea.height(), editor.$body.height(), "textarea的高是否正确");
        start();
    });
    stop();
});