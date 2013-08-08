///import core
///import plugins\removeformat.js
///commands 字体颜色,背景色,字号,字体,下划线,删除线
///commandsName  ForeColor,BackColor,FontSize,FontFamily,Underline,StrikeThrough
///commandsTitle  字体颜色,背景色,字号,字体,下划线,删除线
/**
 * @description 字体
 * @name UE.execCommand
 * @param {String}     cmdName    执行的功能名称
 * @param {String}    value             传入的值
 */
UE.plugins['font'] = function () {
    var me = this,
        fonts = {
            'forecolor': 'forecolor',
            'backcolor': 'backcolor',
            'fontsize': 'fontsize',
            'fontfamily': 'fontname'
        };

    me.setOpt({
        'fontfamily': [
            { name: 'songti', val: '宋体,SimSun'},
            { name: 'yahei', val: '微软雅黑,Microsoft YaHei'},
            { name: 'kaiti', val: '楷体,楷体_GB2312, SimKai'},
            { name: 'heiti', val: '黑体, SimHei'},
            { name: 'lishu', val: '隶书, SimLi'},
            { name: 'andaleMono', val: 'andale mono'},
            { name: 'arial', val: 'arial, helvetica,sans-serif'},
            { name: 'arialBlack', val: 'arial black,avant garde'},
            { name: 'comicSansMs', val: 'comic sans ms'},
            { name: 'impact', val: 'impact,chicago'},
            { name: 'timesNewRoman', val: 'times new roman'},
            { name: 'sans-serif',val:'sans-serif'}
        ],
        'fontsize': [10, 12,  16, 18,24, 32,48]
    });
    var fontsize ={
        '10':'1',
        '12':'2',
        '16':'3',
        '18':'4',
        '24':'5',
        '32':'6',
        '48':'7'
    };
    me.addOutputRule(function (root) {
        utils.each(root.getNodesByTagName('font'), function (node) {
            if (node.tagName == 'font') {
                var cssStyle = [];
                for (var p in node.attrs) {
                    switch (p) {
                        case 'size':
                            var val =  node.attrs[p];
                            $.each(fontsize,function(k,v){
                                if(v == val){
                                    val = k;
                                    return false;
                                }
                            });
                            cssStyle.push('font-size:' + val + 'px');
                            break;
                        case 'color':
                            cssStyle.push('color:' + node.attrs[p]);
                            break;
                        case 'face':
                            cssStyle.push('font-family:' + node.attrs[p]);
                            break;
                        case 'style':
                            cssStyle.push(node.attrs[p]);
                    }
                }
                node.attrs = {
                    'style': cssStyle.join(';')
                };
            }
            node.tagName = 'span';
        });
    });
    for(var p in fonts){
        (function (cmd) {
            UE.commands[cmd] = {
                execCommand: function (cmdName,value) {
                    if(cmdName == 'fontsize'){
                        value  = fontsize[(value+"").replace(/px/,'')]
                    }
                    return this.document.execCommand(fonts[cmdName],false, value)
                },
                queryCommandValue: function (cmdName) {
                    if(cmdName == 'fontfamily'){
                        var startNode = this.selection.getStart();
                        var val = $(startNode).css('fontFamily');
                    }else{
                        var val = this.document.queryCommandValue(fonts[cmdName]);
                        if(cmdName == 'fontsize'){
                            $.each(fontsize,function(k,v){
                                if(v == val){
                                    val = k;
                                    return false;
                                }
                            })
                        }
                    }
                    return val;
                },
                queryCommandState: function (cmdName) {
                    return this.document.queryCommandState(fonts[cmdName]);
                }
            };
        })(p);
    }
};