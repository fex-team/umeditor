//toolbar 类
(function () {
    UE.ui.define('toolbar', {
        tpl: '<div class="edui-toolbar"><div class="edui-text-toolbar">' +
            '<div class="navbar-inner edui-navbar-inner ">' +
            '<ul class="nav edui-nav nav-pills">' +
            '</ul>' +
            '</div>' +
            '</div>' +
            '<div class="btn-toolbar edui-btn-toolbar"></div></div>'
          ,
        textmenutpl: '<li class="dropdown edui-text-menu-item"><a href="#" class="dropdown-toggle"><%=label%><%if(caret){%><span class="caret"></span><%}%></a></li>',
        btngrouptpl:'<div class="btn-group edui-btn-group"></div>',
        init: function () {
            var $root = this.root($(this.tpl));
            this.data('$txtToolbar', $root.find('.nav-pills'))
                .data('$btnToolbar', $root.find('.btn-toolbar'))

        },
        createTextItem : function(label){
            if($.isPlainObject(label)){
                return $($.parseTmpl(this.textmenutpl,label)).delegate(':first','click',label.exec)
            }else{
                return $($.parseTmpl(this.textmenutpl,{'label':label,'caret':1})).delegate(':first','click',function(){
                    $(this).trigger('wrapclick')
                })
            }

        },
        appendToTextmenu : function($item){
            this.data('$txtToolbar').append($item);
            return $item;
        },
        appendToBtnmenu : function(data,btngruopCss){
            var me = this,$cont = me.data('$btnToolbar');
            var $groupcont = $(me.btngrouptpl);
            if(btngruopCss){
                $groupcont.css(btngruopCss);
            }
            if(!$.isArray(data)){
                data = [data];
            }
            $.each(data,function(i,$btn){
                $groupcont.append($btn)
            });
            $cont.append($groupcont)

        }
    });
})();
