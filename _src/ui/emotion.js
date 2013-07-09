/**
 * 表情组件
 */

(function(){

    UE.ui.define ( 'emotion' , {
        init: function( options ){
            var me = this;
            utils.loadFile(document, {
                src: options.url,
                tag: "script",
                type: "text/javascript",
                defer: "defer"
            });

            me.root( $( $.parseTmpl( me.supper.tpl, options ) ) ).addClass('edui-emotion-popup');
        }

    }, 'popup' );

})();