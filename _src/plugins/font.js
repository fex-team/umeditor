///import core
///import plugins\removeformat.js
///commands 字体颜色,背景色,字号,字体,下划线,删除线
///commandsName  ForeColor,BackColor,FontSize,FontFamily,Underline,StrikeThrough
///commandsTitle  字体颜色,背景色,字号,字体,下划线,删除线
/**
 * @description 字体
 * @name UM.execCommand
 * @param {String}     cmdName    执行的功能名称
 * @param {String}    value             传入的值
 */
UM.plugins['font'] = function () {
    var me = this,
        fonts = {
            'forecolor': 'forecolor',
            'backcolor': 'backcolor',
            'fontsize': 'fontsize',
            'fontfamily': 'fontname'
        },
        cmdNameToStyle = {
            'forecolor': 'color',
            'backcolor': 'background-color',
            'fontsize': 'font-size',
            'fontfamily': 'font-family'
        },
        cmdNameToAttr = {
            'forecolor': 'color',
            'fontsize': 'size',
            'fontfamily': 'face'
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

    me.addOutputRule(function (root) {
        utils.each(root.getNodesByTagName('font'), function (node) {
            if (node.tagName == 'font') {
                var cssStyle = [];
                for (var p in node.attrs) {
                    switch (p) {
                        case 'size':
                            var val =  node.attrs[p];
                            $.each({
                                '10':'1',
                                '12':'2',
                                '16':'3',
                                '18':'4',
                                '24':'5',
                                '32':'6',
                                '48':'7'
                            },function(k,v){
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
            if(node.parentNode.tagName == 'span' && node.parentNode.children.length == 1){
                $.each(node.attrs,function(k,v){

                    node.parentNode.attrs[k] = k == 'style' ? node.parentNode.attrs[k] + v : v;
                })
                node.parentNode.removeChild(node,true);
            }
        });
    });
    for(var p in fonts){
        (function (cmd) {
            UM.commands[cmd] = {
                execCommand: function (cmdName,value) {
                    if(value == 'transparent'){
                        return;
                    }
                    var rng = this.selection.getRange();
                    if(rng.collapsed){
                        var span = $('<span></span>').css(cmdNameToStyle[cmdName],value)[0];
                        rng.insertNode(span).setStart(span,0).setCursor();
                    }else{
                        if(cmdName == 'fontsize'){
                            value  = {
                                '10':'1',
                                '12':'2',
                                '16':'3',
                                '18':'4',
                                '24':'5',
                                '32':'6',
                                '48':'7'
                            }[(value+"").replace(/px/,'')]
                        }
                        this.document.execCommand(fonts[cmdName],false, value);
                        if(browser.gecko){
                            $.each(this.$body.find('a'),function(i,a){
                                var parent = a.parentNode;
                                if(parent.lastChild === parent.firstChild && /FONT|SPAN/.test(parent.tagName)){
                                    var cloneNode = parent.cloneNode(false);
                                    cloneNode.innerHTML = a.innerHTML;
                                    $(a).html('').append(cloneNode).insertBefore(parent);

                                    $(parent).remove();
                                }
                            });
                        }
                        if(!browser.ie){
                            var nativeRange = this.selection.getNative().getRangeAt(0);
                            var common = nativeRange.commonAncestorContainer;
                            var rng = this.selection.getRange(),
                                bk = rng.createBookmark(true);

                            $(common).find('a').each(function(i,n){
                                var parent = n.parentNode;
                                if(parent.nodeName == 'FONT'){
                                    var font = parent.cloneNode(false);
                                    font.innerHTML = n.innerHTML;
                                    $(n).html('').append(font);
                                }
                            });
                            rng.moveToBookmark(bk).select()
                        }
                        return true
                    }

                },
                queryCommandValue: function (cmdName) {
                    var start = me.selection.getStart();
                    var val = $(start).css(cmdNameToStyle[cmdName]);
                    if(val === undefined){
                        val = $(start).attr(cmdNameToAttr[cmdName])
                    }
                    return val ? utils.fixColor(cmdName,val).replace(/px/,'') : '';
                },
                queryCommandState: function (cmdName) {
                    return this.queryCommandValue(cmdName)
                }
            };
        })(p);
    }
};