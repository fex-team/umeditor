(function(){
    UE.registerWidget('image', {
        tpl: "",
        initContent: function (editor) {
            var lang = editor.getLang('image');
            if (lang) {
                var html = $.parseTmpl(this.tpl, lang.static);
            }
            this.root().html(html);
        },
        initEvent: function (editor, $w) {

        },
        buttons: {
            'ok': {
                label: '插入图片',
                exec: function(){

                }
            },
            'cancel':{}
        }

    })
})();

