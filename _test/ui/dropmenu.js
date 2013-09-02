/**
 * Created with JetBrains PhpStorm.
 * User: Jinqn
 * Date: 13-9-2
 * Time: 下午1:28
 * To change this template use File | Settings | File Templates.
 */
module('ui.dropmenu.js');

test('dropmenu初始化', function () {
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
            start();
        }}).appendTo(div);

    var $btn = $.eduibutton({
        icon: "paragraph",
        title: "测试"
    }).appendTo(div);

    $dropMenuWidget.edui().show($btn);

    setTimeout(function(){

        var isshow = $dropMenuWidget.css("display") != "none";
        equal(isshow, true, '检查菜单是否显示');

        $dropMenuWidget.edui().hide();
        var ishide = $dropMenuWidget.css("display") == "none";
        equal(ishide, true, '检查菜单是否隐藏');

        item = $dropMenuWidget.find("li")[0];
        value = $(item).data('value');

        ua.click(item);

    },100);
    stop();
});