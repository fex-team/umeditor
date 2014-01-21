(function () {

    var editor = null;

    function insertHtml(command,html,notNeedFilter){
        var me = editor,
            range,
            div;
        if(!html){
            return;
        }
        range = me.selection.getRange();
        div = range.document.createElement( 'div' );
        div.style.display = 'inline';

        if (!notNeedFilter) {
            var root = UM.htmlparser(html);
            //如果给了过滤规则就先进行过滤
            if(me.options.filterRules){
                UM.filterNode(root,me.options.filterRules);
            }
            //执行默认的处理
            me.filterInputRule(root);
            html = root.toHtml()
        }
        div.innerHTML = utils.trim( html );

        if ( !range.collapsed ) {
            var tmpNode = range.startContainer;
            if(domUtils.isFillChar(tmpNode)){
                range.setStartBefore(tmpNode)
            }
            tmpNode = range.endContainer;
            if(domUtils.isFillChar(tmpNode)){
                range.setEndAfter(tmpNode)
            }
            range.txtToElmBoundary();
            //结束边界可能放到了br的前边，要把br包含进来
            // x[xxx]<br/>
            if(range.endContainer && range.endContainer.nodeType == 1){
                tmpNode = range.endContainer.childNodes[range.endOffset];
                if(tmpNode && domUtils.isBr(tmpNode)){
                    range.setEndAfter(tmpNode);
                }
            }
            if(range.startOffset == 0){
                tmpNode = range.startContainer;
                if(domUtils.isBoundaryNode(tmpNode,'firstChild') ){
                    tmpNode = range.endContainer;
                    if(range.endOffset == (tmpNode.nodeType == 3 ? tmpNode.nodeValue.length : tmpNode.childNodes.length) && domUtils.isBoundaryNode(tmpNode,'lastChild')){
                        me.body.innerHTML = '<p>'+(browser.ie ? '' : '<br/>')+'</p>';
                        range.setStart(me.body.firstChild,0).collapse(true)

                    }
                }
            }
            !range.collapsed && range.deleteContents();
            if(range.startContainer.nodeType == 1){
                var child = range.startContainer.childNodes[range.startOffset],pre;
                if(child && domUtils.isBlockElm(child) && (pre = child.previousSibling) && domUtils.isBlockElm(pre)){
                    range.setEnd(pre,pre.childNodes.length).collapse();
                    while(child.firstChild){
                        pre.appendChild(child.firstChild);
                    }
                    domUtils.remove(child);
                }
            }

        }


        var child,parent,pre,tmp,hadBreak = 0, nextNode;
        //如果当前位置选中了fillchar要干掉，要不会产生空行
        if(range.inFillChar()){
            child = range.startContainer;
            if(domUtils.isFillChar(child)){
                range.setStartBefore(child).collapse(true);
                domUtils.remove(child);
            }else if(domUtils.isFillChar(child,true)){
                child.nodeValue = child.nodeValue.replace(fillCharReg,'');
                range.startOffset--;
                range.collapsed && range.collapse(true)
            }
        }
        while ( child = div.firstChild ) {
            if(hadBreak){
                var p = me.document.createElement('p');
                while(child && (child.nodeType == 3 || !dtd.$block[child.tagName])){
                    nextNode = child.nextSibling;
                    p.appendChild(child);
                    child = nextNode;
                }
                if(p.firstChild){

                    child = p
                }
            }
            range.insertNode( child );
            nextNode = child.nextSibling;
            if ( !hadBreak && child.nodeType == domUtils.NODE_ELEMENT && domUtils.isBlockElm( child ) ){

                parent = domUtils.findParent( child,function ( node ){ return domUtils.isBlockElm( node ); } );
                if ( parent && parent.tagName.toLowerCase() != 'body' && !(dtd[parent.tagName][child.nodeName] && child.parentNode === parent)){
                    if(!dtd[parent.tagName][child.nodeName]){
                        pre = parent;
                    }else{
                        tmp = child.parentNode;
                        while (tmp !== parent){
                            pre = tmp;
                            tmp = tmp.parentNode;

                        }
                    }


                    domUtils.breakParent( child, pre || tmp );
                    //去掉break后前一个多余的节点  <p>|<[p> ==> <p></p><div></div><p>|</p>
                    var pre = child.previousSibling;
                    domUtils.trimWhiteTextNode(pre);
                    if(!pre.childNodes.length){
                        domUtils.remove(pre);
                    }
                    //trace:2012,在非ie的情况，切开后剩下的节点有可能不能点入光标添加br占位

                    if(!browser.ie &&
                        (next = child.nextSibling) &&
                        domUtils.isBlockElm(next) &&
                        next.lastChild &&
                        !domUtils.isBr(next.lastChild)){
                        next.appendChild(me.document.createElement('br'));
                    }
                    hadBreak = 1;
                }
            }
            var next = child.nextSibling;
            if(!div.firstChild && next && domUtils.isBlockElm(next)){

                range.setStart(next,0).collapse(true);
                break;
            }
            range.setEndAfter( child ).collapse();

        }

        if(nextNode && domUtils.isBr(nextNode)){
            domUtils.remove(nextNode)
        }
    }

    UM.registerWidget('formula', {

        tpl: "<link type=\"text/css\" rel=\"stylesheet\" href=\"<%=formula_url%>formula.css\">" +
            "<div class=\"edui-formula-wrapper\">" +
            "<ul class=\"edui-tab-nav\"></ul>" +
            "<div class=\"edui-tab-content\"></div>" +
            "</div>",

        sourceData: {
            formula: {
                'common': [
                    "{/}frac{ }{ }", "^{ }/_{ }", "x^{ }", "x_{ }", "x^{ }_{ }", "{/}bar{ }", "{/}sqrt{ }", "{/}nthroot{ }{ }",
                    "{/}sum^{ }_{n=}", "{/}sum", "{/}log_{ }", "{/}ln", "{/}int_{ }^{ }", "{/}oint_{ }^{ }"
                ],
                'symbol': [
                    "+", "-", "{/}pm", "{/}times", "{/}ast", "{/}div", "/", "{/}bigtriangleup",
                    "=", "{/}ne", "{/}approx", ">", "<", "{/}ge", "{/}le", "{/}infty",
                    "{/}cap", "{/}cup", "{/}because", "{/}therefore", "{/}subset", "{/}supset", "{/}subseteq", "{/}supseteq",
                    "{/}nsubseteq", "{/}nsupseteq", "{/}in", "{/}ni", "{/}notin", "{/}mapsto", "{/}leftarrow", "{/}rightarrow",
                    "{/}Leftarrow", "{/}Rightarrow", "{/}leftrightarrow", "{/}Leftrightarrow"
                ],
                'letter': [
                    "{/}alpha", "{/}beta", "{/}gamma", "{/}delta", "{/}varepsilon", "{/}varphi", "{/}lambda", "{/}mu",
                    "{/}rho", "{/}sigma", "{/}omega", "{/}Gamma", "{/}Delta", "{/}Theta", "{/}Lambda", "{/}Xi",
                    "{/}Pi", "{/}Sigma", "{/}Upsilon", "{/}Phi", "{/}Psi", "{/}Omega"
                ]
            }
        },
        initContent: function (_editor, $widget) {

            var me = this,
                formula = me.sourceData.formula,
                lang = _editor.getLang('formula')['static'],
                formulaUrl = UMEDITOR_CONFIG.UMEDITOR_HOME_URL + 'dialogs/formula/',
                options = $.extend({}, lang, { 'formula_url': formulaUrl }),
                $root = me.root();

            if (me.inited) {
                me.preventDefault();
                return;
            }
            me.inited = true;

            editor = _editor;
            me.$widget = $widget;

            $root.html($.parseTmpl(me.tpl, options));
            me.tabs = $.eduitab({selector: "#edui-formula-tab-Jpanel"});

            /* 初始化popup的内容 */
            var headHtml = [], xMax = 0, yMax = 0,
                $tabContent = me.root().find('.edui-tab-content');
            $.each(formula, function (k, v) {
                var contentHtml = [];
                $.each(v, function (i, f) {
                    contentHtml.push('<li class="edui-formula-latex-item" data-latex="' + f + '" style="background-position:-' + (xMax * 30) + 'px -' + (yMax * 30) + 'px"></li>');
                    if (++xMax >=8) {
                        ++yMax; xMax = 0;
                    }
                });
                yMax++; xMax = 0;
                $tabContent.append('<div class="edui-tab-pane"><ul>' + contentHtml.join('') + '</ul>');
                headHtml.push('<li class="edui-tab-item"><a href="javascript:void(0);" class="edui-tab-text">' + lang['lang_tab_' + k] + '</a></li>');
            });
            headHtml.push('<li class="edui-formula-clearboth"></li>');
            $root.find('.edui-tab-nav').html(headHtml.join(''));
            $root.find('.edui-tab-content').append('<div class="edui-formula-clearboth"></div>');

            /* 选中第一个tab */
            me.switchTab(0);
        },
        initEvent: function () {
            var me = this;

            //防止点击过后关闭popup
            me.root().on('click', function (e) {
                return false;
            });

            //点击tab切换菜单
            me.root().find('.edui-tab-nav').delegate('.edui-tab-item', 'click', function (evt) {
                me.switchTab(this);
                return false;
            });

            //点击选中公式
            me.root().find('.edui-tab-pane').delegate('.edui-formula-latex-item', 'click', function (evt) {
                var $item = $(this),
                    latex = $item.attr('data-latex') || '';

                if (latex) {
                    me.insertLatex(latex.replace("{/}", "\\"));
                }
                me.$widget.edui().hide();
                return false;
            });
        },
        switchTab:function(index){
            var me = this,
                $root = me.root(),
                index = $.isNumeric(index) ? index:$.inArray(index, $root.find('.edui-tab-nav .edui-tab-item'));

            $root.find('.edui-tab-nav .edui-tab-item').removeClass('edui-active').eq(index).addClass('edui-active');
            $root.find('.edui-tab-content .edui-tab-pane').removeClass('edui-active').eq(index).addClass('edui-active');

            /* 自动长高 */
            me.autoHeight(0);
        },
        autoHeight: function () {
            this.$widget.height(this.root() + 2);
        },
        insertLatex: function (latex) {
            function getActiveIframe() {
                return editor.$body.find('iframe.edui-formula-active')[0] || null;
            }

            var iframe = getActiveIframe();
            if (iframe) {
                iframe.contentWindow.formula.insertLatex(latex);
            } else {
                editor.execCommand('inserthtml', '<span class="mathquill-embedded-latex">' + latex + '</span>');
            }
        },
        width: 350,
        height: 400
    });

})();

