///import core
///commands 有序列表,无序列表
///commandsName  InsertOrderedList,InsertUnorderedList
///commandsTitle  有序列表,无序列表
/**
 * 有序列表
 * @function
 * @name UM.execCommand
 * @param   {String}   cmdName     insertorderlist插入有序列表
 * @param   {String}   style               值为：decimal,lower-alpha,lower-roman,upper-alpha,upper-roman
 * @author zhanyi
 */
/**
 * 无序链接
 * @function
 * @name UM.execCommand
 * @param   {String}   cmdName     insertunorderlist插入无序列表
 * * @param   {String}   style            值为：circle,disc,square
 * @author zhanyi
 */

UM.plugins['list'] = function () {
    var me = this;

    me.setOpt( {
        'insertorderedlist':{
            'decimal':'',
            'lower-alpha':'',
            'lower-roman':'',
            'upper-alpha':'',
            'upper-roman':''
        },
        'insertunorderedlist':{
            'circle':'',
            'disc':'',
            'square':''
        }
    } );

    this.addInputRule(function(root){
        utils.each(root.getNodesByTagName('li'), function (node) {
            if(node.children.length == 0){
                node.parentNode.removeChild(node);
            }
        })
    });
    me.commands['insertorderedlist'] =
    me.commands['insertunorderedlist'] = {
            execCommand:function (cmdName) {
                this.document.execCommand(cmdName);
                var rng = this.selection.getRange(),
                    bk = rng.createBookmark(true);

                this.$body.find('ol,ul').each(function(i,n){
                    var parent = n.parentNode;
                    if(parent.tagName == 'P' && parent.lastChild === parent.firstChild){
                        $(n).children().each(function(j,li){
                            var p = parent.cloneNode(false);
                            $(p).append(li.innerHTML);
                            $(li).html('').append(p);
                        });
                        $(n).insertBefore(parent);
                        $(parent).remove();
                    }

                    if(dtd.$inline[parent.tagName]){
                        if(parent.tagName == 'SPAN'){

                            $(n).children().each(function(k,li){
                                var span = parent.cloneNode(false);
                                if(li.firstChild.nodeName != 'P'){

                                    while(li.firstChild){
                                        span.appendChild(li.firstChild)
                                    };
                                    $('<p></p>').appendTo(li).append(span);
                                }else{
                                    while(li.firstChild){
                                        span.appendChild(li.firstChild)
                                    };
                                    $(li.firstChild).append(span);
                                }
                            })

                        }
                        domUtils.remove(parent,true)
                    }
                });




                rng.moveToBookmark(bk).select();
                return true;
            },
            queryCommandState:function (cmdName) {
                return this.document.queryCommandState(cmdName);
            }
        };
};

