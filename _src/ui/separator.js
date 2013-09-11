//button 类
UM.ui.define('separator', {
    tpl: '<div class="edui-separator" unselectable="on" onmousedown="return false" ></div>',
    init: function (options) {
        var me = this;
        me.root($($.parseTmpl(me.tpl, options)));
        return me;
    }
});