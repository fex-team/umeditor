/**
 * 表情
 */

UE.registerUI( 'emotion', function( name ){

    var me = this;

    return $.eduiemotion({
        url: me.options.UEDITOR_HOME_URL + '/dialogs/emotion/emotion.html'
    }).edui().on('beforeshow',function(){
        UE.setActiveWidget(this.root())
    }).root();

} );