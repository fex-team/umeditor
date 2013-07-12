(function(){
    function hrefStartWith(href, arr) {
        href = href.replace(/^\s+|\s+$/g, '');
        for (var i = 0, ai; ai = arr[i++];) {
            if (href.indexOf(ai) == 0) {
                return true;
            }
        }
        return false;
    }

    UE.registerWidget('link', {
        tpl: "<style type=\"text/css\">" +
            ".edui-link-table{font-size: 12px;margin: 10px;line-height: 30px}" +
            ".edui-link-txt{width:300px;height:21px;line-height:21px;border:1px solid #d7d7d7;}" +
            "</style>" +
            "<table class=\"edui-link-table\">" +
            "<tr>" +
            "<td><label for=\"href\"><%=lang_input_url%></label></td>" +
            "<td><input class=\"edui-link-txt\" id=\"edui-link-Jhref\" type=\"text\" /></td>" +
            "</tr>" +
            "<tr>" +
            "<td><label for=\"title\"><%=lang_input_title%></label></td>" +
            "<td><input class=\"edui-link-txt\" id=\"edui-link-Jtitle\" type=\"text\"/></td>" +
            "</tr>" +
            "<tr>" +
            "<td colspan=\"2\">" +
            "<label for=\"target\"><%=lang_input_target%></label>" +
            "<input id=\"edui-link-Jtarget\" type=\"checkbox\"/>" +
            "</td>" +
            "</tr>" +
            "<tr>" +
            "<td colspan=\"2\" id=\"edui-link-Jmsg\"></td>" +
            "</tr>" +
            "</table>",
        initContent: function (editor) {
            var lang = editor.getLang('link');
            if (lang) {
                var html = $.parseTmpl(this.tpl, lang.static);
            }
            this.root().html(html);
        },
        initEvent: function (editor, $w) {
            var lang = editor.getLang('link');

            $('#edui-link-Jhref').on("blur", function () {
                if (!hrefStartWith(this.value, ["http", "/", "ftp://"])) {
                    $("#edui-link-Jmsg").html("<span style='color: red'>" + lang.httpPrompt + "</span>")
                } else {
                    $("#edui-link-Jmsg").html();
                }
            });
        },
        buttons: {
            'ok': {
                label: '插入链接',
                exec: function (editor, $w) {
                    var href = $('#edui-link-Jhref').val().replace(/^\s+|\s+$/g, '');

                    if (href) {
                        if (!hrefStartWith(href, ["http", "/", "ftp://"])) {
                            href = "http://" + href;
                        }
                        var obj = {
                            'href': href,
                            'target': $("#edui-link-Jtarget:checked").length ? "_blank" : '_self',
                            'title': $("#edui-link-Jtitle").val().replace(/^\s+|\s+$/g, ''),
                            '_href': href
                        };

                        editor.execCommand('link', obj);
                    }
                }
            },
            'cancel':{}
        }

    })
})();

