/**
 * Created by dongyancen on 14-1-20.
 */
test('',function(){
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'map';
    var editor = UM.getEditor('map');
//debugger
//    ua.click(editor.$container.find($(".edui-btn-map")).eq(0));
//    editor.$container.find($(".edui-btn-map")).click();
    $i = editor.$container.find($(".edui-btn-map")).eq(0);
    $i.trigger('click');
    stop()
})