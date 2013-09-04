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
    editor.focus();
    editor.execCommand('source');
    setTimeout(function () {
        var $textarea = editor.$container.find('textarea');
        editor.fireEvent('fullscreenchanged');
        setTimeout(function () {
            equal($textarea.width(), editor.$body.width() - 10, "textarea的宽是否正确");
            equal($textarea.height(), editor.$body.height(), "textarea的高是否正确");
            start();
        }, 100);
    }, 100);
    stop();
});