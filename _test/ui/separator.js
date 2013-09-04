/**
 * Created with JetBrains PhpStorm.
 * User: Jinqn
 * Date: 13-9-2
 * Time: 下午5:18
 * To change this template use File | Settings | File Templates.
 */

module('ui.separator');

test('separator--初始化', function () {
    var div = document.body.appendChild(document.createElement('div'));
    $(div).attr('id', 'test');

    var $separatorWidget = $.eduiseparator().appendTo(div);
    equal($separatorWidget.parent()!=null,true, '判断ui是否已插入到dom上');
    equal($separatorWidget.hasClass('edui-separator'),true, '判断ui的html内容是否正确');
    $separatorWidget.parent();
    $(div).remove();
});
