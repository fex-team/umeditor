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

        var editor = this;

        UE.Fullscreen = Fullscreen;

        function Fullscreen( options ) {

            if( !options.editor ) {
                throw new Error('invalid params, notfound editor');
            }

            this._button = $.eduibutton({
                icon: options.icon || 'resize-full',
                title: options.title || editor.getLang("labelMap.fullscreen") || '',
                click: options.click || function(){}
            });

            this.register( options.editor );

        }

        Fullscreen.prototype = {

            /**
             * 为该按钮注册对应的编辑器
             * @param editor 编辑器对象
             */
            register: function( editor ){

                if( !BUTTON_MAPPING[ editor.uid ] ) {
                    BUTTON_MAPPING[ editor.uid ] = [];
                }

                BUTTON_MAPPING[ editor.uid ].push( this._button );

            },
            /**
             * 返回按钮对象
             */
            button: function(){
                return this._button;
            }

        }

        $.extend( Fullscreen, {

            /**
             * 全屏状态切换
             * @param editor 需要切换状态的编辑器对象
             */
            toggle: function( editor ){

                //当前编辑器的缩放状态
                var _edui_fullscreen_status = Fullscreen.getEditorFullState( editor );

                //更新状态
                this.update( editor, !_edui_fullscreen_status );

                editor.fireEvent('beforefullscreenchange', !_edui_fullscreen_status );

                !_edui_fullscreen_status ? Fullscreen.full( editor ) : Fullscreen.revert( editor );

            },
            /**
             * 全屏
             * @param editor 需要执行全屏动作的编辑器实例
             */
            full: function( editor ){

                var $win = $(window);

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

                $( this.getEditorHolder( editor ) ).css({
                    width: width + 'px',
                    height: height - $( '.edui-toolbar', editor.container ).outerHeight() - $( '.edui-bottombar', editor.container).outerHeight() + 'px'
                });

            },
            /**
             * 全屏还原
             * @param editor 需要执行全屏还原动作的编辑器实例
             */
            revert: function( editor ){

                var status = this.getEditorStatus( editor );

                $( editor.container ).css( status );

                this.revertContentAreaStatus( editor );

                this.revertDocumentStatus( editor );

            },
            /**
             * 更新状态
             * @param editor 编辑器对象
             * @param isFull 当前状态是否是全屏状态
             */
            update: function( editor, isFull ) {

                var buttons = BUTTON_MAPPING[ editor.uid ],
                    items = MENUITEM_MAPPING[ editor.uid ];

                editor._edui_fullscreen_status = isFull;

                //按钮状态更新
                if( buttons ) {

                    $.each( buttons, function( index, $btn ){

                        $btn.find('.edui-icon').toggleClass( 'icon-resize-full').toggleClass( 'icon-resize-small' );
                        $btn.attr('data-original-title', isFull ? editor.getLang('labelMap.revert') : editor.getLang('labelMap.fullscreen') );

                    } );

                }

                if( items ) {

                    $.each( items, function( index, $item ){

                        $item.find('.edui-icon').toggleClass( 'icon-resize-full').toggleClass( 'icon-resize-small' );
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
            revertContentAreaStatus: function( editor ){

                var status = this.getContentAreaStatus( editor),
                    $contentArea = $( this.getEditorHolder( editor ) );

                $contentArea.css( status );

            },
            /**
             * 恢复页面状态
             */
            revertDocumentStatus: function( editor ) {

                var status = this.getDocumentStatus( editor),
                    $doc = $( this.getEditorDocument( editor ) );

                $doc.css( 'overflow', status.overflow );

            },
            /**
             * 根据提供的编辑器获取编辑器的全屏状态
             * @param editor 指定的编辑器
             * @returns {boolean} 是否处于全屏状态
             */
            getEditorFullState: function( editor ){
                return !!editor._edui_fullscreen_status;
            },
            /**
             * 获取编辑器状态
             * @param editor 指定的编辑器对象
             */
            getEditorStatus: function( editor ){

                return STATUS_CACHE[ editor.uid ];

            },
            getContentAreaStatus: function( editor ){

                return CONTENT_AREA_STATUS[ editor.uid ];

            },
            getEditorDocument: function( editor ){

                return editor.container.ownerDocument.body;

            },
            /**
             * 获取编辑区包裹对象
             */
            getEditorHolder: function( editor ){

                return editor.iframe.parentNode;

            },
            /**
             * 获取编辑器状态
             * @param editor
             * @returns {*}
             */
            getDocumentStatus: function( editor ){

                return DOCUMENT_STATUS[ editor.uid ];

            }

        } );


        //开始监听
        Fullscreen.registerEditor( editor );
        Fullscreen.listen();


        //初始化全屏按钮
        if( mode !== 'menu' ) {

            return new Fullscreen({
                icon: 'resize-full',
                title: editor.getLang("labelMap.fullscreen") || '',
                click: function(){
                    Fullscreen.toggle( editor );
                },
                editor: editor
            }).button();

        } else {

            //注册菜单栏
            Fullscreen.registerMenuItem( editor, item );
            //菜单栏
            Fullscreen.toggle( editor );

        }


    });

})();