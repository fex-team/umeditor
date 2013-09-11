/**
 * Created with JetBrains PhpStorm.
 * User: dongyancen
 * Date: 13-8-19
 * Time: 下午3:11
 * To change this template use File | Settings | File Templates.
 */
module("plugins.dropfile");
test( 'dropfile', function () {
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UM.getEditor('ue');
    editor.ready(function () {
        var fileList = [
            {type: "image/jpeg", size: 42466, name: "cc50ddfcc3cec3fdd59d8becd688d43f8694274d.jpg"}
        ]
        var originalEvent = {dataTransfer: {files: fileList}};
        editor.$body.trigger( {type:"drop",originalEvent: originalEvent});
        setTimeout(function () {
            UM.clearCache('ue');
            te.dom.push(editor.container);
            start();
        }, 600);
    });
    stop();
} );