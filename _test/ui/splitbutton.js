/**
 * Created with JetBrains PhpStorm.
 * User: Jinqn
 * Date: 13-9-2
 * Time: 下午5:18
 * To change this template use File | Settings | File Templates.
 */

module('ui.splitbutton');

test('splitbutton--初始化', function () {
    var div = document.body.appendChild(document.createElement('div'));
    $(div).attr('id', 'test');

    var $btn = $.eduisplitbutton({
        "icon":"forecolor",
        "caret":true,
        "name":"forecolor",
        "title":"字体颜色",
        "click":function(){
            this.root().addClass('afterBtnClick');
        }
    }).appendTo(div);

    $btn.edui().disabled(true);
    equal($btn.hasClass('disabled'), true, '检查是否有disabled的class');
    $btn.edui().disabled(false);
    equal($btn.hasClass('disabled'), false, '检查是否没有disabled的class');

    $btn.edui().active(true);
    equal($btn.hasClass('active'), true, '检查是否有disabled的class');
    $btn.edui().active(false);
    equal($btn.hasClass('active'), false, '检查是否有disabled的class');

    $popup = $.eduipopup({
        subtpl: '<span class="test">popup text</span>',
        width: '100',
        height: '100'
    });
    $btn.edui().mergeWith($popup);

    $btn.trigger('click');
    setTimeout(function(){
        equal($btn.hasClass('afterBtnClick'), true, '判断点击是否触发设定好的监听函数');
        start();
    }, 50);

    $(div).remove();
    stop();
});
