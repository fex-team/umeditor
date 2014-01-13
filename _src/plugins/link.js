///import core
///commands 超链接,取消链接
///commandsName  Link,Unlink
///commandsTitle  超链接,取消链接
///commandsDialog  dialogs\link
/**
 * 超链接
 * @function
 * @name UM.execCommand
 * @param   {String}   cmdName     link插入超链接
 * @param   {Object}  options         url地址，title标题，target是否打开新页
 * @author zhanyi
 */
/**
 * 取消链接
 * @function
 * @name UM.execCommand
 * @param   {String}   cmdName     unlink取消链接
 * @author zhanyi
 */

UM.plugins['link'] = function(){
    var me = this;

    me.setOpt('autourldetectinie',false);
    //在ie下禁用autolink
    if(browser.ie && this.options.autourldetectinie === false){
        this.addListener('keyup',function(cmd,evt){
            var me = this,keyCode = evt.keyCode;
            if(keyCode == 13 || keyCode == 32){
                var rng = me.selection.getRange();
                var start = rng.startContainer;
                if(keyCode == 13){
                    if(start.nodeName == 'P'){
                        var pre = start.previousSibling;
                        if(pre && pre.nodeType == 1){
                            var pre = pre.lastChild;
                            if(pre && pre.nodeName == 'A' && !pre.getAttribute('_href')){
                                domUtils.remove(pre,true);
                            }
                        }
                    }
                }else if(keyCode == 32){
                   if(start.nodeType == 3 && /^\s$/.test(start.nodeValue)){
                       start = start.previousSibling;
                       if(start && start.nodeName == 'A' && !start.getAttribute('_href')){
                           domUtils.remove(start,true);
                       }
                   }
                }

            }


        });
    }

    this.addOutputRule(function(root){
        $.each(root.getNodesByTagName('a'),function(i,a){
            var _href = utils.html(a.getAttr('_href'));
            if(!/^(ftp|https?|\/|file)/.test(_href)){
                _href = 'http://' + _href;
            }
            a.setAttr('href', _href);
            a.setAttr('_href')
            if(a.getAttr('title')==''){
                a.setAttr('title')
            }
        })
    });
    this.addInputRule(function(root){
        $.each(root.getNodesByTagName('a'),function(i,a){
            a.setAttr('_href', utils.html(a.getAttr('href')));
        })
    });
    me.commands['link'] = {
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
                me.document.execCommand('createlink',false,'_umeditor_link');
                utils.each(domUtils.getElementsByTagName(me.body,'a',function(n){

                    return n.getAttribute('href') == '_umeditor_link'
                }),function(l){
                    if($(l).text() == '_umeditor_link'){
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
    me.commands['unlink'] = {
        execCommand : function() {
            this.document.execCommand('unlink');
        }
    };
};