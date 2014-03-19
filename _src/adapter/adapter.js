/**
 * @file adapter.js
 * @desc adapt ui to editor
 * @import core/Editor.js, core/utils.js
 */

(function () {
    var _editorUI = {},
        _editors = {},
        _readyFn = [],
        _activeWidget = null,
        _widgetData = {},
        _widgetCallBack = {},
        _cacheUI = {},
        _maxZIndex = null;

    utils.extend(UM, {
        defaultWidth : 500,
        defaultHeight : 500,
        registerUI: function (name, fn) {
            utils.each(name.split(/\s+/), function (uiname) {
                _editorUI[uiname] = fn;
            })
        },

        setEditor : function(editor){
            !_editors[editor.id] && (_editors[editor.id] = editor);
        },
        registerWidget : function(name,pro,cb){
            _widgetData[name] = $.extend2(pro,{
                $root : '',
                _preventDefault:false,
                root:function($el){
                    return this.$root || (this.$root = $el);
                },
                preventDefault:function(){
                    this._preventDefault = true;
                },
                clear:false
            });
            if(cb){
                _widgetCallBack[name] = cb;
            }
        },
        getWidgetData : function(name){
            return _widgetData[name]
        },
        setWidgetBody : function(name,$widget,editor){
            if(!editor._widgetData){

                utils.extend(editor,{
                    _widgetData : {},
                    getWidgetData : function(name){
                        return this._widgetData[name];
                    },
                    getWidgetCallback : function(widgetName){
                        var me = this;
                        return function(){
                            return  _widgetCallBack[widgetName].apply(me,[me,$widget].concat(Array.prototype.slice.call(arguments,0)))
                        }
                    }
                })

            }
            var pro = _widgetData[name];
            if(!pro){
                return null;
            }
            pro = editor._widgetData[name];
            if(!pro){
                pro = _widgetData[name];
                pro = editor._widgetData[name] = $.type(pro) == 'function' ? pro : utils.clone(pro);
            }

            pro.root($widget.edui().getBodyContainer());

            pro.initContent(editor,$widget);
            if(!pro._preventDefault){
                pro.initEvent(editor,$widget);
            }

            pro.width &&  $widget.width(pro.width);


        },
        setActiveWidget : function($widget){
            _activeWidget = $widget;
        },
        getEditor: function (id, options) {
            var editor = _editors[id] || (_editors[id] = this.createEditor(id, options));
            _maxZIndex = _maxZIndex ? Math.max(editor.getOpt('zIndex'), _maxZIndex):editor.getOpt('zIndex');
            return editor;
        },
        setTopEditor: function(editor){
            $.each(_editors, function(i, o){
                if(editor == o) {
                    editor.$container && editor.$container.css('zIndex', _maxZIndex + 1);
                } else {
                    o.$container && o.$container.css('zIndex', o.getOpt('zIndex'));
                }
            });
        },
        clearCache : function(id){
            if ( _editors[id]) {
                delete  _editors[id]
            }
        },
        delEditor: function (id) {
            var editor;
            if (editor = _editors[id]) {
                editor.destroy();
            }
        },
        ready: function( fn ){
            _readyFn.push( fn );
        },
        createEditor: function (id, opt) {
            var editor = new UM.Editor(opt);
            var T = this;

            editor.langIsReady ? $.proxy(renderUI,T)() : editor.addListener("langReady", $.proxy(renderUI,T));
            function renderUI(){


                var $container = this.createUI('#' + id, editor);
                editor.key=id;
                editor.ready(function(){
                    $.each( _readyFn, function( index, fn ){
                        $.proxy( fn, editor )();
                    } );
                });
                var options = editor.options;
                if(options.initialFrameWidth){
                    options.minFrameWidth = options.initialFrameWidth
                }else{
                    options.minFrameWidth = options.initialFrameWidth = editor.$body.width() || UM.defaultWidth;
                }

                $container.css({
                    width: options.initialFrameWidth,
                    zIndex:editor.getOpt('zIndex')
                });

                //ie6下缓存图片
                UM.browser.ie && UM.browser.version === 6 && document.execCommand("BackgroundImageCache", false, true);

                editor.render(id);


                //添加tooltip;
                $.eduitooltip && $.eduitooltip('attachTo', $("[data-original-title]",$container)).css('z-index',editor.getOpt('zIndex')+1);

                $container.find('a').click(function(evt){
                    evt.preventDefault()
                });

                editor.fireEvent("afteruiready");
            }

            return editor;

        },
        createUI: function (id, editor) {
            var $editorCont = $(id),
                $container = $('<div class="edui-container"><div class="edui-editor-body"></div></div>').insertBefore($editorCont);
            editor.$container = $container;
            editor.container = $container[0];

            editor.$body = $editorCont;

            //修正在ie9+以上的版本中，自动长高收起时的，残影问题
            if(browser.ie && browser.ie9above){
                var $span = $('<span style="padding:0;margin:0;height:0;width:0"></span>');
                $span.insertAfter($container);
            }
            //初始化注册的ui组件
            $.each(_editorUI,function(n,v){
                var widget = v.call(editor,n);
                if(widget){
                    _cacheUI[n] = widget;
                }

            });

            $container.find('.edui-editor-body').append($editorCont).before(this.createToolbar(editor.options, editor));

            $container.find('.edui-toolbar').append($('<div class="edui-dialog-container"></div>'));


            return $container;
        },
        createToolbar: function (options, editor) {
            var $toolbar = $.eduitoolbar(), toolbar = $toolbar.edui();
            //创建下来菜单列表

            if (options.toolbar && options.toolbar.length) {
                var btns = [];
                $.each(options.toolbar,function(i,uiNames){
                    $.each(uiNames.split(/\s+/),function(index,name){
                        if(name == '|'){
                                $.eduiseparator && btns.push($.eduiseparator());
                        }else{
                            var ui = _cacheUI[name];
                            if(name=="fullscreen"){
                                ui&&btns.unshift(ui);
                            }else{
                                ui && btns.push(ui);
                            }
                        }

                    });
                    btns.length && toolbar.appendToBtnmenu(btns);
                });
            } else {
                $toolbar.find('.edui-btn-toolbar').remove()
            }
            return $toolbar;
        }

    })


})();


