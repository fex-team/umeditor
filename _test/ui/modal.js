/**
 * Created with JetBrains PhpStorm.
 * User: xuheng
 * Date: 13-8-1
 * Time: 下午3:41
 * To change this template use File | Settings | File Templates.
 */
module( 'ui.modal' );

test( 'modal--初始化', function() {
    var div = document.body.appendChild( document.createElement( 'div' ) );
    $(div).attr('id','test');
    stop();
    setTimeout(function(){
        var $dialog=$.eduimodal({
            title: "titletest",
            width: 300,
            height: 400,
            oklabel:'oktest',
            cancellabel:'canceltest'
        }).appendTo(div);

        var title=$('.edui-title',$dialog).text();
        equal(title,'titletest','检查dialog标题');

        var oklabel=$('[data-ok="modal"]',$dialog).text();
        equal(oklabel,'oktest','检查dialog确定按钮文本');

        var cancellabel=$('.edui-modal-footer [data-hide="modal"]',$dialog).text();
        equal(cancellabel,'canceltest','检查dialog取消按钮文本');

        var wt=$dialog.width();
        equal(wt,300,'检查dialog宽度');

        var ht=$('.edui-modal-body',$dialog).height();
        equal(ht,400,'检查dialog高度');

        div.parentNode.removeChild(div);
       start();
    });
} );


test( 'modal--显示 隐藏', function() {
    var div = document.body.appendChild( document.createElement( 'div' ) );
    $(div).attr('id','test');
    stop();
    setTimeout(function(){
        var $dialog=$.eduimodal({
            width: 300,
            height: 400
        }).appendTo(div);

        $dialog.edui().toggle();
        var isshow=($dialog.css('display')=="none");
        equal(isshow,false,'检查dialog是否显示');

        $dialog.edui().toggle();
        var ishide=($dialog.css('display')=="none");
        equal(ishide,true,'检查dialog是否隐藏');

        div.parentNode.removeChild(div);
        start();
    });
} );
