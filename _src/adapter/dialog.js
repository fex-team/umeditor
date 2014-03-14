UM.registerUI('link image video map formula',function(name){

    var me = this, currentRange, $dialog,
        opt = {
            title: (me.options.labelMap && me.options.labelMap[name]) || me.getLang("labelMap." + name),
            url: me.options.UMEDITOR_HOME_URL + 'dialogs/' + name + '/' + name + '.js'
        };

    var $btn = $.eduibutton({
        icon: name,
        title: this.getLang('labelMap')[name] || ''
    });
    //加载模版数据
    utils.loadFile(document,{
        src: opt.url,
        tag: "script",
        type: "text/javascript",
        defer: "defer"
    },function(){
        //调整数据
        var data = UM.getWidgetData(name);
        if(!data) return;
        if(data.buttons){
            var ok = data.buttons.ok;
            if(ok){
                opt.oklabel = ok.label || me.getLang('ok');
                if(ok.exec){
                    opt.okFn = function(){
                        return $.proxy(ok.exec,null,me,$dialog)()
                    }
                }
            }
            var cancel = data.buttons.cancel;
            if(cancel){
                opt.cancellabel = cancel.label || me.getLang('cancel');
                if(cancel.exec){
                    opt.cancelFn = function(){
                        return $.proxy(cancel.exec,null,me,$dialog)()
                    }
                }
            }
        }
        data.width && (opt.width = data.width);
        data.height && (opt.height = data.height);

        $dialog = $.eduimodal(opt);

        $dialog.attr('id', 'edui-dialog-' + name).addClass('edui-dialog-' + name)
            .find('.edui-modal-body').addClass('edui-dialog-' + name + '-body');

        $dialog.edui().on('beforehide',function () {
            var rng = me.selection.getRange();
            if (rng.equals(currentRange)) {
                rng.select()
            }
        }).on('beforeshow', function () {
                var $root = this.root(),
                    win = null,
                    offset = null;
                currentRange = me.selection.getRange();
                if (!$root.parent()[0]) {
                    me.$container.find('.edui-dialog-container').append($root);
                }

                //IE6下 特殊处理, 通过计算进行定位
                if( $.IE6 ) {

                    win = {
                        width: $( window ).width(),
                        height: $( window ).height()
                    };
                    offset = $root.parents(".edui-toolbar")[0].getBoundingClientRect();
                    $root.css({
                        position: 'absolute',
                        margin: 0,
                        left: ( win.width - $root.width() ) / 2 - offset.left,
                        top: 100 - offset.top
                    });

                }
                UM.setWidgetBody(name,$dialog,me);
                UM.setTopEditor(me);
        }).on('afterbackdrop',function(){
            this.$backdrop.css('zIndex',me.getOpt('zIndex')+1).appendTo(me.$container.find('.edui-dialog-container'))
            $dialog.css('zIndex',me.getOpt('zIndex')+2)
        }).on('beforeok',function(){
            try{
                currentRange.select()
            }catch(e){}
        }).attachTo($btn)
    });




    me.addListener('selectionchange', function () {
        var state = this.queryCommandState(name);
        $btn.edui().disabled(state == -1).active(state == 1)
    });
    return $btn;
});