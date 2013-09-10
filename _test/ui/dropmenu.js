/**
 * Created with JetBrains PhpStorm.
 * User: Jinqn
 * Date: 13-9-2
 * Time: 下午1:28
 * To change this template use File | Settings | File Templates.
 */
module('ui.dropmenu');

test('dropmenu--初始化', function () {
    var div = document.body.appendChild(document.createElement('div'));
    $(div).attr('id', 'test');

    var item, value,
        $dropMenuWidget = $.eduidropmenu({data:[
            {"value":"decimal","label":"1,2,3..."},
            {"value":"lower-alpha","label":"a,b,c..."},
            {"value":"lower-roman","label":"i,ii,iii..."},
            {"value":"upper-alpha","label":"A,B,C..."},
            {"value":"upper-roman","label":"I,II,III..."}
        ],click:function(evt, val){
            equal(value, val, '检查菜单点击的value是否正确');
            div.parentNode.removeChild(div);

            $dropMenuWidget.edui().val('upper-alpha');
            equal($dropMenuWidget.edui().val(), 'upper-alpha', '检查设置菜单值是否正常');

            $dropMenuWidget.edui().disabled(true);
            equal($dropMenuWidget.find("li").hasClass('disabled'), true, '检查选项失效后，菜单项是否有disabled的class');

            $dropMenuWidget.edui().disabled(false);
            equal($dropMenuWidget.find("li").hasClass('disabled'), false, '检查选项失效后，菜单项是否没有disabled的class');
            $(div).remove();
            start();
        }}).appendTo(div);

    var $btn = $.eduibutton({
        icon: "paragraph",
        title: "测试"
    }).appendTo(div);

    $dropMenuWidget.edui().show($btn);
    $item = $dropMenuWidget.find("li").eq(0);
    value = $item.data('value');
    $item.trigger('click');

    var $subMenuWidget = $.eduidropmenu({data:[
        {"value":"decimal","label":"1,2,3..."},
        {"value":"lower-alpha","label":"a,b,c..."},
        {"value":"lower-roman","label":"i,ii,iii..."},
        {"value":"upper-alpha","label":"A,B,C..."},
        {"value":"upper-roman","label":"I,II,III..."}
    ]});
    $dropMenuWidget.edui().addSubmenu('subMenu', $subMenuWidget, 5);
    equal($dropMenuWidget.find(".edui-dropdown-menu").length!=0, true, '检查是否已插入子节点');
    stop();
});