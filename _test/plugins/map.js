/**
 * Created by dongyancen on 14-1-20.
 */
/*test('', function () {
    stop();
    UM.clearCache('testDefault');
    $('.edui-body-container')[0].parentNode.removeChild($('.edui-body-container')[0]);
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'map';
    var editor = UM.getEditor('map');
    setTimeout(function () {
        var i = editor.$container.find($(".edui-btn-map"));
//        i.trigger('click');
        editor.$container.find($('.edui-map-dynamic')).eq(1).attr("checked","checked");
        var dialog = editor.$container.find($('.edui-dialog-map'))
//        edui-dialog-map
//        dialog.find($('.edui-btn-primary')).eq(1).attr("checked","checked");
        dialog.find($('.edui-btn-primary')).trigger('click');
        //edui-btn-primary
    }, 200)

});*/


test('trace:3878:地图dialog显示',function(){
    var editor = te.obj[0];
    var body = editor.body;
    var range = te.obj[1];
    editor.setContent("<p>123</p>");
    var text = body.firstChild.firstChild;
    range.setStart(text,'0').collapse(true).select();
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'xe';
    var editor2 = UM.getEditor('xe');
    editor2.ready(function(){
        var range2 = new UM.dom.Range(editor2.document,editor2.body);
        var body2 = editor2.body;
        editor2.setContent( '<p>123</p>' );
        range2.selectNode( body2.firstChild ).select();
    setTimeout(function () {
        var i = editor2.$container.find($(".edui-btn-map"));
        i.trigger('click');
        var map_body = String($('.edui-map-city')[0].value);
        i.trigger('click');
    equal(map_body,'北京','地图dialog正常显示');
    $(div).remove();
        start();
    }, 200);
    });
    stop();
});