///import core
/**
 * @description 插入内容
 * @name UE.execCommand
 * @param   {String}   cmdName     inserthtml插入内容的命令
 * @param   {String}   html                要插入的内容
 * @author zhanyi
 */
UE.commands['inserthtml'] = {
    execCommand: function (command,html,notNeedFilter){
        var me = this;
        if(!html){
            return;
        }
        if(me.fireEvent('beforeinserthtml',html) === true){
            return;
        }
        if (!notNeedFilter) {
            var root = UE.htmlparser(html);
            //如果给了过滤规则就先进行过滤
            if(me.options.filterRules){
                UE.filterNode(root,me.options.filterRules);
            }
            //执行默认的处理
            me.filterInputRule(root);
            html = root.toHtml()
        }
        var rng = me.selection.getRange();
        rng.select();
        if(browser.ie ){
            var nRng = me.selection.getIERange(true);
            html += '<span id="_ue_tmp_cursor_node">&nbsp;</span>';
            nRng.pasteHTML(html);
            var $tmp = $('#_ue_tmp_cursor_node',me.body);
            new dom.Range(document,me.body).setStartBefore($tmp[0]).collapse(true).select();
            $tmp.remove()

        }else{
            me.document.execCommand('insertHTML',false,html)
        }

        setTimeout(function(){

            me.fireEvent('afterinserthtml');
            setTimeout(function(){
                me.selection.getRange().scrollIntoView();
            },50)
        },50)

    }
};
