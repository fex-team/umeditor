/**
 * Created with JetBrains PhpStorm.
 * User: Jinqn
 * Date: 13-8-19
 * Time: 下午5:17
 * To change this template use File | Settings | File Templates.
 */
module( 'adapter.button' );

test( '判断有没有触发fullscreenchanged事件', function () {
    var editor = te.obj[0];
    var div = te.dom[0];

    editor.ready(function(){
        var $btn = editor.$container.find('.edui-btn-bold');
        equal($btn.edui().disabled(), editor.queryCommandState('bold') == -1, '判断初始化后ui对象disable状态是否正常');
        equal($btn.edui().active(), editor.queryCommandState('bold') == 1, '判断初始化后ui对象active状态是否正常');
        editor.focus();
        $btn.click();//直接用$btn.click()在ie8下,模拟有问题,要先focus,不然document找不对
        setTimeout(function(){
            equal($btn.edui().disabled(), editor.queryCommandState('bold') == -1, '判断点击加粗后ui对象disable状态是否正常');
            equal($btn.edui().active(), editor.queryCommandState('bold') == 1, '判断点击加粗后ui对象active状态是否正常');
            start();
        },200);
    });
    stop();
});