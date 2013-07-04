///import core
///commands 段落格式,居左,居右,居中,两端对齐
///commandsName  JustifyLeft,JustifyCenter,JustifyRight,JustifyJustify
///commandsTitle  居左对齐,居中对齐,居右对齐,两端对齐
/**
 * @description 居左右中
 * @name baidu.editor.execCommand
 * @param   {String}   cmdName     justify执行对齐方式的命令
 * @param   {String}   align               对齐方式：left居左，right居右，center居中，justify两端对齐
 * @author zhanyi
 */
UE.plugins['justify']=function(){
    var cmdNames = {
        'left' : 'left',
        'right':'right',
        'center':'center',
        'justify':'full'
    };
    UE.commands['justify'] = {
        execCommand:function (cmdName, align) {
            return this.document.execCommand('justify' + cmdNames[align]);
        },
        queryCommandValue: function (cmdName, align) {
            return   this.document.queryCommandValue('justify' + cmdNames[align]) === 'true' ? align : '';
        },
        queryCommandState: function (cmdName, align) {
            return this.document.queryCommandState('justify' + cmdNames[align]) ? 1 : 0
        }
    };
};
