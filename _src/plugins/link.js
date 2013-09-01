///import core
///commands 超链接,取消链接
///commandsName  Link,Unlink
///commandsTitle  超链接,取消链接
///commandsDialog  dialogs\link
/**
 * 超链接
 * @function
 * @name UE.execCommand
 * @param   {String}   cmdName     link插入超链接
 * @param   {Object}  options         url地址，title标题，target是否打开新页
 * @author zhanyi
 */
/**
 * 取消链接
 * @function
 * @name UE.execCommand
 * @param   {String}   cmdName     unlink取消链接
 * @author zhanyi
 */

UE.plugins['link'] = function(){
    this.addOutputRule(function(root){
        $.each(root.getNodesByTagName('a'),function(i,a){
            a.setAttr('href', utils.html(a.getAttr('_href')));
            a.setAttr('_href')
        })
    });
    this.addInputRule(function(root){
        $.each(root.getNodesByTagName('a'),function(i,a){
            a.setAttr('_href', utils.html(a.getAttr('href')));
        })
    });
    UE.commands['link'] = {
        execCommand : function( cmdName, opt ) {

            var me = this;
            var rng = me.selection.getRange();
            if(rng.collapsed){
                var start = rng.startContainer;
                if(start = domUtils.findParentByTagName(start,'a',true)){
                    $(start).attr(opt);
                    rng.selectNode(start).select()
                }else{
                    rng.insertNode($('<a>' +opt.href+'</a>').attr(opt)[0]).select()

                }

            }else{
                me.document.execCommand('createlink',false,'_ueditor_link');
                utils.each(domUtils.getElementsByTagName(me.body,'a',function(n){

                    return n.getAttribute('href') == '_ueditor_link'
                }),function(l){
                    if($(l).text() == '_ueditor_link'){
                        $(l).text(opt.href);
                    }
                    domUtils.setAttributes(l,opt);
                    rng.selectNode(l).select()
                })
            }

        },
        queryCommandState:function(){
            return this.queryCommandValue('link') ? 1 : 0;
        },
        queryCommandValue:function(){
            var path = this.selection.getStartElementPath();
            var result;
            $.each(path,function(i,n){
                if(n.nodeName == "A"){
                    result = n;
                    return false;
                }
            })
            return result;
        }
    };
    UE.commands['unlink'] = {
        execCommand : function() {
            this.document.execCommand('unlink');
        }
    };
};