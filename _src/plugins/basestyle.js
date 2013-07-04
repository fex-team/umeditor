///import core
///commands 加粗,斜体,上标,下标
///commandsName  Bold,Italic,Subscript,Superscript
///commandsTitle  加粗,加斜,下标,上标
/**
 * b u i等基础功能实现
 * @function
 * @name baidu.editor.execCommands
 * @param    {String}    cmdName    bold加粗。italic斜体。subscript上标。superscript下标。
*/
UE.plugins['basestyle'] = function(){

    var basestyles = ['bold','underline','superscript','subscript','italic','strikeThrough'],
        me = this;
    //添加快捷键
    me.addshortcutkey({
        "Bold" : "ctrl+66",//^B
        "Italic" : "ctrl+73", //^I
        "Underline" : "ctrl+85"//^U
    });
    me.addOutputRule(function(root){
        utils.each(root.getNodesByTagName('b i'),function(node){
            switch (node.tagName){
                case 'b':
                    node.tagName = 'strong';
                    break;
                case 'i':
                    node.tagName = 'em';
            }
        });
    });

    for(var i= 0,ci;ci=basestyles[i++];){
        (function( cmd ) {
            me.commands[cmd] = {
                execCommand : function( cmdName ) {
                    this.document.execCommand(cmdName)
                },
                queryCommandState : function(cmdName) {
                    return this.document.queryCommandState(cmdName)
                }
            };
        })( ci );
    }
};

