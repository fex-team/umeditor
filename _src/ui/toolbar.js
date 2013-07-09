//toolbar 类
(function () {
    UE.ui.define('toolbar', {
        tpl: '<div class="edui-toolbar"><div class="btn-toolbar edui-btn-toolbar"></div></div>'
          ,
        init: function () {
            var $root = this.root($(this.tpl));
            this.data('$btnToolbar', $root.find('.btn-toolbar'))

        },
        appendToBtnmenu : function(data){
            var $cont = this.data('$btnToolbar');
            data = $.isArray(data) ? data : [data];
            $.each(data,function(i,$item){
                $cont.append($item)
            })
        }
    });
})();
