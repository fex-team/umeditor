///import core
///import plugins\inserthtml.js
///commands 分割线
///commandsName  Horizontal
///commandsTitle  分隔线
/**
 * 分割线
 * @function
 * @name UM.execCommand
 * @param {String}     cmdName    horizontal插入分割线
 */
UM.plugins['horizontal'] = function(){
    var me = this;
    me.commands['horizontal'] = {
        execCommand : function(  ) {
            this.document.execCommand('insertHorizontalRule');
            var rng = me.selection.getRange().txtToElmBoundary(true),
                start = rng.startContainer;
            if(domUtils.isBody(rng.startContainer)){
                var next = rng.startContainer.childNodes[rng.startOffset];
                if(!next){
                    next = $('<p></p>').appendTo(rng.startContainer).html(browser.ie ? '&nbsp;' : '<br/>')[0]
                }
                rng.setStart(next,0).setCursor()
            }else{

                while(dtd.$inline[start.tagName] && start.lastChild === start.firstChild){

                    var parent = start.parentNode;
                    parent.appendChild(start.firstChild);
                    parent.removeChild(start);
                    start = parent;
                }
                while(dtd.$inline[start.tagName]){
                    start = start.parentNode;
                }
                if(start.childNodes.length == 1 && start.lastChild.nodeName == 'HR'){
                    var hr = start.lastChild;
                    $(hr).insertBefore(start);
                    rng.setStart(start,0).setCursor();
                }else{
                    hr = $('hr',start)[0];
                    domUtils.breakParent(hr,start);
                    var pre = hr.previousSibling;
                    if(pre && domUtils.isEmptyBlock(pre)){
                        $(pre).remove()
                    }
                    rng.setStart(hr.nextSibling,0).setCursor();
                }

            }
        }
    };

};

