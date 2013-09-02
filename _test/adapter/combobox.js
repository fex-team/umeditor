/**
 * Created with JetBrains PhpStorm.
 * User: Jinqn
 * Date: 13-8-19
 * Time: 下午4:33
 * To change this template use File | Settings | File Templates.
 */
module( 'adapter.combobox' );
test( '检测combobox的控制否正常', function() {
    var editor = te.obj[0];
    stop();
    editor.ready(function(){
        setTimeout(function () {
            var editor = te.obj[0];
            $( ".edui-btn-name-fontfamily", editor.container).trigger("click");
            setTimeout(function () {
                equal( $( ".edui-combobox-fontfamily", editor.container ).css("display"), "block", '字体类型combobox打开正常' );
                start();
            }, 200);
        }, 200);
    });

});

