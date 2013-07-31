UE.ready(function () {
    var me = this,
        $scale;
    if (browser.webkit) {
        me.addListener('click', function (type, e) {
            var range = me.selection.getRange(),
                img = range.getClosedNode();

            if (img && img.tagName == 'IMG') {
                if (!$scale) {
                    $scale = $.eduiscale().css('zIndex', me.options.zIndex);
                    me.$container.append($scale);

                    var _keyDownHandler = function () {
                        $scale.edui().hide();
                        var target = $scale.edui().getScaleTarget();
                        if (target.parentNode) {
                            var range = me.selection.getRange();
                            range.selectNode(target).select();
                        }
                    }
                    var _mouseDownHandler = function (e) {
                        var ele = e.target || e.srcElement;
                        if (ele && ele.className.indexOf('edui-scale') == -1) {
                            _keyDownHandler();
                        }
                    }
                    $scale.edui()
                        .on('aftershow', function () {
                            $(document).bind('keydown', _keyDownHandler);
                            $(document).bind('mousedown', _mouseDownHandler);
                        })
                        .on('afterhide', function () {
                            $(document).unbind('keydown', _keyDownHandler);
                            $(document).unbind('mousedown', _mouseDownHandler);
                        });
                }
                $scale.edui().show($(img));
            } else {
                if ($scale && $scale.css('display') != 'none') $scale.edui().hide();
            }
        });
        me.addListener('click', function (type, e) {
            if (e.target.tagName == 'IMG') {
                var range = new dom.Range(me.document);
                range.selectNode(e.target).select();

            }
        });
    }

    return $scale;
});