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
                    autoRecord: false
                },
                $combox = $.eduibuttoncombobox( coboboxOptions );

            $( ".edui-btn-toolbar", editor.$container ).append( $combox.button() );

            start();

        }, 500);
    });

});

