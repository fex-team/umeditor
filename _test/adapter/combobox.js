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
                components = [ "paragraph", "fontfamily", "fontsize" ];

            for ( var i = 0, component; component = components[ i ]; i++ ) {

                $( ".edui-btn-name-" + component, editor.container).trigger("click");

                equal( $( ".edui-combobox-" + component , editor.container ).css("display"), "block", component+' combobox打开正常' );

            }

            start();

        }, 200);
    });

});

