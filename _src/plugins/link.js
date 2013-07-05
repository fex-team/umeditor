///import core
///commands 超链接,取消链接
///commandsName  Link,Unlink
///commandsTitle  超链接,取消链接
///commandsDialog  dialogs\link
/**
 * 超链接
 * @function
 * @name baidu.editor.execCommand
 * @param   {String}   cmdName     link插入超链接
 * @param   {Object}  options         url地址，title标题，target是否打开新页
 * @author zhanyi
 */
/**
 * 取消链接
 * @function
 * @name baidu.editor.execCommand
 * @param   {String}   cmdName     unlink取消链接
 * @author zhanyi
 */

UE.plugins['link'] = function(){

    UE.commands['link'] = {
        execCommand : function( cmdName, opt ) {
            var me = this,
                rng = me.selection.getRange();
            rng.select();
            me.document.execCommand('createlink',false,'_ueditor_link');
            utils.each(domUtils.getElementsByTagName(me.body,'a',function(n){
                return n.getAttribute('href') == '_ueditor_link'
            }),function(l){
                domUtils.setAttributes(l,opt)
            })
        }
    };
    UE.commands['unlink'] = {
        execCommand : function() {
            this.document.execCommand('unlink');
        }
    };
};