///import core
///commands 有序列表,无序列表
///commandsName  InsertOrderedList,InsertUnorderedList
///commandsTitle  有序列表,无序列表
/**
 * 有序列表
 * @function
 * @name baidu.editor.execCommand
 * @param   {String}   cmdName     insertorderlist插入有序列表
 * @param   {String}   style               值为：decimal,lower-alpha,lower-roman,upper-alpha,upper-roman
 * @author zhanyi
 */
/**
 * 无序链接
 * @function
 * @name baidu.editor.execCommand
 * @param   {String}   cmdName     insertunorderlist插入无序列表
 * * @param   {String}   style            值为：circle,disc,square
 * @author zhanyi
 */

UE.plugins['list'] = function () {
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

    me.commands['insertorderedlist'] =
    me.commands['insertunorderedlist'] = {
            execCommand:function (cmdName, style) {
                return this.document.execCommand(cmdName,false,style)
            },
            queryCommandState:function (cmdName) {
                return this.document.queryCommandState(cmdName)
            }
//            ,queryCommandValue:function (cmdName) {
//                var tag = cmdName == 'insertorderedlist' ? 'ol' : 'ul';
//                var path = this.selection.getStartElementPath(),
//                    node;
//                for(var i= 0,ci;ci = path[i++];){
//                    if(ci.nodeName == 'TABLE'){
//                        node = null;
//                        break;
//                    }
//                    if(tag == ci.nodeName.toLowerCase()){
//                        node = ci;
//                        break;
//                    };
//                }
//                return node ? domUtils.getStyle(node, 'list-style-type') || domUtils.getComputedStyle(node, 'list-style-type') : null;
//            }
        };
};

