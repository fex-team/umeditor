/**
 * Created with JetBrains PhpStorm.
 * User: Jinqn
 * Date: 13-8-19
 * Time: 下午4:33
 * To change this template use File | Settings | File Templates.
 */
module( 'adapter.autofloat' );
test( '检查toolbar是否浮动在页面顶端', function() {
    var sc = document.createElement("script");
    sc.id="sc";
    sc.type = "text/plain";
    document.body.appendChild(sc);
    var me = UM.getEditor(sc.id, {autoFloatEnabled:true,initialFrameWidth:800,initialFrameHeight:100,autoHeightEnabled:true});
    stop();
    me.ready(function(){
        me.setContent('<p><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>sdf</p>');
        var screenX = window.screenX || window.screenLeft;//不同浏览器兼容
        var screenY = window.screenY || window.screenTop;
        setTimeout(function () {
            var range = new UM.dom.Range(me.document,me.body);
            range.setStart(me.body.firstChild, 1).collapse(1).select();
            me.focus();
            setTimeout(function () {
                window.scrollBy(screenX, screenY + $(document.body).height());
                setTimeout(function () {
                    var $eduiToolbar = me.$container.find('.edui-toolbar'),
                        getScrollTop = function(){
                            return document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;//不同浏览器兼容
                        };

                    if(ua.browser.ie != 6) { //ie6下，工具栏浮动不到正确位置
                        equal(getScrollTop(), $eduiToolbar.offset().top, '检查toolbar是否在页面顶端');
                    }
                    window.scrollTo(screenX, screenY - $(document.body).height());
                    setTimeout(function () {
                        equal(me.$container.children()[0].className, me.$container.find('.edui-toolbar')[0].className, 'toolbar是第一个元素');
                        document.getElementById('sc').parentNode.removeChild(document.getElementById('sc'));
                        start();
                    }, 500);
                }, 500);
            }, 200);
        }, 200);
    });
});