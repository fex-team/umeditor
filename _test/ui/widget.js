/**
 * Created with JetBrains PhpStorm.
 * User: Jinqn
 * Date: 13-9-2
 * Time: 下午5:19
 * To change this template use File | Settings | File Templates.
 */
module('ui.widget');
test('widget--初始化',function(){
    var div = document.body.appendChild(document.createElement('div'));
    $(div).attr('id', 'test');

    var $widget = $.eduibutton({
            icon: "bold",
            title: "测试"
        }).appendTo(div),
        widgetedui = $widget.edui(),
        AddClassHandler = function(){
            $widget.addClass('testWidget');
        };
    equal($widget.parent()!=null, true, '判断ui是否已插入到dom上');

    //测试on和trigger方法
    widgetedui.on('click', AddClassHandler);
    widgetedui.trigger('click');
    equal($widget.hasClass('testWidget'), true, '判断是否已设置testWidget的class');

    $widget.removeClass('testWidget');
    equal($widget.hasClass('testWidget'), false, '判断是已去除testWidget的class');

    //测试off和trigger方法
    widgetedui.off('click', AddClassHandler);
    widgetedui.trigger('click');
    equal($widget.hasClass('testWidget'), false, '判断是否没有testWidget的class');

    //测试root和register方法
    widgetedui.register('click', widgetedui.root(), function(){
        $widget.addClass('registerClick');
    });
    equal($widget.hasClass('registerClick'), false, '判断是否未设置registerClick的class');
    $widget.parent().trigger('click');
    equal($widget.hasClass('registerClick'), true, '判断是否已设置registerClick的class');

    //测试data方法
    widgetedui.data('testdata', '123456');
    equal(widgetedui.data('testdata'), '123456', '判断是否data数据是否设置正常');
});
