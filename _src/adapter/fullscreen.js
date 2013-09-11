/**
 * 全屏组件
 */

(function(){

    //状态缓存
    var STATUS_CACHE = {},
    //状态值列表
        STATUS_LIST = [ 'width', 'height', 'position', 'top', 'left', 'margin', 'padding', 'overflowX', 'overflowY' ],
        CONTENT_AREA_STATUS = {},
    //页面状态
        DOCUMENT_STATUS = {},
        DOCUMENT_ELEMENT_STATUS = {},

        FULLSCREENS = {};


    UM.registerUI('fullscreen', function( name ){

        var me = this,
            $button = $.eduibutton({
                'icon': 'fullscreen',
                'title': (me.options.labelMap && me.options.labelMap[name]) || me.getLang("labelMap." + name),
                'click': function(){
                    //切换
                    me.execCommand( name );
                }
            });

        me.addListener( "selectionchange", function () {

            var state = this.queryCommandState( name );
            $button.edui().disabled( state == -1 ).active( state == 1 );

        } );

        //切换至全屏
        me.addListener('ready', function(){

            me.options.fullscreen && Fullscreen.getInstance( me ).toggle();

        });

        return $button;

    });

    UM.commands[ 'fullscreen' ] = {

        execCommand: function (cmdName) {

            Fullscreen.getInstance( this ).toggle();

        },
        queryCommandState: function (cmdName) {

            return this._edui_fullscreen_status;
        },
        notNeedUndo: 1

    };

    function Fullscreen( editor ) {

        var me = this;

        if( !editor ) {
            throw new Error('invalid params, notfound editor');
        }

        me.editor = editor;

        //记录初始化的全屏组件
        FULLSCREENS[ editor.uid ] = this;

        editor.addListener('destroy', function(){
            delete FULLSCREENS[ editor.uid ];
            me.editor = null;
        });

    }

    Fullscreen.prototype = {

        /**
         * 全屏状态切换
         */
        toggle: function(){

            var editor = this.editor,
            //当前编辑器的缩放状态
                _edui_fullscreen_status = this.isFullState();
            editor.fireEvent('beforefullscreenchange', !_edui_fullscreen_status );

            //更新状态
            this.update( !_edui_fullscreen_status );

            !_edui_fullscreen_status ? this.enlarge() : this.revert();

            editor.fireEvent('afterfullscreenchange', !_edui_fullscreen_status );
            if(editor.body.contentEditable === 'true'){
                editor.fireEvent( 'fullscreenchanged', !_edui_fullscreen_status );
            }

            editor.fireEvent( 'selectionchange' );

        },
        /**
         * 执行放大
         */
        enlarge: function(){

            this.saveSataus();

            this.setDocumentStatus();

            this.resize();

        },
        /**
         * 全屏还原
         */
        revert: function(){

            //还原CSS表达式
            var options = this.editor.options,
                height = /%$/.test(options.initialFrameHeight) ?  '100%' : (options.initialFrameHeight - this.getStyleValue("padding-top")- this.getStyleValue("padding-bottom") - this.getStyleValue('border-width'));

            $.IE6 && this.getEditorHolder().style.setExpression('height', 'this.scrollHeight <= ' + height + ' ? "' + height + 'px" : "auto"');

            //还原容器状态
            this.revertContainerStatus();

            this.revertContentAreaStatus();

            this.revertDocumentStatus();

        },
        /**
         * 更新状态
         * @param isFull 当前状态是否是全屏状态
         */
        update: function( isFull ) {
            this.editor._edui_fullscreen_status = isFull;
        },
        /**
         * 调整当前编辑器的大小, 如果当前编辑器不处于全屏状态， 则不做调整
         */
        resize: function(){

            var $win = null,
                height = 0,
                width = 0,
                borderWidth = 0,
                paddingWidth = 0,
                editor = this.editor,
                me = this,
                bound = null,
                editorBody = null;

            if( !this.isFullState() ) {
                return;
            }

            $win = $( window );
            width = $win.width();
            height = $win.height();
            editorBody = this.getEditorHolder();
            //文本编辑区border宽度
            borderWidth = parseInt( domUtils.getComputedStyle( editorBody, 'border-width' ), 10 ) || 0;
            //容器border宽度
            borderWidth += parseInt( domUtils.getComputedStyle( editor.container, 'border-width' ), 10 ) || 0;
            //容器padding
            paddingWidth += parseInt( domUtils.getComputedStyle( editorBody, 'padding-left' ), 10 ) + parseInt( domUtils.getComputedStyle( editorBody, 'padding-right' ), 10 ) || 0;

            //干掉css表达式
            $.IE6 && editorBody.style.setExpression( 'height', null );

            bound = this.getBound();

            $( editor.container ).css( {
                width: width + 'px',
                height: height + 'px',
                position: !$.IE6 ? 'fixed' : 'absolute',
                top: bound.top,
                left: bound.left,
                margin: 0,
                padding: 0,
                overflowX: 'hidden',
                overflowY: 'hidden'
            } );

            $( editorBody ).css({
                width: width - 2*borderWidth - paddingWidth + 'px',
                height: height - 2*borderWidth - ( editor.options.withoutToolbar ? 0 : $( '.edui-toolbar', editor.container ).outerHeight() ) - $( '.edui-bottombar', editor.container).outerHeight() + 'px',
                overflowX: 'hidden',
                overflowY: 'auto'
            });

        },
        /**
         * 保存状态
         */
        saveSataus: function(){

            var styles = this.editor.container.style,
                tmp = null,
                cache = {};

            for( var i= 0, len = STATUS_LIST.length; i<len; i++ ) {

                tmp = STATUS_LIST[ i ];
                cache[ tmp ] = styles[ tmp ];

            }

            STATUS_CACHE[ this.editor.uid ] = cache;

            this.saveContentAreaStatus();
            this.saveDocumentStatus();

        },
        saveContentAreaStatus: function(){

            var $holder = $(this.getEditorHolder());

            CONTENT_AREA_STATUS[ this.editor.uid ] = {
                width: $holder.css("width"),
                overflowX: $holder.css("overflowX"),
                overflowY: $holder.css("overflowY"),
                height: $holder.css("height")
            };

        },
        /**
         * 保存与指定editor相关的页面的状态
         */
        saveDocumentStatus: function(){

            var $doc = $( this.getEditorDocumentBody() );

            DOCUMENT_STATUS[ this.editor.uid ] = {
                overflowX: $doc.css( 'overflowX' ),
                overflowY: $doc.css( 'overflowY' )
            };
            DOCUMENT_ELEMENT_STATUS[ this.editor.uid ] = {
                overflowX: $( this.getEditorDocumentElement() ).css( 'overflowX'),
                overflowY: $( this.getEditorDocumentElement() ).css( 'overflowY' )
            };

        },
        /**
         * 恢复容器状态
         */
        revertContainerStatus: function(){
            $( this.editor.container ).css( this.getEditorStatus() );
        },
        /**
         * 恢复编辑区状态
         */
        revertContentAreaStatus: function(){
            var holder = this.getEditorHolder(),
                state = this.getContentAreaStatus();

            if ( this.supportMin() ) {
                delete state.height;
                holder.style.height = null;
            }

            $( holder ).css( state );
        },
        /**
         * 恢复页面状态
         */
        revertDocumentStatus: function() {

            var status = this.getDocumentStatus();
            $( this.getEditorDocumentBody() ).css( 'overflowX', status.body.overflowX );
            $( this.getEditorDocumentElement() ).css( 'overflowY', status.html.overflowY );

        },
        setDocumentStatus: function(){
            $(this.getEditorDocumentBody()).css( {
                overflowX: 'hidden',
                overflowY: 'hidden'
            } );
            $(this.getEditorDocumentElement()).css( {
                overflowX: 'hidden',
                overflowY: 'hidden'
            } );
        },
        /**
         * 检测当前编辑器是否处于全屏状态全屏状态
         * @returns {boolean} 是否处于全屏状态
         */
        isFullState: function(){
            return !!this.editor._edui_fullscreen_status;
        },
        /**
         * 获取编辑器状态
         */
        getEditorStatus: function(){
            return STATUS_CACHE[ this.editor.uid ];
        },
        getContentAreaStatus: function(){
            return CONTENT_AREA_STATUS[ this.editor.uid ];
        },
        getEditorDocumentElement: function(){
            return this.editor.container.ownerDocument.documentElement;
        },
        getEditorDocumentBody: function(){
            return this.editor.container.ownerDocument.body;
        },
        /**
         * 获取编辑区包裹对象
         */
        getEditorHolder: function(){
            return this.editor.body;
        },
        /**
         * 获取编辑器状态
         * @returns {*}
         */
        getDocumentStatus: function(){
            return {
                'body': DOCUMENT_STATUS[ this.editor.uid ],
                'html': DOCUMENT_ELEMENT_STATUS[ this.editor.uid ]
            };
        },
        supportMin: function () {

            var node = null;

            if ( !this._support ) {

                node = document.createElement("div");

                this._support = "minWidth" in node.style;

                node = null;

            }

            return this._support;

        },
        getBound: function () {

            var tags = {
                    html: true,
                    body: true
                },
                result = {
                    top: 0,
                    left: 0
                },
                offsetParent = null;

            if ( !$.IE6 ) {
                return result;
            }

            offsetParent = this.editor.container.offsetParent;

            if( offsetParent && !tags[ offsetParent.nodeName.toLowerCase() ] ) {
                tags = offsetParent.getBoundingClientRect();
                result.top = -tags.top;
                result.left = -tags.left;
            }

            return result;

        },
        getStyleValue: function (attr) {
            return parseInt(domUtils.getComputedStyle( this.getEditorHolder() ,attr));
        }
    };


    $.extend( Fullscreen, {
        /**
         * 监听resize
         */
        listen: function(){

            var timer = null;

            if( Fullscreen._hasFullscreenListener ) {
                return;
            }

            Fullscreen._hasFullscreenListener = true;

            $( window ).on( 'resize', function(){

                if( timer !== null ) {
                    window.clearTimeout( timer );
                    timer = null;
                }

                timer = window.setTimeout(function(){

                    for( var key in FULLSCREENS ) {
                        FULLSCREENS[ key ].resize();
                    }

                    timer = null;

                }, 50);

            } );

        },

        getInstance: function ( editor ) {

            if ( !FULLSCREENS[editor.uid  ] ) {
                new Fullscreen( editor );
            }

            return FULLSCREENS[editor.uid  ];

        }

    });

    //开始监听
    Fullscreen.listen();

})();