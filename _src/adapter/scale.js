/*
 * 图片八个角改变大小，chrome的点击选中图片
 * */
UE.ready(function () {

    function Scale() {
        this.editor = null;
        this.$scale = null;
        this.prePos = {x: 0, y: 0};
        this.startPos = {x: 0, y: 0};
    }

    (function () {
        var rect = [
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

        Scale.prototype = {
            reset: function(editor, targetDom){
                var me = this;

                me.editor = editor;
                me.target = targetDom;

                if(!me.$scale) me.init();
                me.setTarget(targetDom);
                return this;
            },
            init: function () {
                var me = this;

                me.$scale = $('<div>');

                for (i = 0; i < 8; i++) {
                    me.$scale.append($('<span>').addClass('edui-scale-hand' + i));
                }

                me.$scale.addClass('edui-scale').hide().css({
                    'border': '1px solid #3b77ff;',
                    'z-index':  + (me.editor.options.zIndex)
                });

                me.editor.$container.append(me.$scale);
                me.initStyle();
                me.initEvents();
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

                me.startPos.x = me.startPos.y = 0;
                me.isDraging = false;
                me.dragId = -1;

                var _mouseMoveHandler = function (e) {
                    if (me.isDraging) {
                        me.updateContainerStyle(me.dragId, {x: e.clientX - me.prePos.x, y: e.clientY - me.prePos.y});
                        me.prePos.x = e.clientX;
                        me.prePos.y = e.clientY;
                        me.updateTargetElement();
                    }
                };
                me.$scale.bind('mousedown', function (e) {
                    var hand = e.target || e.srcElement, hand;
                    if (hand.className.indexOf('edui-scale-hand') != -1) {
                        me.dragId = hand.className.slice(-1);
                        me.startPos.x = me.prePos.x = e.clientX;
                        me.startPos.y = me.prePos.y = e.clientY;
                        me.isDraging = true;
                        $(document).bind('mousemove', _mouseMoveHandler);
                    }
                });
                $(document).bind('mouseup', function (e) {
                    if (me.isDraging) {
                        me.isDraging = false;
                        me.dragId = -1;
                        me.updateTargetElement();
                        me.setTarget(me.target);
                        me.editor.fireEvent('saveScene');
                    }
                    $(document).unbind('mousemove', _mouseMoveHandler);
                });
            },
            setTarget: function (targetObj) {

                var me = this;
                me.target = targetObj;

                var $target = $(me.target),
                    imgPos = $target.offset(),
                    editorPos = me.editor.$container.offset();

                me.editor.selection.getRange().selectNode(me.target);

                me.$scale.css({
                    position:'absolute',
                    width:$target.width(),
                    height:$target.height(),
                    left:imgPos.left - editorPos.left -2,
                    top:imgPos.top - editorPos.top -2
                });
            },
            updateTargetElement: function () {
                var me = this;
                $(me.target).css({width:me.$scale.width(),height:me.$scale.height()});
            },
            updateContainerStyle: function (dir, offset) {
                var me = this,
                    $dom = me.$scale, tmp;

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
                var ele = this.$scale[0],
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
            show: function () {
                var me = this;

                me.$scale.show();
                me._keyDownHandler = function() {
                    me.$scale.hide();
                    if(me.target.parentNode){
                        var range = me.editor.selection.getRange();
                        range.selectNode(me.target);
                        range.select();
                    }
                }
                me._mouseDownHandler = function(e) {
                    var ele = e.target || e.srcElement;
                    if (ele && ele.className.indexOf('scale')==-1 && ele.parentNode.className.indexOf('scale')==-1 ) {
                        me._keyDownHandler();
                    }
                }

                $(document).bind('keydown', me._keyDownHandler);
                $(document).bind('mousedown', me._mouseDownHandler);
                me.editor.fireEvent('saveScene');
                return this;
            },
            hide: function () {
                var me = this;
                me.$scale.hide();
                $(document).unbind('keydown', me._keyDownHandler);
                $(document).unbind('mousedown', me._mouseDownHandler);
                return this;
            }
        }
    })();

    var me = this,
        scale;
    if ( !browser.ie ) {
        me.addListener('click', function(type, e){
            var range = me.selection.getRange(),
                img = range.getClosedNode();

            if (img && img.tagName == 'IMG') {
                scale = scale || new Scale();
                scale.reset(me, img).show();
            } else {
                if (scale) scale.hide();
            }
        });
    }
    if ( browser.webkit ) {
        me.addListener( 'click', function( type, e ) {
            if ( e.target.tagName == 'IMG' ) {
                var range = new dom.Range( me.document );
                range.selectNode( e.target ).select();

            }
        } );
    }
});