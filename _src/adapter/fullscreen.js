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
        DOCUMENT_ELEMENT_STATUS = {},

        FULLSCREENS = [];


    UE.registerUI('fullscreen', function( name ){

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

                this.setDocumentStatus();

                this.resize();

            },
            /**
             * 全屏还原
             */
            revert: function(){

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
                    editor = this.editor,
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

                $( editor.container ).css( {
                    width: width + 'px',
                    height: height + 'px',
                    position: 'fixed',
                    _position: 'absolute',
                    top: 0,
                    left: 0,
                    margin: 0,
                    padding: 0
                } );


                $( editorBody ).css({
                    width: width - 2*borderWidth + 'px',
                    height: height - 2*borderWidth - $( '.edui-toolbar', editor.container ).outerHeight() - $( '.edui-bottombar', editor.container).outerHeight() + 'px'
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

                var $doc = $( this.getEditorDocumentBody() );

                DOCUMENT_STATUS[ this.editor.uid ] = {
                    overflow: $doc.css( 'overflow' )
                };
                DOCUMENT_ELEMENT_STATUS[ this.editor.uid ] = {
                    overflow: $( this.getEditorDocumentElement() ).css( 'overflow' )
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
                $( this.getEditorHolder() ).css( this.getContentAreaStatus() );
            },
            /**
             * 恢复页面状态
             */
            revertDocumentStatus: function() {

                var status = this.getDocumentStatus();
                $( this.getEditorDocumentBody() ).css( 'overflow', status.body.overflow );
                $( this.getEditorDocumentElement() ).css( 'overflow', status.html.overflow );

            },
            setDocumentStatus: function(){
                this.getEditorDocumentBody().style.overflow = 'hidden';
                this.getEditorDocumentElement().style.overflow = 'hidden';
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
                return this.editor.iframe;
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
            }

        };


        $.extend( Fullscreen, {
            /**
             * 监听resize
             */
            listen: function(){

                var timer = null;

                if( UE._hasFullscreenListener ) {
                    return;
                }

                UE._hasFullscreenListener = true;

                $( window ).on( 'resize', function(){

                    if( timer !== null ) {
                        window.clearTimeout( timer );
                        timer = null;
                    }

                    timer = window.setTimeout(function(){

                        for( var i = 0, len = FULLSCREENS.length; i < len; i++ ) {
                            FULLSCREENS[ i ].resize();
                        }

                        timer = null;

                    }, 50);

                } );

            }
        });

        //开始监听
        Fullscreen.listen();

    })();

})();