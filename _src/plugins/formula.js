/**
 * 公式插件
 */
UM.plugins['formula'] = function () {
    var me = this;

    function getActiveIframe() {
        return me.$body.find('iframe.edui-formula-active')[0] || null;
    }

    function blurActiveIframe(){
        var iframe = getActiveIframe();
        iframe && iframe.contentWindow.formula.blur();
    }

    me.addInputRule(function (root) {
        $.each(root.getNodesByTagName('span'), function (i, node) {
            if (node.hasClass('mathquill-embedded-latex')) {
                var firstChild, latex = '';
                while(firstChild = node.firstChild()){
                    latex += firstChild.data;
                    node.removeChild(firstChild);
                }
                node.tagName = 'iframe';
                node.setAttr({
                    'frameborder': '0',
                    'src': me.getOpt('UMEDITOR_HOME_URL') + 'dialogs/formula/formula.html',
                    'data-latex': utils.unhtml(latex)
                });
            }
        });
    });
    me.addOutputRule(function (root) {
        $.each(root.getNodesByTagName('iframe'), function (i, node) {
            if (node.hasClass('mathquill-embedded-latex')) {
                node.tagName = 'span';
                node.appendChild(UM.uNode.createText(node.getAttr('data-latex')));
                node.setAttr({
                    'frameborder': '',
                    'src': '',
                    'data-latex': ''
                });
            }
        });
    });
    me.addListener('click', function(){
        blurActiveIframe();
    });
    me.addListener('afterexeccommand', function(type, cmd){
        if(cmd != 'formula') {
            blurActiveIframe();
        }
    });

    me.commands['formula'] = {
        execCommand: function (cmd, latex) {
            var iframe = getActiveIframe();
            if (iframe) {
                iframe.contentWindow.formula.insertLatex(latex);
            } else {
                me.execCommand('inserthtml', '<span class="mathquill-embedded-latex">' + latex + '</span>');
                browser.ie && browser.ie9below && setTimeout(function(){
                    var rng = me.selection.getRange(),
                        startContainer = rng.startContainer;
                    if(startContainer.nodeType == 1 && !startContainer.childNodes[rng.startOffset]){
                        rng.insertNode(me.document.createTextNode(' '));
                        rng.setCursor()
                    }
                },100)
            }
        },
        queryCommandState: function (cmd) {
            return 0;
        },
        queryCommandValue: function (cmd) {
            var iframe = getActiveIframe();
            return iframe && iframe.contentWindow.formula.getLatex();
        }
    }

};
