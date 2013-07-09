(function () {
    var dialogUrlMap = {
        'link': 'link/link.js'
    };

    $.each(dialogUrlMap,function(key){
         UE.registerUI(key,function(name){

             var me = this, currentRange, $dialog,
                 opt = {
                     title: (me.options.labelMap && me.options.labelMap[name]) || me.getLang("labelMap." + name),
                     url: me.options.UEDITOR_HOME_URL + '/dialogs/' +
                         ((me.options.dialogUrlMap && me.options.dialogUrlMap[name]) || dialogUrlMap[name])
                 };

             //加载模版数据
             utils.loadFile({
                 src: opt.url,
                 tag: "script",
                 type: "text/javascript",
                 defer: "defer"
             },function(){
                 var data = UE.getWidgetData(name);
                 if(data.buttons){
                     var tmpObj = data.buttons.ok;
                     if(tmpObj){
                         opt.oklabel = tmpObj.oklabel || me.getLang('ok');
                         if(tmpObj.exec){
                             opt.okFn = $.proxy(opt.exec,editor)
                         }
                     }
                     tmpObj = data.buttons.cancal;
                     if(tmpObj){
                         opt.cancellabel = tmpObj.cancellabel || me.getLang('cancel');
                         if(tmpObj.exec){
                             opt.okFn = $.proxy(tmpObj.exec,editor)
                         }
                     }
                 }
                 data.width && (opt.width = data.width);
                 data.height && (opt.height = data.height);

                 $dialog = $.eduimodal(opt);

                 $dialog.attr('id', 'edui-dialog-' + name)
                     .find('.modal-body').addClass('edui-dialog-' + name + '-body');

                 $dialog.edui().on('beforehide',function () {
                     var rng = me.selection.getRange();
                     if (rng.equals(currentRange)) {
                         rng.select()
                     }
                 }).on('beforeshow', function () {
                         currentRange = me.selection.getRange();
                         UE.setActiveWidget(this.root());
                         UE.setWidgetBody(name,$dialog,me);

                     });

             })


             var $btn = $.eduibutton({
                 icon: name,
                 click: function () {
                     if(!$dialog)
                        return;
                     if (!$dialog.parent()[0]) {
                         me.$container.find('.edui-dialog-container').append($dialog);
                     }
                     $dialog.edui().show();
                     UE.setActiveEditor(me);
                     me.$activeDialog = $dialog;
                 },
                 title: this.getLang('labelMap')[name] || ''
             });

             me.addListener('selectionchange', function () {
                 var state = this.queryCommandState(name);
                 $btn.edui().disabled(state == -1).active(state == 1)
             });
             return $btn;
         })
    })
})();

