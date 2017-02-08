//button 类
UM.ui.define('button', {
    tpl: '<<%if : !${texttype}%>div class="edui-btn edui-btn-${icon} <%if : ${name}%>edui-btn-name-${name}<%/if%>" unselectable="on" onmousedown="return false" <%else%>a class="edui-text-btn"<%/if%><% if: ${title} %> data-original-title="${title}" <%/if%>> ' +
        '<% if: ${icon} %><div unselectable="on" class="edui-icon-${icon} edui-icon"></div><%/if%><%if: ${text} %><span unselectable="on" onmousedown="return false" class="edui-button-label">${text}</span><%/if%>' +
        '<%if: ${caret} && ${text}%><span class="edui-button-spacing"></span><%/if%>' +
        '<% if: ${caret} %><span unselectable="on" onmousedown="return false" class="edui-caret"></span><%/if%></<%if: !${texttype}%>div<%else%>a<%/if%>>',

    defaultOpt: {
        text: '',
        title: '',
        icon: '',
        width: '',
        caret: false,
        texttype: false,
        click: function () {
        }
    },
    init: function (options) {
        var me = this;
        
        me.root($(UM.utils.render(me.tpl, options)))
            .click(function (evt) {
                me.wrapclick(options.click, evt)
            });

        me.root().hover(function () {
            if(!me.root().hasClass("edui-disabled")){
                me.root().toggleClass('edui-hover')
            }
        })

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
            return this.root().hasClass('edui-disabled')
        }
        this.root().toggleClass('edui-disabled', state);
        if(this.root().hasClass('edui-disabled')){
            this.root().removeClass('edui-hover')
        }
        return this;
    },
    active: function (state) {
        if (state === undefined) {
            return this.root().hasClass('edui-active')
        }
        this.root().toggleClass('edui-active', state)

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