/**
 * Created with JetBrains PhpStorm.
 * User: xuheng
 * Date: 13-8-20
 * Time: 下午7:02
 * To change this template use File | Settings | File Templates.
 */
module( 'ui.colorpicker' );

test( 'colorpicker--初始化', function() {
    var div = document.body.appendChild( document.createElement( 'div' ) );
    $(div).attr('id','test');

    $colorPickerWidget = $.eduicolorpicker({
        lang_clearColor:'清除',
        lang_themeColor: '主题',
        lang_standardColor: '标准'
    }).appendTo(div);

    var $btn=$.eduibutton({
        icon : "bold",
        title: "测试"
    }).appendTo(div);

    stop();
    setTimeout(function(){
        $colorPickerWidget.edui().show($btn);

        var isshow=$colorPickerWidget.css("display")!="none";
        equal(isshow,true,'检查菜单是否显示');

        $colorPickerWidget.edui().hide();
        var ishide=$colorPickerWidget.css("display")=="none";
        equal(ishide,true,'检查菜单是否隐藏');

        var ele=$colorPickerWidget.find("table .edui-colorpicker-colorcell")[0];
        var color=$(ele).data('color');

        $colorPickerWidget.on('pickcolor',function(evt,value){
            equal(value,color,'检查菜单点击颜色是否正确');

            div.parentNode.removeChild(div);
            start();
        });

        ua.click(ele);

    });
} );