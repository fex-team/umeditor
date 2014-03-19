UM.registerUI( 'emotion formula', function( name ){
    var me = this,
        url  = me.options.UMEDITOR_HOME_URL + 'dialogs/' +name+ '/'+name+'.js';

    var $btn = $.eduibutton({
        icon: name,
        title: this.getLang('labelMap')[name] || ''
    });

    //加载模版数据
    utils.loadFile(document,{
        src: url,
        tag: "script",
        type: "text/javascript",
        defer: "defer"
    },function(){
        var opt = {
            url : url
        };
        //调整数据
        var data = UM.getWidgetData(name);

        data.width && (opt.width = data.width);
        data.height && (opt.height = data.height);

        $.eduipopup(opt).css('zIndex',me.options.zIndex + 1)
            .addClass('edui-popup-' + name)
            .edui()
            .on('beforeshow',function(){
                var $root = this.root();
                if(!$root.parent().length){
                    me.$container.find('.edui-dialog-container').append($root);
                }
                UM.setWidgetBody(name,$root,me);
                UM.setTopEditor(me);
            }).attachTo($btn,{
                offsetTop:-5,
                offsetLeft:10,
                caretLeft:11,
                caretTop:-8
            });
        me.addListener('selectionchange', function () {
            var state = this.queryCommandState(name);
            $btn.edui().disabled(state == -1).active(state == 1);
        });
    });
    return $btn;

} );