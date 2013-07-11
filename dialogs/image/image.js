(function () {
    UE.registerWidget('image', {
        tpl: "<div id=\"edui-image-Jwrapper\">" +
            "<ul class=\"edui-nav\">" +
            "<li><a href=\"#edui-image-Jlocal\">本地上传</a></li>" +
            "<li><a href=\"#edui-image-JimgSearch\">图片搜索</a></li>" +
            "</ul>" +
            "<div class=\"edui-tab-content\">" +
            "<div id=\"edui-image-Jlocal\" class=\"edui-tab-pane active\"></div>" +
            "<div id=\"edui-image-JimgSearch\" class=\"edui-tab-pane\"></div>" +
            "</div>" +
            "</div>",
        initContent: function (editor) {
            var lang = editor.getLang('image');
            if (lang) {
                var html = $.parseTmpl(this.tpl, lang.static);
            }
            this.root().html(html);
        },
        initEvent: function (editor, $w) {
            $.eduitab({selector:"#edui-image-Jwrapper",context:document});
        },
        buttons: {
            'ok': {
                label: '插入图片',
                exec: function () {

                }
            },
            'cancel': {}
        }

    })
})();

