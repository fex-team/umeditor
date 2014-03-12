module( "plugins.autosave" );

test('自动保存', function () {

    var count = 0;
    UM.clearCache('testDefault');
    $('.edui-body-container')[0].parentNode.removeChild($('.edui-body-container')[0]);
    var container = document.createElement("div");
    container.id = "container";
    document.body.appendChild(container);

    editor = UM.getEditor("container", {
        initialContent: "",
        //无限制
        saveInterval: 0
    });


    editor.addListener("beforeautosave", function (type, data) {

        data.content = data.content.toLowerCase();
        equal(true, true, "成功触发beforeautosave事件");
        equal(data.content === "<p>http://www.baidu.com</p>" || data.content === "<p>disable</p>", true, "事件携带数据正确");
    });

    editor.addListener("beforeautosave", function (type, data) {
        data.content = data.content.toLowerCase();
        if (data.content === "<p>disable</p>") {
            return false;
        }

        count++;

    });

    editor.addListener("afterautosave", function (type, data) {

        data.content = data.content.toLowerCase();
        equal(data.content, "<p>http://www.baidu.com</p>", "成功触发afterautosave事件");
        window.setTimeout(function () {
        equal(editor.execCommand("getlocaldata") !== null, true, "getlocaldata命令正常");
        editor.execCommand("clearlocaldata");
        equal(editor.execCommand("getlocaldata") === "", true, "clearlocaldata命令正常");
        }, 50);
    });

    stop();
    window.setTimeout(function () {

        editor.setContent('<p>disable</p>');


        window.setTimeout(function () {

            editor.setContent('<p>http://www.baidu.com</p>');

            window.setTimeout(function () {

                equal(count, 1, "触发事件次数");
                UM.delEditor("container");
                document.getElementById('container') && document.getElementById('container').parentNode.removeChild(document.getElementById('container'));
                start();
            }, 500);

        }, 50);

    }, 500);

});
test('重建编辑器,加载草稿箱', function () {
    if(ua.browser.ie<9)return;//延迟问题,手动过
    UM.clearCache('testDefault');
    $('.edui-body-container')[0].parentNode.removeChild($('.edui-body-container')[0]);
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UM.getEditor('ue', {saveInterval: 0});
    setTimeout(function () {
        var content = '<p>内容</p>';
        editor.setContent(content);
        setTimeout(function () {
            UM.delEditor('ue');
            document.getElementById('ue') && document.getElementById('ue').parentNode.removeChild(document.getElementById('ue'));
            var div = document.body.appendChild(document.createElement('div'));
            div.id = 'ue';
            var editor2 = UM.getEditor('ue');
            setTimeout(function () {
                equal(editor2.queryCommandState('drafts'), 0, '草稿箱可用');
                editor2.execCommand('drafts');
                ua.checkSameHtml(editor2.body.innerHTML, content, '内容加载正确');
                setTimeout(function () {

                    UM.delEditor('ue');
                    document.getElementById('ue') && document.getElementById('ue').parentNode.removeChild(document.getElementById('ue'));
                start();
                }, 2000);

            }, 500);
        }, 200);
    }, 500);
    stop();
});