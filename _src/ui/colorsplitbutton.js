/**
 * Created with JetBrains PhpStorm.
 * User: hn
 * Date: 13-7-10
 * Time: 下午3:07
 * To change this template use File | Settings | File Templates.
 */
UM.ui.define('colorsplitbutton',{

    tpl : '<div class="edui-splitbutton <%if (name){%>edui-splitbutton-<%= name %><%}%>"  unselectable="on" <%if(title){%>data-original-title="<%=title%>"<%}%>><div class="edui-btn"  unselectable="on" ><%if(icon){%><div  unselectable="on" class="edui-icon-<%=icon%> edui-icon"></div><%}%><div class="edui-splitbutton-color-label" <%if (color) {%>style="background: <%=color%>"<%}%>></div><%if(text){%><%=text%><%}%></div>'+
            '<div  unselectable="on" class="edui-btn edui-dropdown-toggle" >'+
            '<div  unselectable="on" class="edui-caret"><\/div>'+
            '</div>'+
            '</div>',
    defaultOpt: {
        color: ''
    },
    init: function( options ){

        var me = this;

        me.supper.init.call( me, options );

    },
    colorLabel: function(){
        return this.root().find('.edui-splitbutton-color-label');
    }

}, 'splitbutton');