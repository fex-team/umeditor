///import core
///commands 打印
///commandsName  Print
///commandsTitle  打印
/**
 * @description 打印
 * @name UE.execCommand
 * @param   {String}   cmdName     print打印编辑器内容
 * @author zhanyi
 */
UE.commands['print'] = {
    execCommand : function(){
        var iframe = document.createElement('iframe'),
            id = 'editor-print-' + +new Date();

        iframe.id = id;
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        var w = window.open('', id, ''),
            d = w.document;

        d.open();
        d.write('<html><head><script>' +
            "setTimeout(function(){" +
            "window.print();" +
            "window.parent.$('#"+id+"').remove();" +
            "},300);" +
            '</script></head><body><div>'+this.getContent(null,null,true)+'</div></body></html>');
        d.close();
    },
    notNeedUndo : 1
};