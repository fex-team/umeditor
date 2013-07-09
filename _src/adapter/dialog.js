(function () {
    var dialogUrlMap = {
        'link': 'link/link.js'
    };

    var dialogBtns = {
        ok: 'link',

        nook: 'help'
    };

    for (var p in dialogBtns) {
        (function (type, vals) {
            UE.registerUI(vals,
                function (name) {
                    var me = this, currentRange, $dialog,
                        opt = {
                            title: (me.options.labelMap && me.options.labelMap[name]) || me.getLang("labelMap." + name),
                            url: me.options.UEDITOR_HOME_URL + '/dialogs/' +
                                ((me.options.iframeUrlMap && me.options.dialogUrlMap[name]) || dialogUrlMap[name])
                        };

                    if (type == "ok") {
                        opt.oklabel = me.getLang('ok');
                        opt.cancellabel = me.getLang('cancel');
                    }

                    $dialog = $.eduimodal(opt);

                    $dialog.attr('id', 'edui-dialog-' + name)
                        .find('.modal-body').addClass('edui-dialog-' + name + '-body');

                    $dialog.edui().on('beforehide',function () {
                        var rng = me.selection.getRange();
                        if (rng.equals(currentRange)) {
                            rng.select()
                        }
                    }).on('beforeshow', function () {
                        currentRange = me.selection.getRange();
                        UE.setActiveWidget(this.root());
                        UE.setDialogBody(name,$dialog,me);

                    });

                    var $btn = $.eduibutton({
                        icon: name,
                        click: function () {
                            if (!$dialog.parent()[0]) {
                                me.$container.find('.edui-dialog-container').append($dialog);
                            }
                            $dialog.edui().show();
                            UE.setActiveEditor(me);
                            me.$activeDialog = $dialog;
                        },
                        title: this.getLang('labelMap')[name] || ''
                    });

                    me.addListener('selectionchange', function () {
                        var state = this.queryCommandState(name);
                        $btn.edui().disabled(state == -1).active(state == 1)
                    });
                    return $btn;
                }
            );
        })(p, dialogBtns[p]);
    }
})();

