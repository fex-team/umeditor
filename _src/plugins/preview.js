///import core
///commands 预览
///commandsName  Preview
///commandsTitle  预览
/**
 * 预览
 * @function
 * @name UM.execCommand
 * @param   {String}   cmdName     preview预览编辑器内容
 */
UM.commands['preview'] = {
    execCommand : function(){
        var w = window.open('', '_blank', ''),
            d = w.document,
            c = this.getContent(null,null,true),
            path = this.getOpt('UMEDITOR_HOME_URL'),
            formula = c.indexOf('mathquill-embedded-latex')!=-1 ?
                '<link rel="stylesheet" href="' + path + 'third-party/mathquill/mathquill.css"/>' +
                '<script src="' + path + 'third-party/jquery.min.js"></script>' +
                '<script src="' + path + 'third-party/mathquill/mathquill.min.js"></script>':'';
        d.open();
        d.write('<html><head>' + formula + '</head><body><div>'+c+'</div></body></html>');
        d.close();
    },
    notNeedUndo : 1
};
