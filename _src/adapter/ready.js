/**
 * 编辑器ready统一入口
 */

UE.ready(function(){

    var editor = this;

    (function(){

        var tips = UE.getUI( editor, 'edittip', 'menu'),
            inited = false;

        editor.addListener("delcells", function () {

            UE.setActiveEditor(editor);
            editor.$activeDialog = tips;

            if( !inited ) {
                inited = true;
                tips.appendTo($('.edui-dialog-container'));
            }

            tips.edui().show();

        });

    })();

});



UE.ready(function(){
    var T = this;
    this.addListener('click',function(){
        T.$container.find('.dropdown-menu').each(function(){
            $(this).edui().hide()
        })
    })

});
