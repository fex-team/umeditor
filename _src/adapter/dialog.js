(function () {
    var iframeUrlMap = {
        'anchor': 'anchor/anchor.html',
        'insertimage': 'image/image.html',
        'link': 'link/link.html',
        'spechars': 'spechars/spechars.html',
        'searchreplace': 'searchreplace/searchreplace.html',
        'map': 'map/map.html',
        'gmap': 'gmap/gmap.html',
        'insertvideo': 'video/video.html',
        'help': 'help/help.html',
        'emotion': 'emotion/emotion.html',
        'wordimage': 'wordimage/wordimage.html',
        'attachment': 'attachment/attachment.html',
        'insertframe': 'insertframe/insertframe.html',
        'edittip': 'table/edittip.html',
        'edittable': 'table/edittable.html',
        'edittd': 'table/edittd.html',
        'snapscreen': 'snapscreen/snapscreen.html',
        'scrawl': 'scrawl/scrawl.html',
        'music': 'music/music.html'
    };

    var dialogBtns = {
        ok: 'attachment anchor link insertimage map gmap insertframe wordimage ' +
            'insertvideo insertframe edittip edittable edittd scrawl music',
        nook: 'searchreplace help spechars'
    };

    for (var p in dialogBtns) {
        (function (type, vals) {
            UE.registerUI(vals,
                function (name, mode) {
                    var me = this, currentRange, dialog,
                        opt = {
                            title: (me.options.labelMap && me.options.labelMap[name]) || me.getLang("labelMap." + name),
                            url: me.options.UEDITOR_HOME_URL + '/dialogs/' +
                                ((me.options.iframeUrlMap && me.options.iframeUrlMap[name]) || iframeUrlMap[name])
                        };

                    if (type == "ok") {
                        opt.oklabel = me.getLang('ok');
                        opt.cancellabel = me.getLang('cancel');
                    }

                    dialog = $.eduimodal(opt);

                    dialog.attr('id', 'edui-' + name).find('.modal-body').addClass('edui-' + name + '-body');

                    dialog.edui().on('beforehide',function () {
                        var rng = me.selection.getRange();
                        if (rng.equals(currentRange)) {
                            rng.select()
                        }
                    }).on('beforeshow', function () {
                            currentRange = me.selection.getRange();
                            UE.setActiveWidget(this.root())
                        });

                    if (mode == 'menu') {
                        return dialog;
                    }
                    else {
                        var $btn = $.eduibutton({
                            icon: name,
                            click: function () {
                                if (!dialog.parent()[0]) {
                                    me.$container.find('.edui-dialog-container').append(dialog);
                                }
                                dialog.edui().show();
                                UE.setActiveEditor(me);
                                me.$activeDialog = dialog;
                            },
                            title: this.getLang('labelMap')[name] || ''
                        });

                        me.addListener('selectionchange', function () {
                            var state = this.queryCommandState(name);
                            $btn.edui().disabled(state == -1).active(state == 1)
                        });
                        return $btn;
                    }

                }
            );
        })(p, dialogBtns[p]);
    }
})();

