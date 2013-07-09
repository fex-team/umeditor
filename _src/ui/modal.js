/*modal 类*/
UE.ui.define ('modal' , {
    tpl: '<div class="hide edui-modal" tabindex="-1" >' +
        '<div class="edui-modal-header">' +
        '<div class="edui-close" data-hide="modal">×</div>' +
        '<h3 class="edui-title"><%=title%></h3>' +
        '</div>' +
        '<div class="edui-modal-body">' +
        ' </div>' +
        '<% if(cancellabel || oklabel) {%>' +
        '<div class="edui-modal-footer">' +
        '<%if(oklabel){%><div class="edui-btn edui-btn-primary" data-ok="modal"><%=oklabel%></div><%}%>' +
        '<%if(cancellabel){%><div class="edui-btn" data-hide="modal"><%=cancellabel%></div><%}%>' +
        '</div>' +
        '<%}%></div>' ,
    defaultOpt: {
        title: "" ,
        cancellabel: "" ,
        oklabel: "" ,
        url: "" ,
        backdrop: true ,
        keyboard: true ,
        show: false
    } ,
    init: function (options) {
        var me = this;

        me.root ($ ($.parseTmpl (me.tpl , options || {})));

        me.data ("options" , options);

        me.loadData(options.url);

        me.root ().delegate ('[data-hide="modal"]' , 'click' , $.proxy (me.hide , me));
        me.root ().delegate ('[data-ok="modal"]' , 'click' , $.proxy (me.ok , me));
    },
    loadData : function(url){
        utils.loadFile(document, {
            src: url,
            tag: "script",
            type: "text/javascript",
            defer: "defer"
        });
        return this;
    },
    body:function($cont){
        if($cont){
            this.root().find('.modal-body').html('').append($cont);
            return this
        }else{
            return $(this.root().find('.modal-body').html())
        }
    },
    toggle: function () {
        var me = this;
        return me[!me.data ("isShown") ? 'show' : 'hide'] ();
    } ,
    show: function () {
        var me = this;

        me.trigger ("beforeshow");

        if (me.data ("isShown")) return;

        me.data ("isShown" , true);

        me.escape ();

        me.backdrop (function () {
            me.autoCenter ();
            me.root ()
                .show ()
                .addClass ('in')
                .focus ()
                .trigger ('aftershow');
        })
    } ,
    autoCenter: function () {
        this.root ().css ("margin-left" , -(this.root ().width () / 2));
    } ,
    hide: function () {
        var me = this;

        me.trigger ("beforehide");

        if (!me.data ("isShown")) return;

        me.data ("isShown" , false);

        me.escape ();

        me.root ().removeClass ('in');

        me.hideModal ();
    } ,
    escape: function () {
        var me = this;
        if (me.data ("isShown") && me.data ("options").keyboard) {
            me.root ().on ('keyup' , function (e) {
                e.which == 27 && me.hide ();
            })
        }
        else if (!me.data ("isShown")) {
            me.root ().off ('keyup');
        }
    } ,
    hideModal: function () {
        var me = this;
        me.root ().hide ();
        me.backdrop (function () {
            me.removeBackdrop ();
            me.trigger ('afterhide');
        })
    } ,
    removeBackdrop: function () {
        this.$backdrop && this.$backdrop.remove ();
        this.$backdrop = null;
    } ,
    backdrop: function (callback) {
        var me = this;
        if (me.data ("isShown") && me.data ("options").backdrop) {
            me.$backdrop = $ ('<div class="modal-backdrop" />')
                .appendTo (document.body);

            me.$backdrop.click (
                me.data ("options").backdrop == 'static' ?
                    $.proxy (me.root ()[0].focus , me.root ()[0])
                    : $.proxy (me.hide , me)
            )

            me.$backdrop.addClass ('in');

        }
        else if (!me.data ("isShown") && me.$backdrop) {
            me.$backdrop.removeClass ('in');
        }

        callback && callback ();

    } ,
    attachTo: function ($obj) {
        var me = this
        if (!$obj.data ('$mergeObj')) {
            if (!$.contains (document.body , me.root ()[0])) {
                me.root ().appendTo ($obj);
            }
            $obj.data ('$mergeObj' , me.root ());
            $obj.on ('click' , function () {
                me.toggle ($obj)
            });
            me.data ('$mergeObj' , $obj)
        }
    } ,
    ok: function () {
        var me = this;
        if(me.trigger ("ok") === false){
            return;
        }
        me.hide ();
    },
    getBodyCont:function(){
        return this.root().find('.modal-body')
    }
});

