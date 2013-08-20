/**
 * Created with JetBrains PhpStorm.
 * User: xuheng
 * Date: 13-8-1
 * Time: 下午3:41
 * To change this template use File | Settings | File Templates.
 */
module('ui.tab');

test('tab--初始化 操作', function () {
    var div = document.body.appendChild(document.createElement('div'));
    div.innerHTML = '<ul class="edui-tab-nav">' +
        '<li class="edui-tab-item active"><a href="#edui-test1" class="edui-tab-text">1</a></li>' +
        '<li class="edui-tab-item"><a href="#edui-test2" class="edui-tab-text">2</a></li>' +
        '</ul>' +
        '<div class="edui-tab-content" >' +
        '<div  class="edui-tab-pane active" id="edui-test1">1个</div>' +
        '<div class="edui-tab-pane" id="edui-test2">2个</div>' +
        '</div>';
    $(div).attr('id', 'edui-test');
    stop();
    setTimeout(function () {
        $tab = $.eduitab({selector: "#edui-test"})
            .edui();

        var index=$tab.activate();
        equal(index,0,'检查tab初始化时应该显示第一个tab');

        var $tgt=$('[href="#edui-test2"]',$tab.root());
        ua.click($tgt[0]);
        var index2=$tab.activate();
        equal(index2,1,'检查点击第2个tab时应该显示第2个tab');

        div.parentNode.removeChild(div);
        start();
    });
});
