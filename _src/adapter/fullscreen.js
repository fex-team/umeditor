/**
 * 全屏组件
 */

(function(){

        //状态缓存
    var STATUS_CACHE = {},
        //状态值列表
        STATUS_LIST = [ 'width', 'height', 'position', 'top', 'left', 'margin', 'padding' ],
        CONTENT_AREA_STATUS = {},
        //页面状态
        DOCUMENT_STATUS = {},

        FULLSCREENS = [];

    UE.registerUI('fullscreen', function( name, mode, title, item ){

        var me = this,
            fullscreenHandler = new UE.Fullscreen( me ),
            $button = $.eduibutton({
                'icon': 'fullscreen',
                'title': (me.options.labelMap && me.options.labelMap[name]) || me.getLang("labelMap." + name),
                'click': function(){
                    //切换
                    fullscreenHandler.toggle();
                }
            });


        return $button;

    });

    (function(){


        UE.Fullscreen = Fullscreen;

        function Fullscreen( editor ) {

            if( !editor ) {
                throw new Error('invalid params, notfound editor');
            }

            this.editor = editor;

            //记录初始化的全屏组件
            FULLSCREENS[ editor.uid ] = this;

        }

        Fullscreen.prototype = {

            /**
             * 全屏状态切换
             * @param editor 需要切换状态的编辑器对象
             */
            toggle: function(){

                var editor = this.editor,
                    //当前编辑器的缩放状态
                    _edui_fullscreen_status = this.isFullState();

                editor.fireEvent('beforefullscreenchange', !_edui_fullscreen_status );

                //更新状态
                this.update( !_edui_fullscreen_status );

                !_edui_fullscreen_status ? this.enlarge() : this.revert();

                editor.fireEvent('afterfullscreenchange', _edui_fullscreen_status );

            },
            /**
             * 执行放大
             */
            enlarge: function(){

                this.saveSataus();

                this.getEditorDocument().style.overflow = 'hidden';

                this.resize();

            },
            /**
             * 全屏还原
             */
            revert: function(){

                var editor = this.editor,
                    status = this.getEditorStatus();

                $( editor.container ).css( status );

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
                    editor = this.editor;

                if( !this.isFullState() ) {
                    return;
                }

                $win = $( window );
                width = $win.width();
                height = $win.height();

                $( editor.container ).css( {
                    width: width + 'px',
                    height: height + 'px',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    margin: 0,
                    padding: 0
                } );

                $( this.getEditorHolder() ).css({
                    width: width + 'px',
                    height: height - $( '.edui-toolbar', editor.container ).outerHeight() - $( '.edui-bottombar', editor.container).outerHeight() + 'px'
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

                var style = this.getEditorHolder().style;

                CONTENT_AREA_STATUS[ this.editor.uid ] = {
                    width: style.width,
                    height: style.height
                };

            },
            /**
             * 保存与指定editor相关的页面的状态
             */
            saveDocumentStatus: function(){

                var $doc = $( this.getEditorDocument() );

                DOCUMENT_STATUS[ this.editor.uid ] = {
                    overflow: $doc.css( 'overflow' )
                };

            },
            /**
             * 恢复编辑区状态
             */
            revertContentAreaStatus: function(){

                var status = this.getContentAreaStatus(),
                    $contentArea = $( this.getEditorHolder() );

                $contentArea.css( status );

            },
            /**
             * 恢复页面状态
             */
            revertDocumentStatus: function() {

                var status = this.getDocumentStatus(),
                    $doc = $( this.getEditorDocument() );

                $doc.css( 'overflow', status.overflow );

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
            getEditorDocument: function(){
                return this.editor.container.ownerDocument.body;
            },
            /**
             * 获取编辑区包裹对象
             */
            getEditorHolder: function(){
                return this.editor.iframe;
            },
            /**
             * 获取编辑器状态
             * @returns {*}
             */
            getDocumentStatus: function(){
                return DOCUMENT_STATUS[ this.editor.uid ];
            }

        };


        $.extend( Fullscreen, {
            /**
             * 监听resize
             */
            listen: function(){

                if( UE._hasFullscreenListener ) {
                    return;
                }

                UE._hasFullscreenListener = true;

                $( window ).on( 'resize', function(){

                    for( var i = 0, len = FULLSCREENS.length; i < len; i++ ) {
                        FULLSCREENS[ i ].resize();
                    }

                } );

            }
        });

        //开始监听
        Fullscreen.listen();


    })();

})();