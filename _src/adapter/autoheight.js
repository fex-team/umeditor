UE.ready(function () {
    var me = this,bakOverflow, timer, isFullscreen;

    me.autoHeightEnabled = me.options.autoHeightEnabled !== false;
    if (!me.autoHeightEnabled) {
        return;
    }

    function adjustHeight() {
        var me = this,
            options=me.options,
            lastHeight = 0, span, node,currentHeight;

        clearTimeout(timer);
        if (isFullscreen)return;
        timer = setTimeout(function () {
            if (!me.queryCommandState || me.queryCommandState && me.queryCommandState('source') != 1) {
                if (!span) {
                    span = me.document.createElement('span');
                    //trace:1764
                    span.style.cssText = 'display:block;width:0;margin:0;padding:0;border:0;clear:both;';
                    span.innerHTML = '.';
                }
                node = span.cloneNode(true);
                me.body.appendChild(node);
                currentHeight = Math.max(domUtils.getXY(node).y + node.offsetHeight, Math.max(options.minFrameHeight, options.initialFrameHeight));
                if (currentHeight != lastHeight) {

                    me.setHeight(currentHeight);

                    lastHeight = currentHeight;
                }
                domUtils.remove(node);

            }
        }, 50);
    }

    me.addListener('fullscreenchanged', function (cmd, f) {
        isFullscreen = f
    });
    me.addListener('destroy', function () {
        me.removeListener('contentchange afterinserthtml keyup mouseup', adjustHeight)
    });

    me.enableAutoHeight = function () {
        var me = this;
        if (!me.autoHeightEnabled) {
            return;
        }
        var doc = me.document;
        me.autoHeightEnabled = true;
        bakOverflow = doc.body.style.overflowY;
        doc.body.style.overflowY = 'hidden';
        me.addListener('contentchange afterinserthtml keyup mouseup', adjustHeight);
        //ff不给事件算得不对
        setTimeout(function () {
            adjustHeight.call(me);
        }, browser.gecko ? 100 : 0);
        me.fireEvent('autoheightchanged', me.autoHeightEnabled);
    };
    me.disableAutoHeight = function () {

        me.body.style.overflowY = bakOverflow || '';

        me.removeListener('contentchange', adjustHeight);
        me.removeListener('keyup', adjustHeight);
        me.removeListener('mouseup', adjustHeight);
        me.autoHeightEnabled = false;
        me.fireEvent('autoheightchanged', me.autoHeightEnabled);
    };
    me.enableAutoHeight();

    domUtils.on(browser.ie ? me.body : me.document, browser.webkit ? 'dragover' : 'drop', function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
            adjustHeight.call(this);
        }, 100);

    });
});
