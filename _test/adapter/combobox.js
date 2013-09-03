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
            var editor = te.obj[0],
                components = [ "paragraph", "fontfamily", "fontsize" ],
                $body = $(document.body),
                colors = [ "forecolor", "backcolor" ];

            for ( var i = 0, component; component = components[ i ]; i++ ) {

                $( ".edui-btn-name-" + component, editor.container).trigger("click");

                equal( $( ".edui-combobox-" + component , editor.container ).css("display"), "block", component+' combobox打开正常' );

                $body.trigger("click");

                equal( $( ".edui-combobox-" + component , editor.container ).css("display"), "none", component+' combobox关闭正常' );

            }

            for ( var i = 0, color; color = colors[ i ]; i++ ) {

                $( ".edui-splitbutton-"+ color +" .edui-dropdown-toggle", editor.container).trigger("click");

                equal( $( ".edui-colorpicker-" + color , editor.container).parents(".edui-popup").css("display"), "block", color+' combobox打开正常' );

                $body.trigger("click");

                equal( $( ".edui-colorpicker-" + color , editor.container).parents(".edui-popup").css("display"), "none", color+' combobox关闭正常' );

            }

            start();

        }, 200);
    });

});

