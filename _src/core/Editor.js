/**
 * @file
 * @name UM.Editor
 * @short Editor
 * @import editor.js,core/utils.js,core/EventBase.js,core/browser.js,core/dom/dtd.js,core/dom/domUtils.js,core/dom/Range.js,core/dom/Selection.js,plugins/serialize.js
 * @desc 编辑器主类，包含编辑器提供的大部分公用接口
 */
(function () {
    var uid = 0, _selectionChangeTimer;

    /**
     * @private
     * @ignore
     * @param form  编辑器所在的form元素
     * @param editor  编辑器实例对象
     */
    function setValue(form, editor) {
        var textarea;
        if (editor.textarea) {
            if (utils.isString(editor.textarea)) {
                for (var i = 0, ti, tis = domUtils.getElementsByTagName(form, 'textarea'); ti = tis[i++];) {
                    if (ti.id == 'umeditor_textarea_' + editor.options.textarea) {
                        textarea = ti;
                        break;
                    }
                }
            } else {
                textarea = editor.textarea;
            }
        }
        if (!textarea) {
            form.appendChild(textarea = domUtils.createElement(document, 'textarea', {
                'name': editor.options.textarea,
                'id': 'umeditor_textarea_' + editor.options.textarea,
                'style': "display:none"
            }));
            //不要产生多个textarea
            editor.textarea = textarea;
        }
        textarea.value = editor.hasContents() ?
            (editor.options.allHtmlEnabled ? editor.getAllHtml() : editor.getContent(null, null, true)) :
            ''
    }
    function loadPlugins(me){
        //初始化插件
        for (var pi in UM.plugins) {
            if(me.options.excludePlugins.indexOf(pi) == -1){
                UM.plugins[pi].call(me);
                me.plugins[pi] = 1;
            }
        }
        me.langIsReady = true;

        me.fireEvent("langReady");
    }
    function checkCurLang(I18N){
        for(var lang in I18N){
            return lang
        }
    }
    /**
     * UEditor编辑器类
     * @name Editor
     * @desc 创建一个跟编辑器实例
     * - ***container*** 编辑器容器对象
     * - ***iframe*** 编辑区域所在的iframe对象
     * - ***window*** 编辑区域所在的window
     * - ***document*** 编辑区域所在的document对象
     * - ***body*** 编辑区域所在的body对象
     * - ***selection*** 编辑区域的选区对象
     */
    var Editor = UM.Editor = function (options) {
        var me = this;
        me.uid = uid++;
        EventBase.call(me);
        me.commands = {};
        me.options = utils.extend(utils.clone(options || {}), UMEDITOR_CONFIG, true);
        me.shortcutkeys = {};
        me.inputRules = [];
        me.outputRules = [];
        //设置默认的常用属性
        me.setOpt({
            isShow: true,
            initialContent: '',
            initialStyle:'',
            autoClearinitialContent: false,
            textarea: 'editorValue',
            focus: false,
            focusInEnd: true,
            autoClearEmptyNode: true,
            fullscreen: false,
            readonly: false,
            zIndex: 999,
            enterTag: 'p',
            lang: 'zh-cn',
            langPath: me.options.UMEDITOR_HOME_URL + 'lang/',
            theme: 'default',
            themePath: me.options.UMEDITOR_HOME_URL + 'themes/',
            allHtmlEnabled: false,
            autoSyncData : true,
            autoHeightEnabled : true,
            excludePlugins:''
        });
        me.plugins = {};
        if(!utils.isEmptyObject(UM.I18N)){
            //修改默认的语言类型
            me.options.lang = checkCurLang(UM.I18N);
            loadPlugins(me)
        }else{
            utils.loadFile(document, {
                src: me.options.langPath + me.options.lang + "/" + me.options.lang + ".js",
                tag: "script",
                type: "text/javascript",
                defer: "defer"
            }, function () {
                loadPlugins(me)
            });
        }

    };
    Editor.prototype = {
        /**
         * 当编辑器ready后执行传入的fn,如果编辑器已经完成ready，就马上执行fn，fn的中的this是编辑器实例。
         * 大部分的实例接口都需要放在该方法内部执行，否则在IE下可能会报错。
         * @name ready
         * @grammar editor.ready(fn) fn是当编辑器渲染好后执行的function
         * @example
         * var editor = new UM.ui.Editor();
         * editor.render("myEditor");
         * editor.ready(function(){
         *     editor.setContent("欢迎使用UEditor！");
         * })
         */
        ready: function (fn) {
            var me = this;
            if (fn) {
                me.isReady ? fn.apply(me) : me.addListener('ready', fn);
            }
        },
        /**
         * 为编辑器设置默认参数值。若用户配置为空，则以默认配置为准
         * @grammar editor.setOpt(key,value);      //传入一个键、值对
         * @grammar editor.setOpt({ key:value});   //传入一个json对象
         */
        setOpt: function (key, val) {
            var obj = {};
            if (utils.isString(key)) {
                obj[key] = val
            } else {
                obj = key;
            }
            utils.extend(this.options, obj, true);
        },
        getOpt:function(key){
            return this.options[key] || ''
        },
        /**
         * 销毁编辑器实例对象
         * @name destroy
         * @grammar editor.destroy();
         */
        destroy: function () {

            var me = this;
            me.fireEvent('destroy');
            var container = me.container.parentNode;
            if(container === document.body){
                container = me.container;
            }
            var textarea = me.textarea;
            if (!textarea) {
                textarea = document.createElement('textarea');
                container.parentNode.insertBefore(textarea, container);
            } else {
                textarea.style.display = ''
            }

            textarea.style.width = me.body.offsetWidth + 'px';
            textarea.style.height = me.body.offsetHeight + 'px';
            textarea.value = me.getContent();
            textarea.id = me.key;
            if(container.contains(textarea)){
                $(textarea).insertBefore(container);
            }
            container.innerHTML = '';

            domUtils.remove(container);
            UM.clearCache(me.id);
            //trace:2004
            for (var p in me) {
                if (me.hasOwnProperty(p)) {
                    delete this[p];
                }
            }

        },
        initialCont : function(holder){

            if(holder){
                holder.getAttribute('name') && ( this.options.textarea = holder.getAttribute('name'));
                if (holder && /script|textarea/ig.test(holder.tagName)) {
                    var newDiv = document.createElement('div');
                    holder.parentNode.insertBefore(newDiv, holder);
                    this.options.initialContent = UM.htmlparser(holder.value || holder.innerHTML|| this.options.initialContent).toHtml();
                    holder.className && (newDiv.className = holder.className);
                    holder.style.cssText && (newDiv.style.cssText = holder.style.cssText);

                    if (/textarea/i.test(holder.tagName)) {
                        this.textarea = holder;
                        this.textarea.style.display = 'none';

                    } else {
                        holder.parentNode.removeChild(holder);
                        holder.id && (newDiv.id = holder.id);
                    }
                    holder = newDiv;
                    holder.innerHTML = '';
                }
                return holder;
            }else{
                return null;
            }

        },
        /**
         * 渲染编辑器的DOM到指定容器，必须且只能调用一次
         * @name render
         * @grammar editor.render(containerId);    //可以指定一个容器ID
         * @grammar editor.render(containerDom);   //也可以直接指定容器对象
         */
        render: function (container) {
            var me = this,
                options = me.options,
                getStyleValue=function(attr){
                    return parseInt($(container).css(attr));
                };

            if (utils.isString(container)) {
                container = document.getElementById(container);
            }
            if (container) {
                this.id = container.getAttribute('id');
                UM.setEditor(this);
                utils.cssRule('edui-style-body',me.options.initialStyle,document);

                container = this.initialCont(container);

                container.className += ' edui-body-container';

                if(options.initialFrameWidth){
                    options.minFrameWidth = options.initialFrameWidth
                }else{
                    //都没给值，先写死了
                    options.minFrameWidth = options.initialFrameWidth = $(container).width() || UM.defaultWidth;
                }
                if(options.initialFrameHeight){
                    options.minFrameHeight = options.initialFrameHeight
                }else{

                    options.initialFrameHeight = options.minFrameHeight = $(container).height() || UM.defaultHeight;
                }

                container.style.width = /%$/.test(options.initialFrameWidth) ?  '100%' : options.initialFrameWidth -
                    getStyleValue("padding-left")-
                    getStyleValue("padding-right")  +'px';

                var height = /%$/.test(options.initialFrameHeight) ?  '100%' : (options.initialFrameHeight - getStyleValue("padding-top")- getStyleValue("padding-bottom") );
                if(this.options.autoHeightEnabled){
                    container.style.minHeight = height +'px';
                    container.style.height = '';
                    if(browser.ie && browser.version <= 6){
                        container.style.height = height ;
                        container.style.setExpression('height', 'this.scrollHeight <= ' + height + ' ? "' + height + 'px" : "auto"');
                    }
                }else{
                    $(container).height(height)
                }
                container.style.zIndex = options.zIndex;
                this._setup(container);

            }
        },
        /**
         * 编辑器初始化
         * @private
         * @ignore
         * @param {Element} doc 编辑器Iframe中的文档对象
         */
        _setup: function (cont) {
            var me = this,
                options = me.options;

            cont.contentEditable = true;
            document.body.spellcheck = false;

            me.document = document;
            me.window = document.defaultView || document.parentWindow;
            me.body = cont;
            me.$body = $(cont);
            me.selection = new dom.Selection(document,me.body);
            me._isEnabled = false;
            //gecko初始化就能得到range,无法判断isFocus了
            var geckoSel;
            if (browser.gecko && (geckoSel = this.selection.getNative())) {
                geckoSel.removeAllRanges();
            }
            this._initEvents();
            //为form提交提供一个隐藏的textarea
            for (var form = cont.parentNode; form && !domUtils.isBody(form); form = form.parentNode) {
                if (form.tagName == 'FORM') {
                    me.form = form;
                    if(me.options.autoSyncData){
                        $(cont).on('blur',function(){
                            setValue(form,me);
                        })
                    }else{
                        $(form).on('submit', function () {
                            setValue(this, me);
                        })
                    }
                    break;
                }
            }
            if (options.initialContent) {
                if (options.autoClearinitialContent) {
                    var oldExecCommand = me.execCommand;
                    me.execCommand = function () {
                        me.fireEvent('firstBeforeExecCommand');
                        return oldExecCommand.apply(me, arguments);
                    };
                    this._setDefaultContent(options.initialContent);
                } else
                    this.setContent(options.initialContent, false, true);
            }

            //编辑器不能为空内容

            if (domUtils.isEmptyNode(me.body)) {
                me.body.innerHTML = '<p>' + (browser.ie ? '' : '<br/>') + '</p>';
            }
            //如果要求focus, 就把光标定位到内容开始
            if (options.focus) {
                setTimeout(function () {
                    me.focus(me.options.focusInEnd);
                    //如果自动清除开着，就不需要做selectionchange;
                    !me.options.autoClearinitialContent && me._selectionChange();
                }, 0);
            }
            if (!me.container) {
                me.container = cont.parentNode;
            }

            me._bindshortcutKeys();
            me.isReady = 1;
            me.fireEvent('ready');
            options.onready && options.onready.call(me);
            if(!browser.ie || browser.ie9above){

                $(me.body).on( 'blur focus', function (e) {
                    var nSel = me.selection.getNative();
                    //chrome下会出现alt+tab切换时，导致选区位置不对
                    if (e.type == 'blur') {
                        if(nSel.rangeCount > 0 ){
                            me._bakRange = nSel.getRangeAt(0);
                        }
                    } else {
                        try {
                            me._bakRange && nSel.addRange(me._bakRange)
                        } catch (e) {
                        }
                        me._bakRange = null;
                    }
                });
            }

            !options.isShow && me.setHide();
            options.readonly && me.setDisabled();
        },
        /**
         * 同步编辑器的数据，为提交数据做准备，主要用于你是手动提交的情况
         * @name sync
         * @grammar editor.sync(); //从编辑器的容器向上查找，如果找到就同步数据
         * @grammar editor.sync(formID); //formID制定一个要同步数据的form的id,编辑器的数据会同步到你指定form下
         * @desc
         * 后台取得数据得键值使用你容器上得''name''属性，如果没有就使用参数传入的''textarea''
         * @example
         * editor.sync();
         * form.sumbit(); //form变量已经指向了form元素
         *
         */
        sync: function (formId) {
            var me = this,
                form = formId ? document.getElementById(formId) :
                    domUtils.findParent(me.body.parentNode, function (node) {
                        return node.tagName == 'FORM'
                    }, true);
            form && setValue(form, me);
        },
        /**
         * 设置编辑器高度
         * @name setHeight
         * @grammar editor.setHeight(number);  //纯数值，不带单位
         */
        setHeight: function (height,notSetHeight) {
            !notSetHeight && (this.options.initialFrameHeight = height);
            if(this.options.autoHeightEnabled){
                $(this.body).css({
                    'min-height':height + 'px'
                });
                if(browser.ie && browser.version <= 6 && this.container){
                    this.container.style.height = height ;
                    this.container.style.setExpression('height', 'this.scrollHeight <= ' + height + ' ? "' + height + 'px" : "auto"');
                }
            }else{
                $(this.body).height(height)
            }
            this.fireEvent('resize');
        },
        /**
         * 设置编辑器宽度
         * @name setWidth
         * @grammar editor.setWidth(number);  //纯数值，不带单位
         */
        setWidth:function(width){
            this.$container && this.$container.width(width);
            $(this.body).width(width - $(this.body).css('padding-left').replace('px','') * 1 - $(this.body).css('padding-right').replace('px','') * 1);
            this.fireEvent('resize');
        },
        addshortcutkey: function (cmd, keys) {
            var obj = {};
            if (keys) {
                obj[cmd] = keys
            } else {
                obj = cmd;
            }
            utils.extend(this.shortcutkeys, obj)
        },
        _bindshortcutKeys: function () {
            var me = this, shortcutkeys = this.shortcutkeys;
            me.addListener('keydown', function (type, e) {
                var keyCode = e.keyCode || e.which;
                for (var i in shortcutkeys) {
                    var tmp = shortcutkeys[i].split(',');
                    for (var t = 0, ti; ti = tmp[t++];) {
                        ti = ti.split(':');
                        var key = ti[0], param = ti[1];
                        if (/^(ctrl)(\+shift)?\+(\d+)$/.test(key.toLowerCase()) || /^(\d+)$/.test(key)) {
                            if (( (RegExp.$1 == 'ctrl' ? (e.ctrlKey || e.metaKey) : 0)
                                && (RegExp.$2 != "" ? e[RegExp.$2.slice(1) + "Key"] : 1)
                                && keyCode == RegExp.$3
                                ) ||
                                keyCode == RegExp.$1
                                ) {
                                if (me.queryCommandState(i,param) != -1)
                                    me.execCommand(i, param);
                                domUtils.preventDefault(e);
                            }
                        }
                    }

                }
            });
        },
        /**
         * 获取编辑器内容
         * @name getContent
         * @grammar editor.getContent()  => String //若编辑器中只包含字符"&lt;p&gt;&lt;br /&gt;&lt;/p/&gt;"会返回空。
         * @grammar editor.getContent(fn)  => String
         * @example
         * getContent默认是会现调用hasContents来判断编辑器是否为空，如果是，就直接返回空字符串
         * 你也可以传入一个fn来接替hasContents的工作，定制判断的规则
         * editor.getContent(function(){
         *     return false //编辑器没有内容 ，getContent直接返回空
         * })
         */
        getContent: function (cmd, fn,notSetCursor,ignoreBlank,formatter) {
            var me = this;
            if (cmd && utils.isFunction(cmd)) {
                fn = cmd;
                cmd = '';
            }
            if (fn ? !fn() : !this.hasContents()) {
                return '';
            }
            me.fireEvent('beforegetcontent');
            var root = UM.htmlparser(me.body.innerHTML,ignoreBlank);
            me.filterOutputRule(root);
            me.fireEvent('aftergetcontent',root);
            return  root.toHtml(formatter);
        },
        /**
         * 取得完整的html代码，可以直接显示成完整的html文档
         * @name getAllHtml
         * @grammar editor.getAllHtml()  => String
         */
        getAllHtml: function () {
            var me = this,
                headHtml = [],
                html = '';
            me.fireEvent('getAllHtml', headHtml);
            if (browser.ie && browser.version > 8) {
                var headHtmlForIE9 = '';
                utils.each(me.document.styleSheets, function (si) {
                    headHtmlForIE9 += ( si.href ? '<link rel="stylesheet" type="text/css" href="' + si.href + '" />' : '<style>' + si.cssText + '</style>');
                });
                utils.each(me.document.getElementsByTagName('script'), function (si) {
                    headHtmlForIE9 += si.outerHTML;
                });
            }
            return '<html><head>' + (me.options.charset ? '<meta http-equiv="Content-Type" content="text/html; charset=' + me.options.charset + '"/>' : '')
                + (headHtmlForIE9 || me.document.getElementsByTagName('head')[0].innerHTML) + headHtml.join('\n') + '</head>'
                + '<body ' + (ie && browser.version < 9 ? 'class="view"' : '') + '>' + me.getContent(null, null, true) + '</body></html>';
        },
        /**
         * 得到编辑器的纯文本内容，但会保留段落格式
         * @name getPlainTxt
         * @grammar editor.getPlainTxt()  => String
         */
        getPlainTxt: function () {
            var reg = new RegExp(domUtils.fillChar, 'g'),
                html = this.body.innerHTML.replace(/[\n\r]/g, '');//ie要先去了\n在处理
            html = html.replace(/<(p|div)[^>]*>(<br\/?>|&nbsp;)<\/\1>/gi, '\n')
                .replace(/<br\/?>/gi, '\n')
                .replace(/<[^>/]+>/g, '')
                .replace(/(\n)?<\/([^>]+)>/g, function (a, b, c) {
                    return dtd.$block[c] ? '\n' : b ? b : '';
                });
            //取出来的空格会有c2a0会变成乱码，处理这种情况\u00a0
            return html.replace(reg, '').replace(/\u00a0/g, ' ').replace(/&nbsp;/g, ' ');
        },

        /**
         * 获取编辑器中的纯文本内容,没有段落格式
         * @name getContentTxt
         * @grammar editor.getContentTxt()  => String
         */
        getContentTxt: function () {
            var reg = new RegExp(domUtils.fillChar, 'g');
            //取出来的空格会有c2a0会变成乱码，处理这种情况\u00a0
            return this.body[browser.ie ? 'innerText' : 'textContent'].replace(reg, '').replace(/\u00a0/g, ' ');
        },

        /**
         * 将html设置到编辑器中, 如果是用于初始化时给编辑器赋初值，则必须放在ready方法内部执行
         * @name setContent
         * @grammar editor.setContent(html)
         * @example
         * var editor = new UM.ui.Editor()
         * editor.ready(function(){
         *     //需要ready后执行，否则可能报错
         *     editor.setContent("欢迎使用UEditor！");
         * })
         */
        setContent: function (html, isAppendTo, notFireSelectionchange) {
            var me = this;

            me.fireEvent('beforesetcontent', html);
            var root = UM.htmlparser(html);
            me.filterInputRule(root);
            html = root.toHtml();


            me.body.innerHTML = (isAppendTo ? me.body.innerHTML : '') + html;


            function isCdataDiv(node){
                return  node.tagName == 'DIV' && node.getAttribute('cdata_tag');
            }
            //给文本或者inline节点套p标签
            if (me.options.enterTag == 'p') {

                var child = this.body.firstChild, tmpNode;
                if (!child || child.nodeType == 1 &&
                    (dtd.$cdata[child.tagName] || isCdataDiv(child) ||
                        domUtils.isCustomeNode(child)
                        )
                    && child === this.body.lastChild) {
                    this.body.innerHTML = '<p>' + (browser.ie ? '&nbsp;' : '<br/>') + '</p>' + this.body.innerHTML;

                } else {
                    var p = me.document.createElement('p');
                    while (child) {
                        while (child && (child.nodeType == 3 || child.nodeType == 1 && dtd.p[child.tagName] && !dtd.$cdata[child.tagName])) {
                            tmpNode = child.nextSibling;
                            p.appendChild(child);
                            child = tmpNode;
                        }
                        if (p.firstChild) {
                            if (!child) {
                                me.body.appendChild(p);
                                break;
                            } else {
                                child.parentNode.insertBefore(p, child);
                                p = me.document.createElement('p');
                            }
                        }
                        child = child.nextSibling;
                    }
                }
            }
            me.fireEvent('aftersetcontent');
            me.fireEvent('contentchange');

            !notFireSelectionchange && me._selectionChange();
            //清除保存的选区
            me._bakRange = me._bakIERange = me._bakNativeRange = null;
            //trace:1742 setContent后gecko能得到焦点问题
            var geckoSel;
            if (browser.gecko && (geckoSel = this.selection.getNative())) {
                geckoSel.removeAllRanges();
            }
            if(me.options.autoSyncData){
                me.form && setValue(me.form,me);
            }
        },

        /**
         * 让编辑器获得焦点，toEnd确定focus位置
         * @name focus
         * @grammar editor.focus([toEnd])   //默认focus到编辑器头部，toEnd为true时focus到内容尾部
         */
        focus: function (toEnd) {
            try {
                var me = this,
                    rng = me.selection.getRange();
                if (toEnd) {
                    rng.setStartAtLast(me.body.lastChild).setCursor(false, true);
                } else {
                    rng.select(true);
                }
                this.fireEvent('focus');
            } catch (e) {
            }
        },
        /**
         * 使编辑区域失去焦点
         */
        blur:function(){
            var sel = this.selection.getNative();
            sel.empty ? sel.empty() : sel.removeAllRanges();
            this.fireEvent('blur')
        },
        /**
         * 判断编辑器当前是否获得了焦点
         */
        isFocus : function(){
            if(this.fireEvent('isfocus')===true){
                return true;
            }
            return this.selection.isFocus();
        },

        /**
         * 初始化UE事件及部分事件代理
         * @private
         * @ignore
         */
        _initEvents: function () {
            var me = this,
                cont = me.body,
                _proxyDomEvent = function(){
                    me._proxyDomEvent.apply(me, arguments);
                };

            $(cont)
                .on( 'click contextmenu mousedown keydown keyup keypress mouseup mouseover mouseout selectstart', _proxyDomEvent)
                .on( 'focus blur', _proxyDomEvent)
                .on('mouseup keydown', function (evt) {
                    //特殊键不触发selectionchange
                    if (evt.type == 'keydown' && (evt.ctrlKey || evt.metaKey || evt.shiftKey || evt.altKey)) {
                        return;
                    }
                    if (evt.button == 2)return;
                    me._selectionChange(250, evt);
                });
        },
        /**
         * 触发事件代理
         * @private
         * @ignore
         */
        _proxyDomEvent: function (evt) {
            return this.fireEvent(evt.type.replace(/^on/, ''), evt);
        },
        /**
         * 变化选区
         * @private
         * @ignore
         */
        _selectionChange: function (delay, evt) {
            var me = this;
            //有光标才做selectionchange 为了解决未focus时点击source不能触发更改工具栏状态的问题（source命令notNeedUndo=1）
//            if ( !me.selection.isFocus() ){
//                return;
//            }


            var hackForMouseUp = false;
            var mouseX, mouseY;
            if (browser.ie && browser.version < 9 && evt && evt.type == 'mouseup') {
                var range = this.selection.getRange();
                if (!range.collapsed) {
                    hackForMouseUp = true;
                    mouseX = evt.clientX;
                    mouseY = evt.clientY;
                }
            }
            clearTimeout(_selectionChangeTimer);
            _selectionChangeTimer = setTimeout(function () {
                if (!me.selection.getNative()) {
                    return;
                }
                //修复一个IE下的bug: 鼠标点击一段已选择的文本中间时，可能在mouseup后的一段时间内取到的range是在selection的type为None下的错误值.
                //IE下如果用户是拖拽一段已选择文本，则不会触发mouseup事件，所以这里的特殊处理不会对其有影响
                var ieRange;
                if (hackForMouseUp && me.selection.getNative().type == 'None') {
                    ieRange = me.document.body.createTextRange();
                    try {
                        ieRange.moveToPoint(mouseX, mouseY);
                    } catch (ex) {
                        ieRange = null;
                    }
                }
                var bakGetIERange;
                if (ieRange) {
                    bakGetIERange = me.selection.getIERange;
                    me.selection.getIERange = function () {
                        return ieRange;
                    };
                }
                me.selection.cache();
                if (bakGetIERange) {
                    me.selection.getIERange = bakGetIERange;
                }
                if (me.selection._cachedRange && me.selection._cachedStartElement) {
                    me.fireEvent('beforeselectionchange');
                    // 第二个参数causeByUi为true代表由用户交互造成的selectionchange.
                    me.fireEvent('selectionchange', !!evt);
                    me.fireEvent('afterselectionchange');
                    me.selection.clear();
                }
            }, delay || 50);
        },
        _callCmdFn: function (fnName, args) {
            args = Array.prototype.slice.call(args,0);
            var cmdName = args.shift().toLowerCase(),
                cmd, cmdFn;
            cmd = this.commands[cmdName] || UM.commands[cmdName];
            cmdFn = cmd && cmd[fnName];
            //没有querycommandstate或者没有command的都默认返回0
            if ((!cmd || !cmdFn) && fnName == 'queryCommandState') {
                return 0;
            } else if (cmdFn) {
                return cmdFn.apply(this, [cmdName].concat(args));
            }
        },

        /**
         * 执行编辑命令cmdName，完成富文本编辑效果
         * @name execCommand
         * @grammar editor.execCommand(cmdName)   => {*}
         */
        execCommand: function (cmdName) {
            if(!this.isFocus()){
                var bakRange = this.selection._bakRange;
                if(bakRange){
                    bakRange.select()
                }else{
                    this.focus(true)
                }

            }
            cmdName = cmdName.toLowerCase();
            var me = this,
                result,
                cmd = me.commands[cmdName] || UM.commands[cmdName];
            if (!cmd || !cmd.execCommand) {
                return null;
            }
            if (!cmd.notNeedUndo && !me.__hasEnterExecCommand) {
                me.__hasEnterExecCommand = true;
                if (me.queryCommandState.apply(me,arguments) != -1) {
                    me.fireEvent('saveScene');
                    me.fireEvent('beforeexeccommand', cmdName);
                    result = this._callCmdFn('execCommand', arguments);
                    (!cmd.ignoreContentChange && !me._ignoreContentChange) && me.fireEvent('contentchange');
                    me.fireEvent('afterexeccommand', cmdName);
                    me.fireEvent('saveScene');
                }
                me.__hasEnterExecCommand = false;
            } else {
                result = this._callCmdFn('execCommand', arguments);
                (!me.__hasEnterExecCommand && !cmd.ignoreContentChange && !me._ignoreContentChange) && me.fireEvent('contentchange')
            }
            (!me.__hasEnterExecCommand && !cmd.ignoreContentChange && !me._ignoreContentChange) && me._selectionChange();
            return result;
        },
        /**
         * 根据传入的command命令，查选编辑器当前的选区，返回命令的状态
         * @name  queryCommandState
         * @grammar editor.queryCommandState(cmdName)  => (-1|0|1)
         * @desc
         * * ''-1'' 当前命令不可用
         * * ''0'' 当前命令可用
         * * ''1'' 当前命令已经执行过了
         */
        queryCommandState: function (cmdName) {
            try{
                return this._callCmdFn('queryCommandState', arguments);
            }catch(e){
                return 0
            }

        },

        /**
         * 根据传入的command命令，查选编辑器当前的选区，根据命令返回相关的值
         * @name  queryCommandValue
         * @grammar editor.queryCommandValue(cmdName)  =>  {*}
         */
        queryCommandValue: function (cmdName) {
            try{
                return this._callCmdFn('queryCommandValue', arguments);
            }catch(e){
                return null
            }
        },
        /**
         * 检查编辑区域中是否有内容，若包含tags中的节点类型，直接返回true
         * @name  hasContents
         * @desc
         * 默认有文本内容，或者有以下节点都不认为是空
         * <code>{table:1,ul:1,ol:1,dl:1,iframe:1,area:1,base:1,col:1,hr:1,img:1,embed:1,input:1,link:1,meta:1,param:1}</code>
         * @grammar editor.hasContents()  => (true|false)
         * @grammar editor.hasContents(tags)  =>  (true|false)  //若文档中包含tags数组里对应的tag，直接返回true
         * @example
         * editor.hasContents(['span']) //如果编辑器里有这些，不认为是空
         */
        hasContents: function (tags) {
            if (tags) {
                for (var i = 0, ci; ci = tags[i++];) {
                    if (this.body.getElementsByTagName(ci).length > 0) {
                        return true;
                    }
                }
            }
            if (!domUtils.isEmptyBlock(this.body)) {
                return true
            }
            //随时添加,定义的特殊标签如果存在，不能认为是空
            tags = ['div'];
            for (i = 0; ci = tags[i++];) {
                var nodes = domUtils.getElementsByTagName(this.body, ci);
                for (var n = 0, cn; cn = nodes[n++];) {
                    if (domUtils.isCustomeNode(cn)) {
                        return true;
                    }
                }
            }
            return false;
        },
        /**
         * 重置编辑器，可用来做多个tab使用同一个编辑器实例
         * @name  reset
         * @desc
         * * 清空编辑器内容
         * * 清空回退列表
         * @grammar editor.reset()
         */
        reset: function () {
            this.fireEvent('reset');
        },
        isEnabled: function(){
            return this._isEnabled != true;
        },

        setEnabled: function () {
            var me = this, range;

            me.body.contentEditable = true;

            /* 恢复选区 */
            if (me.lastBk) {
                range = me.selection.getRange();
                try {
                    range.moveToBookmark(me.lastBk);
                    delete me.lastBk
                } catch (e) {
                    range.setStartAtFirst(me.body).collapse(true)
                }
                range.select(true);
            }

            /* 恢复query函数 */
            if (me.bkqueryCommandState) {
                me.queryCommandState = me.bkqueryCommandState;
                delete me.bkqueryCommandState;
            }

            /* 恢复原生事件 */
            if (me._bkproxyDomEvent) {
                me._proxyDomEvent = me._bkproxyDomEvent;
                delete me._bkproxyDomEvent;
            }

            /* 触发事件 */
            me.fireEvent('setEnabled');
        },
        /**
         * 设置当前编辑区域可以编辑
         * @name enable
         * @grammar editor.enable()
         */
        enable: function () {
            return this.setEnabled();
        },
        setDisabled: function (except, keepDomEvent) {
            var me = this;

            me.body.contentEditable = false;
            me._except = except ? utils.isArray(except) ? except : [except] : [];

            /* 备份最后的选区 */
            if (!me.lastBk) {
                me.lastBk = me.selection.getRange().createBookmark(true);
            }

            /* 备份并重置query函数 */
            if(!me.bkqueryCommandState) {
                me.bkqueryCommandState = me.queryCommandState;
                me.queryCommandState = function (type) {
                    if (utils.indexOf(me._except, type) != -1) {
                        return me.bkqueryCommandState.apply(me, arguments);
                    }
                    return -1;
                };
            }

            /* 备份并墙原生事件 */
            if(!keepDomEvent && !me._bkproxyDomEvent) {
                me._bkproxyDomEvent = me._proxyDomEvent;
                me._proxyDomEvent = function () {
                    return false;
                };
            }

            /* 触发事件 */
            me.fireEvent('selectionchange');
            me.fireEvent('setDisabled', me._except);
        },
        /** 设置当前编辑区域不可编辑,except中的命令除外
         * @name disable
         * @grammar editor.disable()
         * @grammar editor.disable(except)  //例外的命令，也即即使设置了disable，此处配置的命令仍然可以执行
         * @example
         * //禁用工具栏中除加粗和插入图片之外的所有功能
         * editor.disable(['bold','insertimage']);//可以是单一的String,也可以是Array
         */
        disable: function (except) {
            return this.setDisabled(except);
        },
        /**
         * 设置默认内容
         * @ignore
         * @private
         * @param  {String} cont 要存入的内容
         */
        _setDefaultContent: function () {
            function clear() {
                var me = this;
                if (me.document.getElementById('initContent')) {
                    me.body.innerHTML = '<p>' + (ie ? '' : '<br/>') + '</p>';
                    me.removeListener('firstBeforeExecCommand focus', clear);
                    setTimeout(function () {
                        me.focus();
                        me._selectionChange();
                    }, 0)
                }
            }

            return function (cont) {
                var me = this;
                me.body.innerHTML = '<p id="initContent">' + cont + '</p>';

                me.addListener('firstBeforeExecCommand focus', clear);
            }
        }(),
        /**
         * show方法的兼容版本
         * @private
         * @ignore
         */
        setShow: function () {
            var me = this, range = me.selection.getRange();
            if (me.container.style.display == 'none') {
                //有可能内容丢失了
                try {
                    range.moveToBookmark(me.lastBk);
                    delete me.lastBk
                } catch (e) {
                    range.setStartAtFirst(me.body).collapse(true)
                }
                //ie下focus实效，所以做了个延迟
                setTimeout(function () {
                    range.select(true);
                }, 100);
                me.container.style.display = '';
            }

        },
        /**
         * 显示编辑器
         * @name show
         * @grammar editor.show()
         */
        show: function () {
            return this.setShow();
        },
        /**
         * hide方法的兼容版本
         * @private
         * @ignore
         */
        setHide: function () {
            var me = this;
            if (!me.lastBk) {
                me.lastBk = me.selection.getRange().createBookmark(true);
            }
            me.container.style.display = 'none'
        },
        /**
         * 隐藏编辑器
         * @name hide
         * @grammar editor.hide()
         */
        hide: function () {
            return this.setHide();
        },
        /**
         * 根据制定的路径，获取对应的语言资源
         * @name  getLang
         * @grammar editor.getLang(path)  =>  （JSON|String) 路径根据的是lang目录下的语言文件的路径结构
         * @example
         * editor.getLang('contextMenu.delete') //如果当前是中文，那返回是的是删除
         */
        getLang: function (path) {
            var lang = UM.I18N[this.options.lang];
            if (!lang) {
                throw Error("not import language file");
            }
            path = (path || "").split(".");
            for (var i = 0, ci; ci = path[i++];) {
                lang = lang[ci];
                if (!lang)break;
            }
            return lang;
        },
        /**
         * 计算编辑器当前内容的长度
         * @name  getContentLength
         * @grammar editor.getContentLength(ingoneHtml,tagNames)  =>
         * @example
         * editor.getLang(true)
         */
        getContentLength: function (ingoneHtml, tagNames) {
            var count = this.getContent(false,false,true).length;
            if (ingoneHtml) {
                tagNames = (tagNames || []).concat([ 'hr', 'img', 'iframe']);
                count = this.getContentTxt().replace(/[\t\r\n]+/g, '').length;
                for (var i = 0, ci; ci = tagNames[i++];) {
                    count += this.body.getElementsByTagName(ci).length;
                }
            }
            return count;
        },
        addInputRule: function (rule,ignoreUndo) {
            rule.ignoreUndo = ignoreUndo;
            this.inputRules.push(rule);
        },
        filterInputRule: function (root,isUndoLoad) {
            for (var i = 0, ci; ci = this.inputRules[i++];) {
                if(isUndoLoad && ci.ignoreUndo){
                    continue;
                }
                ci.call(this, root)
            }
        },
        addOutputRule: function (rule,ignoreUndo) {
            rule.ignoreUndo = ignoreUndo;
            this.outputRules.push(rule)
        },
        filterOutputRule: function (root,isUndoLoad) {
            for (var i = 0, ci; ci = this.outputRules[i++];) {
                if(isUndoLoad && ci.ignoreUndo){
                    continue;
                }
                ci.call(this, root)
            }
        }
    };
    utils.inherits(Editor, EventBase);
})();
