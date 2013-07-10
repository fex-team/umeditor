/**
 * 表情
 */

UE.registerUI( 'emotion', function( name ){
    var editor = this,
        emotionUrl = editor.options.UEDITOR_HOME_URL + '/dialogs/emotion/emotion.html';

    emotionPopup = $.eduiemotion({
        url: emotionUrl
    }).edui().on('beforeshow',function(){
        UE.setActiveWidget(this.root())
    }).root();

    return emotionPopup;

} );