/**
 * Created with JetBrains PhpStorm.
 * User: Jinqn
 * Date: 13-9-2
 * Time: 下午5:18
 * To change this template use File | Settings | File Templates.
 */
/**
 * Created by JetBrains PhpStorm.
 * User: dongyancen
 * Date: 12-4-12
 * Time: 下午4:47
 * To change this template use File | Settings | File Templates.
 */
module( 'ui.popup' );

test('popup--初始化', function () {
    var div = document.body.appendChild(document.createElement('div'));
    $(div).attr('id', 'test');

    var $btn = $.eduibutton({
        icon: "bold",
        title: "测试"
    }).appendTo(div);

    var $popupWidget = $.eduipopup({
        subtpl: '<span class="test">popup text</span>',
        width: '100',
        height: '100'
    });

    $popupWidget.edui().show($btn,{
        offsetTop:-5,
            offsetLeft:10,
            caretLeft:11,
            caretTop:-8
    });

    ;
    equal($popupWidget.edui().getBodyContainer()!=null, true, '检查getBodyContaine是否正常');

    setTimeout(function(){

        var isshow = $popupWidget.css("display") != "none";
        equal(isshow, true, '检查popup是否显示');

        $popupWidget.edui().hide();
        var ishide = $popupWidget.css("display") == "none";
        equal(ishide, true, '检查popup是否隐藏');

        start();
        $(div).remove();
    },100);
    stop();
});