/**
 * Created with JetBrains PhpStorm.
 * User: Jinqn
 * Date: 13-8-19
 * Time: 下午4:33
 * To change this template use File | Settings | File Templates.
 */
module( 'ui.buttoncombobox' );
test( '检测buttoncombobox行为是否正确', function() {
    var editor = te.obj[0];
    stop();
    editor.ready(function(){
        setTimeout(function () {

            var editor = te.obj[0],
                coboboxOptions = {
                    label: 'test',
                    title: 'test',
                    comboboxName: 'test',
                    items: [ 'p', 'h1', 'h2', 'h3', 'h4', 'h5' ],
                    itemStyles: [],
                    value: [ 'p', 'h1', 'h2', 'h3', 'h4', 'h5' ],
                    autowidthitem: [ 'p', 'h1', 'h2', 'h3', 'h4', 'h5' ],
                    autoRecord: true
                },
                $combox = $.eduibuttoncombobox( coboboxOptions ),
                $btn = $combox.edui().button(),
                $item = null;

            $combox.appendTo(  editor.$container.find('.edui-dialog-container') );
            $( ".edui-btn-toolbar", editor.$container ).append( $btn.addClass("edui-combobox") );

            window.setTimeout( function () {

                //测试弹出层位置是否正常
                $btn.trigger( "click" );

                window.setTimeout( function () {

                    equal( Math.abs( $combox.position().left - $btn.position().left ) < 3, true , '弹出层的左边界对齐正常' );
                    equal( $combox.position().top, $btn.position().top + $btn.outerHeight() , '弹出层的上边界对齐正常' );

                    //hover背景改变
                    $item = $(".edui-combobox-item:first", $combox );

                    $item.addClass( "edui-combobox-item-hover" );
                    equal( $item.css("backgroundColor"), "rgb(213, 225, 242)" , 'hover in 背景色正常' );

                    $item.removeClass( "edui-combobox-item-hover" );
                    equal( $item.css("backgroundColor") !== "rgb(213, 225, 242)", true , 'hover out 背景色正常' );

                    //选中第一个
                    $item.trigger("click");
                    equal( $( ".edui-button-label", $btn ).text(), "p", "标签选择之后， 按钮文字正常" );

                    $item = $(".edui-combobox-item:first", $combox );

                    equal( $item.hasClass("edui-combobox-checked"), true, "标签选择之后， 标签已添加选中状态class" );

                    equal( $(".edui-combobox-item-separator", $combox).length, 1, "历史记录的分割线正常出现" );

                    equal( $(".edui-combobox-item", $combox ).length, coboboxOptions.items.length+1, "历史记录条数正确" );

                    //选中历史记录
                    $item.trigger("click");
                    equal( $( ".edui-button-label", $btn ).text(), "p", "选择历史记录之后， 按钮文字正常" );

                    equal( $(".edui-combobox-item", $combox ).length, coboboxOptions.items.length+1, "历史记录条数正确" );

                    start();

                }, 500 );

            }, 500 );

        }, 500);
    });

});

