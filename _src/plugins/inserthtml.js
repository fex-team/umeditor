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
            html += '<span id="_ue_tmp_cursor_node">&nbsp;</span> ';
            nRng.pasteHTML(html);
            var tmp = $('#_ue_tmp_cursor_node',me.body)[0];
            var rng = new dom.Range(document,me.body).setStartBefore(tmp);
            $(tmp).remove();
            rng.setCursor(false,true);


        }else{
            var nativeSel = me.selection.getNative();
            var nativeRange = nativeSel.getRangeAt(0);
            nativeRange.deleteContents();
            var frag = me.document.createDocumentFragment();
            var arr=[];
            $.each($('<div></div>').html(html)[0].childNodes,function(i,n){
                arr.push(n)
            });
            $.each(arr,function(i,n){
                frag.appendChild(n);
            });

            nativeRange.insertNode(frag);
            nativeRange.collapse(false);
            nativeSel.removeAllRanges();
            nativeSel.addRange(nativeRange);
        }

        setTimeout(function(){

            me.fireEvent('afterinserthtml');
            setTimeout(function(){
                me.selection.getRange().scrollIntoView();
            },50)
        },50)

    }
};
