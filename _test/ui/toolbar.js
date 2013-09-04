/**
 * Created with JetBrains PhpStorm.
 * User: Jinqn
 * Date: 13-9-2
 * Time: 下午5:19
 * To change this template use File | Settings | File Templates.
 */

module('ui.toolbar');

test('toolbar--初始化', function () {
    var div = document.body.appendChild(document.createElement('div'));
    $(div).attr('id', 'test');

    var $toolbarWidget = $.eduitoolbar().appendTo(div);
    equal($toolbarWidget.parent()!=null,true, '判断ui是否已插入到dom上');
    equal($toolbarWidget.hasClass('edui-toolbar'),true, '判断ui的html内容是否正确');

    var $btn = $.eduibutton({
        icon: "bold",
        title: "测试按钮"
    });

    $toolbarWidget.edui().appendToBtnmenu([$btn]);
    equal($toolbarWidget.html().indexOf('测试按钮')!=-1,true, '判断按钮是否已插入到toolbar');

    $(div).remove();
});
