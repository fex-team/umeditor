UE.registerWidget('link',{
    tpl:
        '<table class="edui-link-table">'+
            '<tr>'+
                '<td><label for="href"><%=lang_input_url%></label></td>'+
                '<td><input class="edui-dialog-txt" id="href" type="text" /></td>'+
            '</tr>'+


        '</table>',
    initContent:function(editor){
        debugger
        var lang = editor.getLang('link');
        if(lang){
            var html = $.parseTmpl(this.tpl,lang.static);
        }
        this.root().html(html);
    },
    initEvent:function(editor,$w){

    }
})

