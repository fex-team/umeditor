/**
 * Created with JetBrains PhpStorm.
 * User: Jinqn
 * Date: 13-9-2
 * Time: 上午10:47
 * To change this template use File | Settings | File Templates.
 */

module('ui.dialog');
test('检查insertvideo的按钮和弹出的dialog面板是否正常显示', function () {
    var editor = te.obj[0];
    setTimeout(function () {//这句本身没有用,但是当用例自动执行下一个时,时序上可能有问题,所以在这儿先等一下
    var $vedioBtn = editor.$container.find('.edui-btn-insertvideo');
    ok($vedioBtn.data('$mergeObj').parent()[0] === undefined, '判断点击按钮前dialog是否未插入到dom树里面');
    editor.focus();
    $vedioBtn.click();
    ok($vedioBtn.data('$mergeObj').parent()[0] !== undefined, '判断点击按钮后dialog是否已插入到dom树里面');
    $vedioBtn.click();
    equal($vedioBtn.edui().disabled(), editor.queryCommandState('insertvideo') == -1, '判断初始化后btn对象disable状态是否正常');
    equal($vedioBtn.edui().active(), editor.queryCommandState('insertvideo') == 1, '判断初始化后btn对象active状态是否正常');
    editor.setContent('<img src="" class="edui-faked-video" />');
    setTimeout(function () {
        editor.execCommand('selectall');
        setTimeout(function () {
            equal($vedioBtn.edui().disabled(), editor.queryCommandState('insertvideo') == -1, '判断点击按钮后btn对象disable状态是否正常');
            equal($vedioBtn.edui().active(), editor.queryCommandState('insertvideo') == 1, '判断点击按钮后btn对象active状态是否正常');
            start();
        }, 100);
    }, 100);
    }, 100);
    stop();
});