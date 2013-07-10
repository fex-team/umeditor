/**
 * 全屏组件
 */

(function(){

    //编辑器和全屏按钮映射
    var BUTTON_MAPPING = {},

        //编辑器和菜单项按钮映射
        MENUITEM_MAPPING = {},

        //状态缓存
        STATUS_CACHE = {},
        //状态值列表
        STATUS_LIST = [ 'width', 'height', 'position', 'top', 'left', 'margin', 'padding' ],
        CONTENT_AREA_STATUS = {},

        //编辑器缓存
        EDITOR_CACHE = [],

        //页面状态
        DOCUMENT_STATUS = {};

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
            this.register();

        }

        Fullscreen.prototype = {

            /**
             * 为该按钮注册对应的编辑器
             */
            register: function(){

                var editor = this.editor;

                if( !BUTTON_MAPPING[ editor.uid ] ) {
                    BUTTON_MAPPING[ editor.uid ] = [];
                }

                BUTTON_MAPPING[ editor.uid ].push( this._button );

            },
            /**
             * 全屏状态切换
             * @param editor 需要切换状态的编辑器对象
             */
            toggle: function(){

                var editor = this.editor,
                    //当前编辑器的缩放状态
                    _edui_fullscreen_status = this.isFullState();

                //更新状态
                this.update( !_edui_fullscreen_status );

                editor.fireEvent('beforefullscreenchange', !_edui_fullscreen_status );

                !_edui_fullscreen_status ? this.enlarge() : this.revert();

                editor.fireEvent('afterfullscreenchange', _edui_fullscreen_status );

            },
            /**
             * 执行放大
             */
            enlarge: function(){

                var $win = $(window),
                    editor = this.editor;

                this.saveSataus( editor );

                this.getEditorDocument( editor ).style.overflow = 'hidden';

                var width = $win.width(),
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

                var buttons = BUTTON_MAPPING[ editor.uid ],
                    items = MENUITEM_MAPPING[ editor.uid ];

                this.editor._edui_fullscreen_status = isFull;

//                按钮状态更新
                if( buttons ) {

                    $.each( buttons, function( index, $btn ){

//                        $btn.find('.edui-icon').toggleClass( 'icon-resize-full').toggleClass( 'icon-resize-small' );
                        $btn.attr('data-original-title', isFull ? editor.getLang('labelMap.revert') : editor.getLang('labelMap.fullscreen') );

                    } );

                }

                if( items ) {

                    $.each( items, function( index, $item ){

//                        $item.find('.edui-icon').toggleClass( 'icon-resize-full').toggleClass( 'icon-resize-small' );
                        $item.find('.edui-item-label').text( isFull ? editor.getLang('labelMap.revert') : editor.getLang('labelMap.fullscreen') );

                    } )

                }


            },
            /**
             * 监听resize
             */
            listen: function(){

                var editor = null,
                    me = this;

                if( UE._hasFullscreenListener ) {
                    return;
                }

                UE._hasFullscreenListener = true;

                $( window ).on( 'resize', function(){

                    for( var i = 0, len = EDITOR_CACHE.length; i < len; i++ ) {

                        editor = EDITOR_CACHE[ i ];

                        //处于全屏状态才执行resize
                        if( Fullscreen.getEditorFullState( editor ) ) {

                            me.resize( editor );

                        }

                    }

                    editor = null;

                } );

            },
            /**
             * 注册编辑器, 以便统一处理resize
             */
            registerEditor: function( editor ){

                if( editor._fullscreen_reged ) {
                    return true;
                }

                editor._fullscreen_reged = true;

                EDITOR_CACHE.push( editor );

            },
            /**
             * 注册菜单项， 仍然为了统一处理
             */
            registerMenuItem: function( editor, item ){

                if( item._fullscreen_reged ) {
                    return;
                }

                item._fullscreen_reged = true;

                if( !MENUITEM_MAPPING[ editor.uid ] ) {
                    MENUITEM_MAPPING[ editor.uid ] = [];
                }

                MENUITEM_MAPPING[ editor.uid ].push( $( item ) );

            },
            /**
             * 调整给定编辑器的大小
             * @param editor 给定的编辑器对象
             */
            resize: function( editor ){

                var $win = $( window ),
                    width = $win.width(),
                    height = $win.height();

                $( editor.container ).css( {
                    width: width + 'px',
                    height: height + 'px'
                } );

                $( this.getEditorHolder( editor ) ).css( {
                    width: width + 'px',
                    height: height - $( '.edui-toolbar', editor.container ).outerHeight() - $( '.edui-bottombar', editor.container).outerHeight() + 'px'
                } );

            },
            /**
             * 保存状态
             */
            saveSataus: function( editor ){

                var styles = editor.container.style,
                    tmp = null,
                    cache = {};

                for( var i= 0, len = STATUS_LIST.length; i<len; i++ ) {

                    tmp = STATUS_LIST[ i ];
                    cache[ tmp ] = styles[ tmp ];

                }

                STATUS_CACHE[ editor.uid ] = cache;

                this.saveContentAreaStatus( editor );
                this.saveDocumentStatus( editor );

            },
            saveContentAreaStatus: function( editor ){

                var style = this.getEditorHolder( editor ).style;

                CONTENT_AREA_STATUS[ editor.uid ] = {
                    width: style.width,
                    height: style.height
                };

            },
            /**
             * 保存与指定editor相关的页面的状态
             * @param editor 指定的编辑器实例
             */
            saveDocumentStatus: function( editor ){

                var $doc = $( this.getEditorDocument( editor ) );

                DOCUMENT_STATUS[ editor.uid ] = {
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
            revertDocumentStatus: function( editor ) {

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

                return this.editor.iframe.parentNode;

            },
            /**
             * 获取编辑器状态
             * @returns {*}
             */
            getDocumentStatus: function(){
                return DOCUMENT_STATUS[ this.editor.uid ];
            }

        }



        //开始监听
//        Fullscreen.registerEditor( editor );
//        Fullscreen.listen();


    })();

})();