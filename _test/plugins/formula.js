module("plugins.formula");
/**
 * 插入公式
 * 更新公式
 */
test( '插入公式', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<p><br></p>' );
    range.setStart( body.firstChild, 0 ).collapse( 1 ).select();

    editor.execCommand( 'formula', '\\frac{x}{y}' );

    var $iframe = $('iframe', editor.body);
    equal($iframe.length, 1, '正常插入公式');
    equal($iframe.hasClass('mathquill-embedded-latex'), true, '公式classname正常');
    equal($iframe.attr('data-latex'), "\\frac{x}{y}", '公式latex值设置正确');
    equal(editor.getContent(), '<p><span class="mathquill-embedded-latex">\\frac{x}{y}</span></p>', '正常设置内容');
} );

test( '更新公式', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<p><br></p>' );
    range.setStart( body.firstChild, 0 ).collapse( 1 ).select();

    editor.execCommand( 'formula', '\\frac{x}{y}' );
    var $iframe = $('iframe', editor.body);
    $iframe.addClass('edui-formula-active');

    setTimeout(function(){
        editor.execCommand( 'formula', '\\frac{z1}{z2}' );
        equal($iframe.attr('data-latex'), "\\frac{x}{y}\\frac{z1}{z2}", '公式latex值更新正确');
        equal($( editor.getContent() ).find('.mathquill-embedded-latex').text(), '\\frac{x}{y}\\frac{z1}{z2}', '正常获取公式latex内容');

        start();
    }, 200);
    stop();
} );

test('trace:3880:插入公式',function(){
    var editor = te.obj[0];
    var body = editor.body;
    var range = te.obj[1];
    editor.setContent('<ol><li>x</li><li>hello2</li><li id="3">hello3</li></ol>');
    var text = body.firstChild.firstChild.firstChild;
    range.setStart(text,0).collapse(true).select();
    editor.execCommand('formula','\\int{x}{y}');
    var text3 = $(".mathquill-embedded-latex").attr("data-latex");
    equal(text3,'\\int{x}{y}','公式插入成功');
});