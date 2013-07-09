UE.registerUI( 'emotion', function( name ){
    var editor = this,
        emotionUrl = editor.options.UEDITOR_HOME_URL + 'dialogs/' +name+ '/'+name+'.js';

    var $popup = $.eduipopup({
        url: emotionUrl
    }).edui().on('beforeshow',function(){
            UE.setWidgetBody(name,$popup,editor)
        }).root();


    var $btn = $.eduibutton({
        icon: name,
        click: function () {
            $popup.edui().show();
        },
        title: this.getLang('labelMap')[name] || ''
    });
    $btn.edui().mergeWith($popup);

    return $btn;

} );