UE.registerUI( 'emotion', function( name ){
    var me = this,
        url  = me.options.UEDITOR_HOME_URL + 'dialogs/' +name+ '/'+name+'.js',
        $popup;

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

        $popup = $.eduipopup(opt).on('beforeshow',function(){
            UE.setWidgetBody(name,$popup,editor)
        });
    });


    var $btn = $.eduibutton({
        icon: name,
        click: function () {
            if(!$popup.parent().length){
                me.$container.find('.edui-dialog-container').append($popup);
            }
            $popup.css('zIndex',me.options.zIndex + 1).edui().show($btn,'left','position');
        },
        title: this.getLang('labelMap')[name] || ''
    });

    $btn.edui().register('click', $btn, function () {
        $popup.hide()
    });
    return $btn;

} );