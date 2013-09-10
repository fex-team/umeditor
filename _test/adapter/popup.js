/**
 * Created with JetBrains PhpStorm.
 * User: Jinqn
 * Date: 13-8-20
 * Time: 下午7:13
 * To change this template use File | Settings | File Templates.
 */
module('ui.popup');
test('检查表情的pupop显示是否正常', function () {
    var editor = te.obj[0];
    setTimeout(function () {//这句本身没有用,但是当用例自动执行下一个时,时序上可能有问题,所以在这儿先等一下
        var $emotionBtn = editor.$container.find('.edui-btn-emotion');
        ok($emotionBtn.data('$mergeObj').parent()[0] === undefined, '判断点击按钮前pupop是否未插入到dom树里面');
        editor.focus();
        $emotionBtn.click();
        ok($emotionBtn.data('$mergeObj').parent()[0] !== undefined, '判断点击按钮后pupop是否已插入到dom树里面');

        equal($emotionBtn.edui().disabled(), editor.queryCommandState('emotion') == -1, '判断初始化后btn对象disable状态是否正常');
        equal($emotionBtn.edui().active(), editor.queryCommandState('emotion') == 1, '判断初始化后btn对象active状态是否正常');
        editor.focus();
        $emotionBtn.click();
        setTimeout(function () {
            equal($emotionBtn.edui().disabled(), editor.queryCommandState('emotion') == -1, '判断点击按钮后btn对象disable状态是否正常');
            equal($emotionBtn.edui().active(), editor.queryCommandState('emotion') == 1, '判断点击按钮后btn对象active状态是否正常');
            start();
        }, 100);
    }, 50);
    stop();
});