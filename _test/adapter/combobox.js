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
            debugger;
//            UE.getUI( me, "fontfamily").trigger("click");
//            equal(scrollTop, me.$container.find('.edui-toolbar').offset().top, '检查toolbar是否在页面顶端');
        }, 200);
    });

});

