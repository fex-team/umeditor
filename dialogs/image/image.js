(function () {
    var Upload = {
        uploadTpl: '<div class="edui-image-upload%%" id="edui-image-Jupload%%">' +
            '<span class="edui-image-icon"></span>' +
            '<form class="edui-image-form" method="post" enctype="multipart/form-data" target="up">' +
            '<input class="edui-image-file" type="file" name="upfile" accept="image/gif,image/jpeg,image/png,image/jpg,image/bmp"/>' +
            '</form>' +
            '<iframe name="up" style="display: none"></iframe>' +
            '</div>',
        init: function (editor) {
            var me = this;

            me.editor = editor;
            me.render("#edui-image-Jlocal", 1);
            me.config("#edui-image-Jupload1");
            me.submit("#edui-image-Jupload1", function () {
                $("#edui-image-Jupload1").css("display", "none");
            });
        },
        render: function (sel, t) {
            var me = this;

            $(sel).append($(me.uploadTpl.replace(/%%/g, t)));
        },
        config: function (sel) {
            debugger;
            var me = this;
            $("form", $(sel)).attr("action", me.editor.options.imageUrl);
        },
        submit: function (sel, callback) {
            var me = this;

            $("input", $(sel)).on("change", function () {
                $(this).parent().submit();
                me.toggleMask("图片上传中，别着急哦~~");
                callback && callback();
            });
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
        },
        toggleMask: function (html) {
            var $mask = $("#edui-image-Jmask");
            if (html) {
                $mask.addClass("active").html(html);
            } else {
                $mask.removeClass("active").html();
            }
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
        }
    }

    UE.upload_callback = function (url, state) {
        Upload.toggleMask();

        if (state == "SUCCESS") {
            $("<img src='" + editor.options.scrawlPath + url + "' class='edui-image-pic' />").on("load", function () {
                Upload.scale(this, 120);

                var $item = $("<div class='edui-image-item'><div class='edui-image-close'></div></div>").append(this);

                if ($("#edui-image-Jupload2").length < 1) {
                    $("#edui-image-Jcontent").append($item);

                    Upload.render("#edui-image-Jcontent", 2);
                    Upload.config("#edui-image-Jupload2");
                    Upload.submit("#edui-image-Jupload2");
                } else {
                    $("#edui-image-Jupload2").before($item);
                }

                Upload.close($(this));
            });

        } else {
            alert(state);
        }
    }

    UE.registerWidget('image', {
        tpl: "<style type=\"text/css\">" +
            ".edui-image-wrapper{font-size: 12px;margin: 15px;}" +
            "</style>" +
            "<link rel=\"stylesheet\" type=\"text/css\" href=\"<%=image_url%>image.css\">" +
            "<div id=\"edui-image-Jwrapper\" class=\"edui-image-wrapper\">" +
            "<ul class=\"edui-tab-nav\">" +
            "<li class=\"edui-tab-item active\"><a href=\"#edui-image-Jlocal\" class=\"edui-tab-text\">本地上传</a></li>" +
            "<li  class=\"edui-tab-item\"><a href=\"#edui-image-JimgSearch\" class=\"edui-tab-text\">图片搜索</a></li>" +
            "</ul>" +
            "<div class=\"edui-tab-content\">" +
            "<div id=\"edui-image-Jlocal\" class=\"edui-tab-pane active\">" +
            "<div class=\"edui-image-content\" id=\"edui-image-Jcontent\"></div>" +
            "<div class=\"edui-image-mask\" id=\"edui-image-Jmask\"></div>" +
            "</div>" +
            "<div id=\"edui-image-JimgSearch\" class=\"edui-tab-pane\">2</div>" +
            "</div>" +
            "</div>",
        initContent: function (editor) {
            var lang = editor.getLang('image')["static"];

            var opt=$.extend({}, lang, {
                image_url: UEDITOR_CONFIG.UEDITOR_HOME_URL + 'dialogs/image/'
            });
            if (lang) {
                var html = $.parseTmpl(this.tpl, opt);
            }

            this.root().html(html);

        },
        initEvent: function (editor, $w) {
            $.eduitab({selector: "#edui-image-Jwrapper"});
            Upload.init(editor);
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

    })
})();

