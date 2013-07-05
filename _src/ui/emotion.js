/**
 * 表情组件
 */

(function(){

    UE.ui.define ( 'emotion' , {

        defaultOpt: {
            url: 'about: blank'
        },
        tpl: function( options ){
            return '<iframe src="<%=url%>" width="100%" height="100%" frameborder="0"></iframe>';
        },
        init: function( options ){

            var me = this;

            me.root( $( $.parseTmpl( me.supper.mergeTpl( me.tpl( options ) ), options ) ) );

            me.root().attr('id', 'edui-emotion');
            me.root().addClass('edui-emotion-popup');

        }

    }, 'popup' );

})();