UE.registerUI('link image gmap map insertvideo',function(name){

    var me = this, currentRange, $dialog,
        dialogUrl = {
            insertvideo: 'video'
        },
        curDialogUrl = dialogUrl[ name ] || name,
        opt = {
            title: (me.options.labelMap && me.options.labelMap[name]) || me.getLang("labelMap." + name),
            url: me.options.UEDITOR_HOME_URL + 'dialogs/' + curDialogUrl + '/' + curDialogUrl + '.js'
        };

    //加载模版数据
    utils.loadFile(document,{
        src: opt.url,
        tag: "script",
        type: "text/javascript",
        defer: "defer"
    },function(){
        //调整数据
        var data = UE.getWidgetData(name);
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

        $dialog.attr('id', 'edui-dialog-' + name)
            .find('.edui-modal-body').addClass('edui-dialog-' + name + '-body');

        $dialog.edui().on('beforehide',function () {
            var rng = me.selection.getRange();
            if (rng.equals(currentRange)) {
                rng.select()
            }
        }).on('beforeshow', function () {
                currentRange = me.selection.getRange();
                UE.setWidgetBody(name,$dialog,me);
        }).on('afterbackdrop',function(){
            this.$backdrop.css('zIndex',me.getOpt('zIndex')+1).appendTo(me.$container.find('.edui-dialog-container'))
            $dialog.css('zIndex',me.getOpt('zIndex')+2)
        })


    });


    var $btn = $.eduibutton({
        icon: name,
        click: function () {
            if(!$dialog)
                return;
            if (!$dialog.parent()[0]) {
                me.$container.find('.edui-dialog-container').append($dialog);
            }
            $dialog.edui().show();

        },
        title: this.getLang('labelMap')[name] || ''
    });

    me.addListener('selectionchange', function () {
        var state = this.queryCommandState(name);
        $btn.edui().disabled(state == -1).active(state == 1)
    });
    return $btn;
});