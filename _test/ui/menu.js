/**
 * Created with JetBrains PhpStorm.
 * User: Jinqn
 * Date: 13-9-2
 * Time: 下午5:17
 * To change this template use File | Settings | File Templates.
 */
module('ui.menu');

test('menu--初始化', function () {
    var div = document.body.appendChild(document.createElement('div'));
    $(div).attr('id', 'test');

    var $dropMenuWidget = $.eduidropmenu({data:[
            {"value":"decimal","label":"1,2,3..."},
            {"value":"lower-alpha","label":"a,b,c..."},
            {"value":"lower-roman","label":"i,ii,iii..."},
            {"value":"upper-alpha","label":"A,B,C..."},
            {"value":"upper-roman","label":"I,II,III..."}
        ]}).appendTo(div);

    var $btn = $.eduibutton({
        icon: "paragraph",
        title: "测试"
    }).appendTo(div);

    equal($btn.data('$mergeObj')==undefined, true, 'attachTo方法执行之前，按钮没有data("$mergeObj")');
    $dropMenuWidget.edui().attachTo($btn);
    equal($btn.data('$mergeObj')!=undefined, true, 'attachTo方法执行之后，按钮有data("$mergeObj")');

    var $subMenuWidget = $.eduidropmenu({data:[
        {"value":"decimal","label":"1,2,3..."},
        {"value":"lower-alpha","label":"a,b,c..."},
        {"value":"lower-roman","label":"i,ii,iii..."},
        {"value":"upper-alpha","label":"A,B,C..."},
        {"value":"upper-roman","label":"I,II,III..."}
    ]});
    //插入子菜单
    $dropMenuWidget.edui().addSubmenu('subMenu', $subMenuWidget, 5);

    ua.click($btn[0]);

    setTimeout(function(){

        var isshow = $dropMenuWidget.css("display") != "none";
        equal(isshow, true, '检查菜单是否显示');

        ua.click($dropMenuWidget.find('li')[0]);
        setTimeout(function(){
            var ishide = $dropMenuWidget.css("display") == "none";
            equal(ishide, true, '检查菜单是否隐藏');

            $(div).remove();
            start();
        },0);

    },100);
    stop();
});