/**
 * @file adapter.js
 * @desc adapt ui to editor
 * @import core/Editor.js, core/utils.js
 */

(function () {
    var _editorUI = {},
        _editors = {},
        _readyFn = [],
        _activeEditor = null,
        _activeWidget = null,
        _widgetData = {};

    UE._widgetData = _widgetData;

    utils.extend(UE, {
        registerUI: function (name, fn) {
            utils.each(name.split(/\s+/), function (uiname) {
                _editorUI[uiname] = fn;
            })
        },
        registerWidget : function(name,pro){
            _widgetData[name] = $.extend(pro,{
                $root : null,
                _preventDefault:false,
                root:function($el){
                    return this.$root || (this.$root = $el);
                },
                preventDefault:function(){
                    this._preventDefault = true;
                }
            });
        },
        getWidgetData : function(name){
            return _widgetData[name]
        },
        setWidgetBody : function(name,$widget,editor){
            var pro = _widgetData[name];
            if(!pro){
                return null;
            }
            pro.root($widget.edui().getBodyContainer());
            pro.root().html('');
            pro.initContent(editor,$widget);
            if(!pro._preventDefault){
                pro.initEvent(editor,$widget);
            }

            pro.width &&  $widget.width(pro.width);
            pro.height  &&  $widget.height(pro.height)

        },
        getUI:function(editor,name,mode){
            if(_editorUI[name]){
                return $.proxy(_editorUI[name],editor,name,mode)()
            }
            return null;
        },
        setActiveEditor:function(editor){
            _activeEditor = editor;
        },
        getActiveEditor: function ($widget) {

            var ac;
            utils.each(UE.instants, function (editor) {
                if (editor.selection.isFocus()) {
                    ac = editor;
                    return false;
                }
            });

            if(ac){
                return ac;
            }
            var $container = $widget.parents('.edui-container');
            if(_activeEditor){
                if($container[0] === _activeEditor.container){
                    return _activeEditor
                }
            }
            $.each(_editors,function(id,val){
                if(val.container === $container[0]){
                    ac = val;
                    return false;
                }
            });
            return ac;

        },
        setActiveWidget : function($widget){
            _activeWidget = $widget;
        },
        getActiveWidget : function(){
            return  _activeWidget
        },
        getEditor: function (id, options) {
            return _editors[id] || (_editors[id] = this.createEditor(id, options));

        },
        ready: function( fn ){
            _readyFn.push( fn );
        },
        createEditor: function (id, opt) {
            var editor = new UE.Editor(opt);
            var T = this;
            utils.loadFile(document,{
                href: editor.options.themePath +editor.options.theme+ "/_css/ueditor.css",
                tag:"link",
                type:"text/css",
                rel:"stylesheet"
            },function(){
                editor.langIsReady ? $.proxy(renderUI,T)() : editor.addListener("langReady", $.proxy(renderUI,T));
                function renderUI(){


                    var $container = this.createUI('#' + id, editor);
                    editor.ready(function(){
                        $.each( _readyFn, function( index, fn ){
                            $.proxy( fn, editor )();
                        } );
                    });


                    editor.render(id);
                    $container.css({
                        width: $(editor.iframe).width()
                    });

                    //添加tooltip;
                    $.eduitooltip('attachTo').css('z-index',editor.getOpt('zIndex')+1);


                    $container.find('a').click(function(evt){
                        evt.preventDefault()
                    })
                }
            });


            return editor;

        },
        createUI: function (id, editor) {
            var $editorCont = $(id),
                $container = $('<div class="edui-container"><div class="edui-editor-body"></div><div class="edui-dialog-container"></div></div>').insertBefore($editorCont);
            editor.$container = $container.css('zIndex',editor.getOpt('zIndex') + 1);
            editor.container = $container[0];

            $container.find('.edui-editor-body').append($editorCont).before(this.createToolbar(editor.options, editor));

            if(editor.options.elementpath || editor.options.wordCount){
                var $bottombar = $('<div class="edui-bottombar"></div>');
                $container.append($bottombar);
                $bottombar.insertBefore($('.edui-dialog-container',$container));

            }
            if(editor.options.elementpath){
                $bottombar.append(this.getUI(editor,'elementpath'));
            }

            return $container;
        },
        createToolbar: function (options, editor) {
            var me = this;
            var $toolbar = $.eduitoolbar(), toolbar = $toolbar.edui();
            //创建下来菜单列表

            if (options.toolbar && options.toolbar.length) {
                var btns = [];
                $.each(options.toolbar,function(i,uiNames){
                    $.each(uiNames.split(/\s+/),function(index,name){
                        var ui = me.getUI(editor,name);
                        ui && btns.push(ui);
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


