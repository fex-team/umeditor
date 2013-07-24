UE.registerUI( 'emotion', function( name ){
    var me = this,
        url  = me.options.UEDITOR_HOME_URL + 'dialogs/' +name+ '/'+name+'.js';

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
        var data = UE.getWidgetData(name);

        data.width && (opt.width = data.width);
        data.height && (opt.height = data.height);

        $.eduipopup(opt).css('zIndex',me.options.zIndex + 1)
            .edui()
            .on('beforeshow',function(){
                var $root = this.root();
                if(!$root.parent().length){
                    me.$container.find('.edui-dialog-container').append($root);
                }
                UE.setWidgetBody(name,$root,me);
            }).attachTo($btn,{
                offsetTop:-8,
                caretTop:-11
            });
    });
    return $btn;

} );