//dropmenu 类
UM.ui.define('dropmenu', {
    tmpl: '<ul class="edui-dropdown-menu" aria-labelledby="dropdownMenu" >' +
        '<%for: ${data} as ${ci}%>' +
        '<%if: ${ci.divider}%><li class="edui-divider"></li><%else%>' +
        '<li class="${ci.active} || ${ci.disabled}" data-value="${ci.value}">' +
        '<a href="#" tabindex="-1"><em class="edui-dropmenu-checkbox"><i class="edui-icon-ok"></i></em>${ci.label}</a>' +
        '</li><%/if%>' +
        '<%/for%>' +
        '</ul>',
    defaultOpt: {
        data: [],
        click: function () {

        }
    },
    init: function (options) {
        var me = this;
        var eventName = {
            click: 1,
            mouseover: 1,
            mouseout: 1
        };

        this.root($(UM.utils.render(this.tmpl, options))).on('click', 'li[class!="edui-disabled edui-divider edui-dropdown-submenu"]',function (evt) {
            $.proxy(options.click, me, evt, $(this).data('value'), $(this))()
        }).find('li').each(function (i, el) {
                var $this = $(this);
                if (!$this.hasClass("edui-disabled edui-divider edui-dropdown-submenu")) {
                    var data = options.data[i];
                    $.each(eventName, function (k) {
                        data[k] && $this[k](function (evt) {
                            $.proxy(data[k], el)(evt, data, me.root)
                        })
                    })
                }
            })

    },
    disabled: function (cb) {
        $('li[class!=edui-divider]', this.root()).each(function () {
            var $el = $(this);
            if (cb === true) {
                $el.addClass('edui-disabled')
            } else if ($.isFunction(cb)) {
                $el.toggleClass('edui-disabled', cb(li))
            } else {
                $el.removeClass('edui-disabled')
            }

        });
    },
    val: function (val) {
        var currentVal;
        $('li[class!="edui-divider edui-disabled edui-dropdown-submenu"]', this.root()).each(function () {
            var $el = $(this);
            if (val === undefined) {
                if ($el.find('em.edui-dropmenu-checked').length) {
                    currentVal = $el.data('value');
                    return false
                }
            } else {
                $el.find('em').toggleClass('edui-dropmenu-checked', $el.data('value') == val)
            }
        });
        if (val === undefined) {
            return currentVal
        }
    },
    addSubmenu: function (label, menu, index) {
        index = index || 0;

        var $list = $('li[class!=edui-divider]', this.root());
        var $node = $('<li class="edui-dropdown-submenu"><a tabindex="-1" href="#">' + label + '</a></li>').append(menu);

        if (index >= 0 && index < $list.length) {
            $node.insertBefore($list[index]);
        } else if (index < 0) {
            $node.insertBefore($list[0]);
        } else if (index >= $list.length) {
            $node.appendTo($list);
        }
    }
}, 'menu');