/**
 * Created with JetBrains PhpStorm.
 * User: Jinqn
 * Date: 13-8-19
 * Time: 下午4:33
 * To change this template use File | Settings | File Templates.
 */
module( 'adapter.fullscreen' );
test( '检测全屏操作是否正常', function() {
    var editor = te.obj[0];
    stop();
    editor.ready(function(){
        setTimeout(function () {
            var editor = te.obj[0],
                //切换前的状态
                oldState = {
                    width: editor.$container.innerWidth(),
                    height: editor.$container.innerHeight()
                },
                //切换之后的新状态
                newState = {},
                $fullscreenBtn = $( ".edui-btn-fullscreen", editor.$container );

            //切换至全屏
            $fullscreenBtn.trigger("click");

            newState = {
                width: editor.$container.innerWidth(),
                height: editor.$container.innerHeight()
            };

            equal( newState.width, $( window ).width(), '切换至全屏状态后宽度正常' );
            equal( newState.height, $( window ).height(), '切换至全屏状态后宽度正常' );

            equal( $fullscreenBtn.hasClass( "active" ), true, '切换至全屏状态后按钮状态正常' );

            //退出全屏
            $fullscreenBtn.trigger("click");

            newState = {
                width: editor.$container.innerWidth(),
                height: editor.$container.innerHeight()
            };

            equal( newState.width, oldState.width, '退出全屏状态后宽度正常' );
            equal( newState.height, oldState.height, '退出全屏状态后宽度正常' );

            equal( $fullscreenBtn.hasClass( "active" ), false, '退出全屏状态后按钮状态正常' );

            start();

        }, 500);
    });

});

