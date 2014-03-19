UM.registerUI('imagescale',function () {
    var me = this,
        $imagescale;

    me.setOpt('imageScaleEnabled', true);

    if (browser.webkit && me.getOpt('imageScaleEnabled')) {

        me.addListener('click', function (type, e) {
            var range = me.selection.getRange(),
                img = range.getClosedNode(),
                target = e.target;

            /* 点击第一个图片的后面,八个角不消失 fix:3652 */
            if (img && img.tagName == 'IMG' && target == img) {

                if (!$imagescale) {
                    $imagescale = $.eduiscale({'$wrap':me.$container}).css('zIndex', me.options.zIndex);
                    me.$container.append($imagescale);

                    var _keyDownHandler = function () {
                        $imagescale.edui().hide();
                    }, _mouseDownHandler = function (e) {
                        var ele = e.target || e.srcElement;
                        if (ele && ele.className.indexOf('edui-scale') == -1) {
                            _keyDownHandler(e);
                        }
                    }, timer;

                    $imagescale.edui()
                        .on('aftershow', function () {
                            $(document).bind('keydown', _keyDownHandler);
                            $(document).bind('mousedown', _mouseDownHandler);
                            me.selection.getNative().removeAllRanges();
                        })
                        .on('afterhide', function () {
                            $(document).unbind('keydown', _keyDownHandler);
                            $(document).unbind('mousedown', _mouseDownHandler);
                            var target = $imagescale.edui().getScaleTarget();
                            if (target.parentNode) {
                                me.selection.getRange().selectNode(target).select();
                            }
                        })
                        .on('mousedown', function (e) {
                            me.selection.getNative().removeAllRanges();
                            var ele = e.target || e.srcElement;
                            if (ele && ele.className.indexOf('edui-scale-hand') == -1) {
                                timer = setTimeout(function() {
                                    $imagescale.edui().hide();
                                }, 200);
                            }
                        })
                        .on('mouseup', function (e) {
                            var ele = e.target || e.srcElement;
                            if (ele && ele.className.indexOf('edui-scale-hand') == -1) {
                                clearTimeout(timer);
                            }
                        });
                }
                $imagescale.edui().show($(img));

            } else {
                if ($imagescale && $imagescale.css('display') != 'none') $imagescale.edui().hide();

            }
        });

        me.addListener('click', function (type, e) {
            if (e.target.tagName == 'IMG') {
                var range = new dom.Range(me.document, me.body);
                range.selectNode(e.target).select();
            }
        });

    }
});