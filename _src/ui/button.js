//button 类
UE.ui.define('button', {
    tpl: '<<%if(!texttype){%>div class="btn" <%}else{%>a class="edui-text-btn"<%}%><% if(title) {%> data-original-title="<%=title%>" <%};%>> ' +
        '<% if(icon) {%><i class="icon-<%=icon%> edui-icon"></i><% }; %><%if(text) {%><span class="edui-button-label<%if (mode==="fontFamily") {%> edui-button-font-label<%} else if( mode==="fontSize" ){%> edui-button-fontsize-label<%}%>"><%=text%></span><%}%>' +
        '<%if(caret && text){%><span class="edui-button-spacing"></span><%}%>' +
        '<% if(caret) {%><span class="caret"></span><% };%></<%if(!texttype){%>div<%}else{%>a<%}%>>',
    defaultOpt: {
        text: '',
        title: '',
        icon: '',
        width: '',
        mode: '',
        caret: false,
        texttype: false,
        click: function () {
        }
    },
    init: function (options) {
        var me = this;
        me.root($($.parseTmpl(me.tpl, options)))
            .click(function (evt) {
                me.wrapclick(options.click, evt)
            });


        //处理ie6以下不支持:hover伪类
        if ($.IE6) {
            me.root().hover(function () {
                me.root().toggleClass('hover')
            });
        }


        return me;
    },
    wrapclick: function (fn, evt) {
        if (!this.disabled()) {
            this.root().trigger('wrapclick');
            $.proxy(fn, this, evt)()
        }
        return this;
    },
    label: function (text) {
        if (text === undefined) {
            return this.root().find('.edui-button-label').text();
        } else {
            this.root().find('.edui-button-label').text(text);
            return this;
        }
    },
    disabled: function (state) {
        if (state === undefined) {
            return this.root().hasClass('disabled')
        }
        this.root().toggleClass('disabled', state);
        return this;
    },
    active: function (state) {
        if (state === undefined) {
            return this.root().hasClass('active')
        }
        this.root().toggleClass('active', state);
        return this;
    },
    mergeWith: function ($obj) {
        var me = this;
        me.data('$mergeObj', $obj);
        $obj.edui().data('$mergeObj', me.root());
        if (!$.contains(document.body, $obj[0])) {
            $obj.appendTo(me.root());
        }
        me.on('click',function () {
            me.wrapclick(function () {
                $obj.edui().show();
            })
        }).register('click', me.root(), function (evt) {
                $obj.hide()
            });
    }
});