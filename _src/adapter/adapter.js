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
        _activeWidget = null;

    function parseData(data, editor) {
        $.each(data, function (i, v) {
            if (v.label) {
                if(!v.icon){
                    v.icon = v.exec || v.dialog || v.widget;
                }
                if(v.dialog){
                    v.exec = function(){
                        var dialog = $.proxy(_editorUI[v.dialog],editor, v.dialog,'menu')();
                        return function(){
                            if (!dialog.parent()[0]) {
                                editor.$container.find('.edui-dialog-container').append(dialog);
                            }
                            dialog.edui().show();
                            UE.setActiveEditor(editor);
                        }
                    }();
                    v.query = $.proxy(function(cmdName){return this.queryCommandState(cmdName)},editor, v.dialog);
                }else {
                    if (v.data) {
                        $.each(v.data,function(i,data){
                           if(!data.exec && v.exec && $.type(v.exec) == 'string'){
                                data.exec = $.proxy(function(name,val){this.execCommand(name,val)},editor, v.exec, data.value||'')
                           }
                            if(!data.query && (!v.query || !$.isFunction(v.query))){
                                data.query = $.proxy(function(name,val){return this.queryCommandState(name,val)},editor, v.exec, data.value||'')
                            }
                        });

                        v.value = $.proxy(function(editor,name){
                            var root = this.root(),value = editor.queryCommandValue(name);
                            root.find('li').each(function(index,li){
                                var $li = $(li);
                                if($li.data('value') === value.toLowerCase()){
                                    $li.find('i').addClass('icon-ok')
                                }else{
                                    $li.find('i').removeClass('icon-ok')
                                }
                            })


                        },null,editor, v.exec);
                        parseData(v.data, editor,v);
                    } else {
                        var command;
                        if(v.widget && _editorUI[v.widget]) {
                            if(!v.query){
                                v.query = v.widget;
                            }
                            v.widget = $.proxy(_editorUI[v.widget],editor, v.widget,'menu')();
                            if($.type(v.query) == 'string'){
                                command = v.query;
                                v.query = $.proxy(function(name){return this.queryCommandState(name)},editor,command);
                            }
                        }else{
                            if ($.type(v.exec) == 'string') {
                                command = v.exec;
                                //有插件  就执行插件
                                if( UE.commands[ command ] || editor.commands[ command ] ) {
                                    v.exec = $.proxy(function(name){this.execCommand(name)},editor,command);

                                //否则， 检查一下是否有注册的UI
                                } else if( _editorUI[ command ] ) {
                                    v.exec = $.proxy(_editorUI[ command ], editor,command, 'menu');
                                }
                                if (!v.query) {
                                    v.query = $.proxy(function(name){return this.queryCommandState(name)},editor,command);
                                }
                            } else {
                                var fn = v.exec;
                                v.exec = $.proxy(fn, null, editor, v);
                                var queryfn = v.query;
                                v.query = $.proxy(queryfn, null, editor, v);
                            }
                        }

                    }
                }


            }
            if(v.shortkey){
                v.shortkey = v.shortkey.toUpperCase()
            }

        });
        return data;
    }

    utils.extend(UE, {
        registerUI: function (name, fn) {
            utils.each(name.split(/\s+/), function (uiname) {
                _editorUI[uiname] = fn;
            })
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
                    $.eduitooltip('attachTo');
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
            editor.$container = $container;
            editor.container = $container[0];
            $container.find('.edui-editor-body').append($editorCont).before(this.createToolbar(editor.options, editor,$container));

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
        createToolbar: function (options, editor,$container) {
            var me = this;
            var $toolbar = $.eduitoolbar(), toolbar = $toolbar.edui();
            //创建下来菜单列表

            if (options.menulist && options.menulist.length) {
                $.each(options.menulist, function (i, v) {
                    if(v.data){
                        $.eduicontextmenu(parseData(v.data, editor))
                            .edui()
                            .attachTo(toolbar.appendToTextmenu(toolbar.createTextItem(v.label)));
                    }else{

                        if(v.dialog){
                            var $dialog = UE.getUI(editor,v.dialog,'menu');
                            v.exec = function(){
                                if(!$dialog.parent()[0]){
                                    $container.find('.edui-dialog-container').append($dialog)
                                }
                                $dialog.edui().show()
                            }
                        }
                        v.caret = 0;
                        toolbar.appendToTextmenu(toolbar.createTextItem(v))
                    }


                });
                toolbar.appendToBtnmenu($.eduibutton({
                    icon:'expand',
                    texttype:true,
                    click:function(){
                        var $i = this.root().find('i');
                        if($i.hasClass('icon-expand')){
                            $i[0].className = 'icon-collapse';
                            $toolbar.find('.edui-text-toolbar').slideUp(200);
                        }else{
                            $i[0].className = 'icon-expand';
                            $toolbar.find('.edui-text-toolbar').slideDown(200)
                        }
                    },
                    title:editor.getLang('collapsebtn')
                }),{'float':'right'})
            } else {
                $toolbar.find('.edui-text-toolbar').remove()
            }

            if (options.toolbar && options.toolbar.length) {

                $.each(options.toolbar,function(i,groupstr){
                    var btngroup = [];
                    $.each(groupstr.split(/\s+/),function(index,name){
                        var ui = me.getUI(editor,name);

                        ui && btngroup.push(ui);
                    });
                    toolbar.appendToBtnmenu(btngroup);
                });


            } else {
                $toolbar.find('.edui-btn-toolbar').remove()
            }
            return $toolbar;
        }

    })


})();


