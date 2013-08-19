///import core
///commands 预览
///commandsName  Preview
///commandsTitle  预览
/**
 * 预览
 * @function
 * @name UE.execCommand
 * @param   {String}   cmdName     preview预览编辑器内容
 */
UE.commands['preview'] = {
    execCommand : function(){
        var w = window.open('', '_blank', ''),
            d = w.document;
        d.open();
        d.write('<html><head></head><body><div>'+this.getContent(null,null,true)+'</div></body></html>');
        d.close();
    },
    notNeedUndo : 1
};
