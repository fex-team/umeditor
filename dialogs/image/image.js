(function () {
    /*
     * 本地上传
     * */
    var Upload = {
        uploadTpl: '<div class="edui-image-upload%%" id="edui-image-Jupload%%">' +
            '<span class="edui-image-icon"></span>' +
            '<form class="edui-image-form" method="post" enctype="multipart/form-data" target="up">' +
            '<input class="edui-image-file" type="file" name="upfile" accept="image/gif,image/jpeg,image/png,image/jpg,image/bmp"/>' +
            '</form>' +
            '<iframe name="up" style="display: none"></iframe>' +
            '</div>',
        init: function (editor, $w) {
            var me = this;

            me.editor = editor;
            me.dialog = $w;

            me.render("#edui-image-Jlocal", 1);
            me.config("#edui-image-Jupload1");
            me.submit("#edui-image-Jupload1", function () {
                $("#edui-image-Jupload1").css("display", "none");
            });

            return me;
        },
        render: function (sel, t) {
            var me = this;

            $(sel, me.dialog).append($(me.uploadTpl.replace(/%%/g, t)));

            return me;
        },
        config: function (sel) {
            var me = this;
            $("form", $(sel, me.dialog)).attr("action", me.editor.options.imageUrl);

            return me;
        },
        submit: function (sel, callback) {
            var me = this;

            $("input", $(sel, me.dialog)).on("change", function () {
                $(this).parent().submit();
                me.toggleMask("图片上传中，别着急哦~~");
                callback && callback();
            });

            return me;
        },
        close: function ($img) {
            $img.css({
                top: ($img.parent().height() - $img.height()) / 2,
                left: 0
            }).prev().on("click",function () {
                    $(this).parent().remove();
                }).parent().hover(function () {
                    $(this).toggleClass("hover");
                });


            return this;
        },
        toggleMask: function (html) {
            var me = this;

            var $mask = $("#edui-image-Jmask", me.dialog);
            if (html) {
                $mask.addClass("active").html(html);
            } else {
                $mask.removeClass("active").html();
            }

            return me;
        },
        scale: function (img, max, oWidth, oHeight) {
            var width = 0, height = 0, percent, ow = img.width || oWidth, oh = img.height || oHeight;
            if (ow > max || oh > max) {
                if (ow >= oh) {
                    if (width = ow - max) {
                        percent = (width / ow).toFixed(2);
                        img.height = oh - oh * percent;
                        img.width = max;
                    }
                } else {
                    if (height = oh - max) {
                        percent = (height / oh).toFixed(2);
                        img.width = ow - ow * percent;
                        img.height = max;
                    }
                }
            }

            return this;
        }
    };

    /*
     * 网络搜索
     * */
    var Search = {
        init: function (editor, $w) {
            var me = this;

            me.editor = editor;
            me.dialog = $w;

        }
    }

    UE.registerWidget('image', {
        tpl: "<link rel=\"stylesheet\" type=\"text/css\" href=\"<%=image_url%>image.css\">" +
            "<div id=\"edui-image-Jwrapper\" class=\"edui-image-wrapper\">" +
            "<ul class=\"edui-tab-nav\">" +
            "<li class=\"edui-tab-item active\"><a href=\"#edui-image-Jlocal\" class=\"edui-tab-text\">本地上传</a></li>" +
            "<li  class=\"edui-tab-item\"><a href=\"#edui-image-JimgSearch\" class=\"edui-tab-text\">网络图片</a></li>" +
            "</ul>" +
            "<div class=\"edui-tab-content\">" +
            "<div id=\"edui-image-Jlocal\" class=\"edui-tab-pane active\">" +
            "<div class=\"edui-image-content\" id=\"edui-image-Jcontent\"></div>" +
            "<div class=\"edui-image-mask\" id=\"edui-image-Jmask\"></div>" +
            "</div>" +
            "<div id=\"edui-image-JimgSearch\" class=\"edui-tab-pane\">" +

            "</div>" +
            "</div>" +
            "</div>",
        initContent: function (editor) {
            var lang = editor.getLang('image')["static"],
                opt = $.extend({}, lang, {
                    image_url: UEDITOR_CONFIG.UEDITOR_HOME_URL + 'dialogs/image/'
                });

            if (lang) {
                var html = $.parseTmpl(this.tpl, opt);
            }

            this.root().html(html);

        },
        initEvent: function (editor, $w) {
            $.eduitab({selector: "#edui-image-Jwrapper"});

            Upload.init(editor, $w);

            Search.init(editor, $w);
        },
        buttons: {
            'ok': {
                label: '插入图片',
                exec: function () {
                    editor.execCommand('insertimage', obj);
                }
            },
            'cancel': {}
        }
    }, function (editor, $w, url, state) {
        Upload.toggleMask();

        if (state == "SUCCESS") {
            $("<img src='" + editor.options.imagePath + url + "' class='edui-image-pic' />").on("load", function () {
                Upload.scale(this, 120);

                var $item = $("<div class='edui-image-item'><div class='edui-image-close'></div></div>").append(this);

                if ($("#edui-image-Jupload2", $w).length < 1) {
                    $("#edui-image-Jcontent", $w).append($item);

                    Upload.render("#edui-image-Jcontent", 2)
                        .config("#edui-image-Jupload2")
                        .submit("#edui-image-Jupload2");
                } else {
                    $("#edui-image-Jupload2", $w).before($item);
                }

                Upload.close($(this));
            });

        } else {
            alert(state);
        }
    })
})();

