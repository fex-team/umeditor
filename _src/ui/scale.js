//scale 类
UE.ui.define('scale', {
    tpl: '<div class="edui-scale">' +
        '<span class="edui-scale-hand0"></span>' +
        '<span class="edui-scale-hand1"></span>' +
        '<span class="edui-scale-hand2"></span>' +
        '<span class="edui-scale-hand3"></span>' +
        '<span class="edui-scale-hand4"></span>' +
        '<span class="edui-scale-hand5"></span>' +
        '<span class="edui-scale-hand6"></span>' +
        '<span class="edui-scale-hand7"></span>' +
        '</div>',
    defaultOpt: {
    },
    init: function (options) {
        this.root($($.parseTmpl(this.tpl, options)));
        this.initStyle();
        this.initEvents();
        return this;
    },
    initStyle: function () {
        utils.cssRule('scale', '.edui-scale{position:absolute;border:1px solid #38B2CE;}' +
            '.edui-scale span{position:absolute;left:0;top:0;width:6px;height:6px;overflow:hidden;font-size:0px;display:block;background-color:#3C9DD0;}'
            + '.edui-scale .edui-scale-hand0{cursor:nw-resize;top:0;margin-top:-7px;left:0;margin-left:-7px;}'
            + '.edui-scale .edui-scale-hand1{cursor:n-resize;top:0;margin-top:-7px;left:50%;margin-left:-3px;}'
            + '.edui-scale .edui-scale-hand2{cursor:ne-resize;top:0;margin-top:-7px;left:100%;margin-left:1px;}'
            + '.edui-scale .edui-scale-hand3{cursor:w-resize;top:50%;margin-top:-3px;left:0;margin-left:-7px;}'
            + '.edui-scale .edui-scale-hand4{cursor:e-resize;top:50%;margin-top:-3px;left:100%;margin-left:1px;}'
            + '.edui-scale .edui-scale-hand5{cursor:sw-resize;top:100%;margin-top:1px;left:0;margin-left:-7px;}'
            + '.edui-scale .edui-scale-hand6{cursor:s-resize;top:100%;margin-top:1px;left:50%;margin-left:-3px;}'
            + '.edui-scale .edui-scale-hand7{cursor:se-resize;top:100%;margin-top:1px;left:100%;margin-left:1px;}');
    },
    initEvents: function () {
        var me = this;

        me.startPos = me.prePos = {x: 0, y: 0};
        me.dragId = -1;

        var _mouseMoveHandler = function (e) {
            if (me.dragId != -1) {
                me.updateContainerStyle(me.dragId, {x: e.clientX - me.prePos.x, y: e.clientY - me.prePos.y});
                me.prePos.x = e.clientX;
                me.prePos.y = e.clientY;
                me.updateTargetElement();
            }
        }, _mouseDownHandler = function (e) {
            var hand = e.target || e.srcElement, hand;
            if (hand.className.indexOf('edui-scale-hand') != -1) {
                me.dragId = hand.className.slice(-1);
                me.startPos.x = me.prePos.x = e.clientX;
                me.startPos.y = me.prePos.y = e.clientY;
                $(document).bind('mousemove', _mouseMoveHandler);
            }
        }, _mouseUpHandler = function (e) {
            if (me.dragId != -1) {
                me.dragId = -1;
                me.updateTargetElement();
            }
            $(document).unbind('mousemove', _mouseMoveHandler);
        };

        me.on('aftershow', function () {
            me.root().bind('mousedown', _mouseDownHandler);
            $(document).bind('mouseup', _mouseUpHandler);
        });
        me.on('afterhide', function () {
            me.root().unbind('mousedown', _mouseDownHandler);
            $(document).unbind('mouseup', _mouseUpHandler);
        });
    },
    updateTargetElement: function () {
        var $root = this.root();
        this.data('$scaleTarget').css({width: $root.width(), height: $root.height()});
    },
    updateContainerStyle: function (dir, offset) {
        var me = this,
            $dom = me.root(),
            tmp,
            rect = [
                //[left, top, width, height]
                [0, 0, -1, -1],
                [0, 0, 0, -1],
                [0, 0, 1, -1],
                [0, 0, -1, 0],
                [0, 0, 1, 0],
                [0, 0, -1, 1],
                [0, 0, 0, 1],
                [0, 0, 1, 1]
            ];

        if (rect[dir][0] != 0) {
            tmp = parseInt($dom.offset().left) + offset.x;
            $dom.css('left', me._validScaledProp('left', tmp));
        }
        if (rect[dir][1] != 0) {
            tmp = parseInt($dom.offset().top) + offset.y;
            $dom.css('top', me._validScaledProp('top', tmp));
        }
        if (rect[dir][2] != 0) {
            tmp = $dom.width() + rect[dir][2] * offset.x;
            $dom.css('width', me._validScaledProp('width', tmp));
        }
        if (rect[dir][3] != 0) {
            tmp = $dom.height() + rect[dir][3] * offset.y;
            $dom.css('height', me._validScaledProp('height', tmp));
        }
    },
    _validScaledProp: function (prop, value) {
        var ele = this.root()[0],
            wrap = document;

        value = isNaN(value) ? 0 : value;
        switch (prop) {
            case 'left':
                return value < 0 ? 0 : (value + ele.clientWidth) > wrap.clientWidth ? wrap.clientWidth - ele.clientWidth : value;
            case 'top':
                return value < 0 ? 0 : (value + ele.clientHeight) > wrap.clientHeight ? wrap.clientHeight - ele.clientHeight : value;
            case 'width':
                return value <= 0 ? 1 : (value + ele.offsetLeft) > wrap.clientWidth ? wrap.clientWidth - ele.offsetLeft : value;
            case 'height':
                return value <= 0 ? 1 : (value + ele.offsetTop) > wrap.clientHeight ? wrap.clientHeight - ele.offsetTop : value;
        }
    },
    show: function ($obj, posObj) {
        if ($obj && posObj) this.attachTo($obj, posObj);
        this.root().show();
        this.trigger("aftershow");
    },
    hide: function () {
        this.root().hide();
        this.trigger('afterhide')
    },
    attachTo: function ($obj, posObj) {
        var me = this,
            imgPos = $obj.offset();

        me.data('$scaleTarget', $obj);
        me.root().css({
            position: 'absolute',
            width: $obj.width(),
            height: $obj.height(),
            left: imgPos.left - posObj.left - 2,
            top: imgPos.top - posObj.top - 2
        });
    },
    getScaleTarget: function () {
        return this.data('$scaleTarget')[0];
    }
});