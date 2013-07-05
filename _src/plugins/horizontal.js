///import core
///import plugins\inserthtml.js
///commands 分割线
///commandsName  Horizontal
///commandsTitle  分隔线
/**
 * 分割线
 * @function
 * @name baidu.editor.execCommand
 * @param {String}     cmdName    horizontal插入分割线
 */
UE.plugins['horizontal'] = function(){
    var me = this;
    me.commands['horizontal'] = {
        execCommand : function(  ) {
            this.document.execCommand('insertHorizontalRule');
        }
    };

};

