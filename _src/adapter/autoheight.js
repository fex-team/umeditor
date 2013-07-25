UE.ready(function () {
    var me = this, bakOverflow, timer, isFullscreen, lastHeight = 0;

    me.autoHeightEnabled = me.options.autoHeightEnabled !== false;
    if (!me.autoHeightEnabled) {
        return;
    }

    function adjustHeight() {
        var me = this,
            options = me.options,
            $span = $('<span style="display:block;width:0;margin:0;padding:0;border:0;clear:both;">.</span>'),
            $node, currentHeight;

        clearTimeout(timer);
        if (isFullscreen)return;
        timer = setTimeout(function () {
            if (!me.queryCommandState || me.queryCommandState && me.queryCommandState('source') != 1) {
                $node = $span.clone().appendTo(me.body);
                currentHeight = Math.max($node.position().top + $node.height(), options.initialFrameHeight);
                $node.remove();
                if (currentHeight != lastHeight) {
                    me.setHeight(currentHeight,true);
                    lastHeight = currentHeight;
                }
            }
        });
    }

    me.addListener('fullscreenchanged', function (cmd, f) {
        isFullscreen = f;
        me.body.style.overflowY = f ? "auto" : "hidden";
    });
    me.addListener('destroy', function () {
        me.removeListener('contentchange afterinserthtml keyup mouseup', adjustHeight)
    });

    me.enableAutoHeight = function () {
        var me = this;
        if (!me.autoHeightEnabled) {
            return;
        }
        me.autoHeightEnabled = true;
        bakOverflow = me.body.style.overflowY;
        me.body.style.overflowY = 'hidden';
        me.addListener('contentchange afterinserthtml keyup mouseup', adjustHeight);
        //ff不给事件算得不对
        setTimeout(function () {
            adjustHeight.call(me);
        }, browser.gecko ? 100 : 0);
        me.fireEvent('autoheightchanged', me.autoHeightEnabled);
    };
    me.disableAutoHeight = function () {

        me.body.style.overflowY = bakOverflow || '';
        me.removeListener('contentchange afterinserthtml keyup mouseup', adjustHeight);
        me.autoHeightEnabled = false;
        me.fireEvent('autoheightchanged', me.autoHeightEnabled);
    };
    me.enableAutoHeight();

    domUtils.on(browser.ie ? me.body : me.document, browser.webkit ? 'dragover' : 'drop', function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
            adjustHeight.call(me);
        }, 100);

    });
});
