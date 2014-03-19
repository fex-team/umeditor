module("core.Editor");
//test('', function () {
//    stop()
//});
var pluginsList = {
    'autosave': ['clearlocaldata', 'getlocaldata', 'drafts'],
    'basestyle': ['bold', 'underline', 'superscript', 'subscript', 'italic', 'strikethrough'],
    'font': ['forecolor', 'backcolor', 'fontsize', 'fontfamily'],
    'formula': ['formula'],
    'horizontal': ['horizontal'],
    'justify': ['justifyleft', 'justifyright', 'justifycenter' , 'justifyfull'],
    'link': ['link', 'unlink'],
    'list': ['insertorderedlist', 'insertunorderedlist'],
    'paragraph': ['paragraph'],
    'removeformat': ['removeformat'],
    'selectall': ['selectall'],
    'source': ['source'],
    'undo': ['undo', 'redo'],
    'video': ['insertvideo']
    //    'autoupload':[],
    //    'cleardoc':['cleardoc'],
//    'enterkey':[],
    //    'paste':[],
//    'preview':['preview'],
//    'print':['print'],
//    'image':['insertimage'],
//    'inserthtml':['inserthtml'],
};

test('某一个插件不加载', function () {
    if(ua.browser.ie)return;
    var i = 0;
    for (var p in pluginsList) {
        var e = new UM.Editor({excludePlugins: p});
        e.addListener("langReady", function () {
            var flag = true;
            var msg = '';
            for (var p2 in pluginsList) {
                if (p2 == e.options['excludePlugins'])
                    continue;
                for (var c in pluginsList[p2]) {
                    if (e.commands[pluginsList[p2][c]] === undefined) {
                        flag = false;
                        msg += pluginsList[p2][c] + ' ';
                    }
                }
            }
            equal(flag, true, 'exclude' + p + '未加载:' + msg);
            i++;
            if (i == Object.keys(pluginsList).length) {
                start();
            }
        });
        //todo ie下这里需要个延迟 加 e = null;
    }
    stop();
});
test("autoSyncData:true,textarea容器(由setcontent触发的)", function () {
    var div = document.body.appendChild(document.createElement('div'));
    div.innerHTML = '<form id="form" method="post" target="_blank"><textarea id="myEditor" name="myEditor">这里的内容将会和html，body等标签一块提交</textarea></form>';
    var editor_a = UM.getEditor('myEditor');
    stop();
    editor_a.ready(function () {
        editor_a.setContent('<p>设置内容autoSyncData 1<br/></p>');
        setTimeout(function () {
            var textarea = document.getElementById('myEditor');
            equal(textarea.value, '<p>设置内容autoSyncData 1<br/></p>', 'textarea内容正确');
            te.dom.push(editor_a.container);
            document.getElementById('form').parentNode.removeChild(document.getElementById('form'));
            document.getElementById('test1') && te.dom.push(document.getElementById('test1'));
            setTimeout(function () {
                start();
            }, 100);
        }, 100);
    });
});
test("autoSyncData:true（由blur触发的）", function () {
    //todo ie8里事件触发有问题，暂用手动测
    if (ua.browser.ie > 8 || !ua.browser.ie) {
        var div = document.body.appendChild(document.createElement('div'));
        div.innerHTML = '<form id="form" method="post" ><script type="text/plain" id="myEditor_autoSyncData_blur" name="myEditor"></script></form>';
        var editor_a = UM.getEditor('myEditor_autoSyncData_blur');
        stop();
        editor_a.ready(function () {
            editor_a.body.innerHTML = '<p>设置内容autoSyncData 2<br/></p>';
            equal(document.getElementsByTagName('textarea').length, 0, '内容空没有textarea');
            ua.blur(editor_a.body);
            stop();
            setTimeout(function () {
                var form = document.getElementById('form');
                var textarea = form.lastChild;
                if (textarea.tagName.toLowerCase() == 'textarea') {
                    equal(textarea.value, '<p>设置内容autoSyncData 2<br/></p>', 'textarea内容正确');
                }
                else {
                    ok(false, '没有textarea');
                }
                te.dom.push(editor_a.container);

                form && form.parentNode.removeChild(form);
                start();

            }, 100);
        });
    }
});
test("sync", function () {
    var div = document.body.appendChild(document.createElement('div'));
    div.innerHTML = '<form id="form" method="post" target="_blank"><textarea id="myEditor_sync" name="myEditor">这里的内容将会和html，body等标签一块提交</textarea></form>';
    var editor_a = UM.getEditor('myEditor_sync');
    stop();
    editor_a.ready(function () {
        editor_a.body.innerHTML = '<p>hello</p>';
        editor_a.sync("form");
        setTimeout(function () {
            var textarea = document.getElementById('myEditor_sync');
            equal(textarea.value, '<p>hello</p>', '同步内容正确');
            te.dom.push(editor_a.container);
            start();

        }, 100);
    });
});

test('默认加载全部插件', function () {
    var editor = te.obj[1];
    var div = te.dom[0];
    editor.render(div);
    var flag = true;
    var msg = '';
    editor.ready(function () {
        for (var p in pluginsList) {
            for (var c in pluginsList[p]) {
                if (editor.commands[pluginsList[p][c]] === undefined) {
                    flag = false;
                    msg += pluginsList[p][c] + ' ';
                }
            }
        }
        equal(flag, true, '未加载:' + msg);
        start();
    });
    stop();
});
test('多个插件不加载', function () {
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ex';
    var editor = UM.getEditor('ex',{excludePlugins: 'font undo source'});
    editor.ready( function () {
        var flag = true;
        var msg = '';
        for (var p in pluginsList) {
            if (editor.options['excludePlugins'].indexOf(p) > -1)
                continue;
            for (var c in pluginsList[p]) {
                if (editor.commands[pluginsList[p][c]] === undefined) {
                    flag = false;
                    msg += pluginsList[p][c] + ' ';
                }
            }
        }
        equal(flag, true, 'exclude' + p + '未加载:' + msg);
        UM.delEditor('ex');
        document.getElementById('ex')&&document.getElementById('ex').parentNode.removeChild(document.getElementById('ex'));
        start();
    });
    stop();
});
test("hide,show", function () {
    var editor = te.obj[1];
    var div = te.dom[0];
    editor.render(div);
    editor.ready(function () {
        equal(editor.body.getElementsByTagName('span').length, 0, '初始没有书签');
        editor.hide();
        setTimeout(function () {
            equal($(editor.container).css('display'), 'none', '隐藏编辑器');
            equal(editor.body.getElementsByTagName('span').length, 1, '插入书签');
            ok(/_baidu_bookmark_start/.test(editor.body.getElementsByTagName('span')[0].id), '书签');
            editor.show();
            setTimeout(function () {
                equal($(te.dom[0]).css('display'), 'block', '显示编辑器');
                var br = ua.browser.ie ? '' : '<br>';
                equal(ua.getChildHTML(editor.body), '<p>' + br + '</p>', '删除书签');
                start();
            }, 200);
        }, 200);
    });
    stop();
});

test("_setDefaultContent--focus", function () {
    var editor = te.obj[1];
    var div = te.dom[0];
    editor.render(div);
    editor.ready(function () {
        editor._setDefaultContent('hello');
        editor.fireEvent('focus');
        setTimeout(function () {
            var br = ua.browser.ie ? '' : '<br>';
            equal(ua.getChildHTML(editor.body), '<p>' + br + '</p>', 'focus');
            start();
        }, 200);
    });
    stop();
});

test("_setDefaultContent--firstBeforeExecCommand", function () {
    var editor = te.obj[1];
    var div = te.dom[0];
    editor.render(div);
    editor.ready(function () {
        editor._setDefaultContent('hello');
        editor.fireEvent('firstBeforeExecCommand');
        var br = ua.browser.ie ? '' : '<br>';
        equal(ua.getChildHTML(editor.body), '<p>' + br + '</p>', 'firstBeforeExecCommand');
        start();
    });
    stop();
});
test("trace 3610 setDisabled,setEnabled", function () {
    var editor = te.obj[1];
    var div = te.dom[0];
    editor.render(div);
    editor.ready(function () {
        editor.setContent('<p>欢迎使用umeditor!</p>');
        editor.focus();
        if (ua.browser.ie && ua.browser.ie < 9) {//trace 3628 ie8 focus 设置无效,手动设range
            var range = new UM.dom.Range(editor.document, editor.body);
            range.setStart(editor.body.firstChild, 0).collapse(true).select();
        }
        setTimeout(function () {
            if (ua.browser.ie && ua.browser.ie < 9) {//trace 3628 ie8 focus 设置无效,手动设range
                ua.manualDeleteFillData(editor.body);
            }
            var startContainer = editor.selection.getRange().startContainer.outerHTML;
            var startOffset = editor.selection.getRange().startOffset;
            var collapse = editor.selection.getRange().collapsed;
            editor.setDisabled();
            setTimeout(function () {
                equal(editor.body.contentEditable, 'false', 'setDisabled');
                equal(editor.body.firstChild.firstChild.tagName.toLowerCase(), 'span', '插入书签');
                equal($(editor.body.firstChild.firstChild).css('display'), 'none', '检查style');
                equal($(editor.body.firstChild.firstChild).css('line-height'), '0px', '检查style');
                ok(/_baidu_bookmark_start/.test(editor.body.firstChild.firstChild.id), '书签');///_baidu_bookmark_start/.test()
                editor.setEnabled();
                setTimeout(function () {
                    equal(editor.body.contentEditable, 'true', 'setEnabled');
                    equal(ua.getChildHTML(editor.body), '<p>欢迎使用umeditor!</p>', '内容恢复');
                    if (!ua.browser.ie || ua.browser.ie < 9) {//todo ie9,10改range 之后，ie9,10这里的前后range不一致，focus时是text，setEnabled后是p
                        equal(editor.selection.getRange().startContainer.outerHTML, startContainer, '检查range');
                    }
                    equal(editor.selection.getRange().startOffset, startOffset, '检查range');
                    equal(editor.selection.getRange().collapsed, collapse, '检查range');
                    start();
                }, 50);
            }, 50);
        }, 50);
    });
    stop();
});
test("render-- options", function () {
    var options = {'initialContent': '<span class="span">xxx</span><div>xxx<p></p></div>', 'UEDITOR_HOME_URL': '../../../', autoClearinitialContent: false, 'autoFloatEnabled': false};
    var editor = new UM.Editor(options);

    var div = document.body.appendChild(document.createElement('div'));
    editor.render(div);
    /*会自动用p标签包围*/
//    var space = UM.browser.ie ? '&nbsp;' : '<br>';
    stop();
    editor.ready(function () {
        equal(ua.getChildHTML(editor.body), '<p><span class="span">xxx</span></p><div>xxx<p></p></div>', 'check initialContent');
        te.dom.push(div);
        start();
    });
});

test('destroy', function () {
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'edu';
    var editor = UM.getEditor('edu');
    editor.ready(function () {
        editor.destroy();
        equal(document.getElementById('edu').tagName.toLowerCase(), 'textarea', '容器被删掉了');
        UM.clearCache('edu');
        document.getElementById('edu') && te.dom.push(document.getElementById('edu'));
    });
});

test("getContent--转换空格，nbsp与空格相间显示", function () {
    var editor = te.obj[1];
    var div = te.dom[0];
    editor.render(div);
    stop();
    editor.ready(function () {
        setTimeout(function () {
            editor.focus();
            var innerHTML = '<div> x  x   x&nbsp;&nbsp;&nbsp;&nbsp;x&nbsp;&nbsp;  &nbsp;</div>';
            editor.setContent(innerHTML);

            equal(editor.getContent(), '<div>x &nbsp;x &nbsp; x&nbsp;&nbsp;&nbsp;&nbsp;x&nbsp;&nbsp; &nbsp;&nbsp;</div>', "转换空格，nbsp与空格相间显示，原nbsp不变");
            start();
        }, 100);
    });
});

test('getContent--参数为函数', function () {
    var editor = te.obj[1];
    var div = te.dom[0];
    editor.render(div);
    stop();
    setTimeout(function () {
        editor.focus();
        editor.setContent("<p><br/>dd</p>");
        equal(editor.getContent(), "<p><br/>dd</p>", 'hasContents判断不为空');
        equal(editor.getContent(function () {
            return false
        }), "", '为空');

        start();
    }, 50);
});

test('getContent--2个参数，第一个参数为参数为函数', function () {
    var editor = te.obj[1];
    var div = te.dom[0];
    editor.render(div);
    stop();
    setTimeout(function () {
        editor.focus();
        editor.setContent("<p><br/>dd</p>");
        equal(editor.getContent(), "<p><br/>dd</p>", 'hasContents判断不为空');
        equal(editor.getContent("", function () {
            return false
        }), "", '为空');
        start();
    }, 50);
});

test("setContent", function () {
    var editor = te.obj[1];
    var div = te.dom[0];
    editor.render(div);
    stop();
    editor.ready(function () {
        editor.focus();
        expect(2);
        editor.addListener("beforesetcontent", function () {
            ok(true, "beforesetcontent");
        });
        editor.addListener("aftersetcontent", function () {
            ok(true, "aftersetcontent");
        });
        var html = '<span><span></span><strong>xx</strong><em>em</em><em></em><u></u></span><div>xxxx</div>';
        editor.setContent(html);
        var div_new = document.createElement('div');
        div_new.innerHTML = '<p><span><span></span><strong>xx</strong><em>em</em><em></em><span style="text-decoration: underline"></span></span></p><div>xxxx</div>';
        var div2 = document.createElement('div');
        div2.innerHTML = editor.body.innerHTML;
        ua.haveSameAllChildAttribs(div2, div_new, 'check contents');
        setTimeout(function () {
            start();
        }, 1000);
    });
});

test("setContent 追加", function () {
    var editor = te.obj[1];
    var div = te.dom[0];
    editor.render(div);
    stop();
    editor.ready(function () {
        editor.focus();
        expect(2);
        editor.addListener("beforesetcontent", function () {
            ok(true, "beforesetcontent");
        });
        editor.addListener("aftersetcontent", function () {
            ok(true, "aftersetcontent");
        });
        var html = '<span><span></span><strong>xx</strong><em>em</em><em></em><u></u></span><div>xxxx</div>';
        editor.setContent(html);
        var div_new = document.createElement('div');
        div_new.innerHTML = '<p><span><span></span><strong>xx</strong><em>em</em><em></em><span style="text-decoration: underline"></span></span></p><div>xxxx</div>';
        var div2 = document.createElement('div');
        div2.innerHTML = editor.body.innerHTML;
        ua.haveSameAllChildAttribs(div2, div_new, 'check contents');
        start();
    });
});

test("focus(false)", function () {
    if (ua.browser.ie && ua.browser.ie < 9)return;//trace 3628 ie8 focus
    var editor = te.obj[1];
    var div = te.dom[0];
    editor.render(div);
    stop();
    editor.ready(function () {
        editor.setContent("<p>hello1</p><p>hello2</p>");
        editor.focus(false);
        setTimeout(function () {
            var rng = editor.selection.getRange();
            var start = rng.startContainer;
            if(start.nodeName == 'P' && rng.startOffset == 0){
                if(start = start.childNodes[rng.startOffset]){
                    if(start.nodeType == 3){
                        rng.setStart(start,0).collapse(true);
                    }
                }
            }
            equal(rng.collapsed,true);
            equal(rng.startContainer,editor.body.firstChild.firstChild,"focus(false)焦点在最前面");
            equal(rng.startOffset,0,"focus(false)焦点在最前面");

        }, 100);
        start();
    });
});

test("focus(true)", function () {
    var editor = te.obj[1];
    var div = te.dom[0];
    editor.render(div);

    stop();
    editor.ready(function () {
        editor.setContent("<p>hello1</p><p>hello2</p>");
        editor.focus(true);
        var rng = editor.selection.getRange();
        var start = rng.startContainer;
        if(start.nodeName == 'P' && rng.startOffset == start.childNodes.length){
            if(start = start.lastChild){
                if(start.nodeType == 3){
                    rng.setStartAtLast(start).collapse(true);
                }
            }
        }
        equal(rng.collapsed,true);
        equal(rng.startContainer,editor.body.lastChild.lastChild,"focus( true)焦点在最后面");
        equal(rng.endOffset, editor.body.lastChild.lastChild.nodeValue.length, "focus( true)焦点在最后面");

    });
    start();
});

/*按钮高亮、正常和灰色*/
test("queryCommandState", function () {
    var editor = te.obj[1];
    var div = te.dom[0];
    editor.render(div);
    stop();
    editor.ready(function () {
        editor.focus();
        editor.setContent("<p><b>xxx</b>xxx</p>");
        var p = editor.document.getElementsByTagName('p')[0];
        var r = new UM.dom.Range(editor.document, editor.body);
        r.setStart(p.firstChild, 0).setEnd(p.firstChild, 1).select();
        equal(editor.queryCommandState('bold'), 1, '加粗状态为1');
        r.setStart(p, 1).setEnd(p, 2).select();
        equal(editor.queryCommandState('bold'), 0, '加粗状态为0');
        start();
    });
});
test("trace 3581 queryCommandValue", function () {
    if (ua.browser.gecko)return;//todo trace 3581
    var editor = te.obj[1];
    var div = te.dom[0];
    editor.render(div);
    stop();
    editor.ready(function () {
        editor.focus();
        editor.setContent('<p>xxx</p>');
        var range = new UM.dom.Range(editor.document, editor.body);
        var p = editor.document.getElementsByTagName("p")[0];
        range.selectNode(p).select();
        editor.execCommand('justifyleft');
        equal(editor.queryCommandValue('justifyleft'), 'left', 'text align is left');
        start();
    });
});
test("execCommand", function () {
    var editor = te.obj[1];
    var div = te.dom[0];
    editor.render(div);
    stop();
    editor.ready(function () {
        editor.focus();
        editor.setContent("<p>xx</p><p>xxx</p>");
        var doc = editor.document;
        var range = new UM.dom.Range(doc, editor.body);
        var p = doc.getElementsByTagName('p')[1];
        range.setStart(p, 0).setEnd(p, 1).select();
        editor.execCommand('justifyright');
        if (ua.browser.gecko)
            equal($(p).css('text-align'), '-moz-right', 'execCommand align');
        else
            equal($(p).css('text-align'), 'right', 'execCommand align');
        range.selectNode(p).select();
        editor.execCommand("forecolor", "red");
        var font = doc.getElementsByTagName('font')[0];
        equal(ua.formatColor(font.color), "#ff0000", 'check execCommand color');
        var html = '<p>xx</p><p style=\"text-align: right;\"><font color=\"#ff0000\">xxx</font></p>';
        var html_1 = "<p>xx</p><p align=\"right\"><font color=\"red\">xxx</font></p>";
        ua.checkSameHtml(editor.body.innerHTML, ua.browser.webkit ? html : html_1, 'check style')
        start();
    });
});

test("hasContents", function () {
    var editor = te.obj[1];
    var div = te.dom[0];
    editor.render(div);
    stop();
    editor.ready(function () {
        editor.focus();
        editor.setContent('');
        ok(!editor.hasContents(), "have't content");
        editor.setContent("xxx");
        ok(editor.hasContents(), "has contents");
        editor.setContent('<p><br/></p>');
        ok(!editor.hasContents(), '空p认为是空');
        start();
    });
});


/*参数是对原有认为是空的标签的一个扩展，即原来的dtd认为br为空，加上这个参数可以认为br存在时body也不是空*/
test("hasContents--有参数", function () {
    var editor = te.obj[1];
    var div = te.dom[0];
    editor.render(div);
    stop();
    editor.ready(function () {
        editor.focus();
        editor.setContent('<p><img src="" alt="">你好<ol><li>ddd</li></ol></p>');
        ok(editor.hasContents(['ol', 'li', 'table']), "有ol和li");
        ok(editor.hasContents(['td', 'li', 'table']), "有li");
        editor.setContent('<p><br></p>');
        ok(!editor.hasContents(['']), "为空");
        ok(editor.hasContents(['br']), "不为空");
        start();
    });
});

test('trace 1964 getPlainTxt--得到有格式的编辑器的纯文本内容', function () {
    if (ua.browser.ie > 0 && ua.browser.ie < 9)return;//TODO 1.2.6
    var editor = te.obj[1];
    var div = te.dom[0];
    editor.render(div);
    stop();
    editor.ready(function () {
        editor.focus();
        editor.setContent('<p>&nbsp;</p><p>&nbsp; hell\no<br/>hello</p>');
        equal(editor.getPlainTxt(), "\n  hello\nhello\n", '得到编辑器的纯文本内容，但会保留段落格式');
        start();
    });
});

test('getContentTxt--文本前后的空格,&nbs p转成空格', function () {
    var editor = te.obj[1];
    var div = te.dom[0];
    editor.render(div);
    stop();
    editor.ready(function () {
        editor.focus();
        editor.setContent('&nbsp;&nbsp;你 好&nbsp;&nbsp; ');
        equal(editor.getContentTxt(), '  你 好   ');
        equal(editor.getContentTxt().length, 8, '8个字符，空格不被过滤');
        start();
    });
});
test('getAllHtml', function () {
    var editor = te.obj[1];
    var div = te.dom[0];
    editor.render(div);
    stop();
    editor.ready(function () {
        editor.focus();
        var html = editor.getAllHtml();
        ok(/umeditor.css/.test(html), '引入样式');
        start();
    });
});
test('2个实例采用2个配置文件', function () {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '../../editor_config.js';
    head.appendChild(script);
    expect(6);
    stop();
    /*动态加载js需要时间，用这个umeditor.config.js覆盖默认的配置文件*/
    setTimeout(function () {
        var div1 = document.body.appendChild(document.createElement('div'));
        div1.id = 'div1';
        div1.style.height = '200px';
        var div2 = document.body.appendChild(document.createElement('div'));
        div2.id = 'div2';
        var editor1 = UM.getEditor('div1', {'UEDITOR_HOME_URL': '../../../', 'initialContent': '欢迎使用umeditor', 'autoFloatEnabled': false});
        editor1.ready(function () {
            var editor2 = UM.getEditor('div2', UMEDITOR_CONFIG2);
            editor2.ready(function () {
                equal(editor1.body.style.minHeight, '200px', '编辑器高度为200px');
                equal(editor2.body.style.minHeight, '400px', '自定义div高度为400px');
                var html = UMEDITOR_CONFIG2.initialContent;
                ua.checkHTMLSameStyle(html, editor2.document, editor2.body.firstChild, '初始内容为自定制的');
                equal(editor2.options.enterTag, 'br', 'enterTag is br');
                html = '欢迎使用umeditor';
                equal(html, editor1.body.firstChild.innerHTML, '内容和umeditor.config一致');
                equal(editor1.options.enterTag, 'p', 'enterTag is p');
                te.dom.push(editor1.container);
                te.dom.push(editor2.container);
                document.getElementById('div1') && te.dom.push(document.getElementById('div1'));
                document.getElementById('div2') && te.dom.push(document.getElementById('div2'));
                start();
            });
        });
    }, 300);
});
test("_initEvents,_proxyDomEvent--click", function () {
    var editor = te.obj[1];
    var div = te.dom[0];
    editor.render(div);
    stop();
    editor.ready(function () {
        editor.focus();
        expect(1);
        stop();
        editor.addListener('click', function () {
            ok(true, 'click event dispatched');

            start();
        });
        ua.click(editor.body);
    });
});
test('绑定事件', function () {
    document.onmouseup = function (event) {
        ok(true, "mouseup is fired");
    };
    document.onmousedown = function (event) {
        ok(true, "mousedown is fired");
    };
//    document.onmouseover = function (event) {
//        ok(true, "mouseover is fired");
//    };
    document.onkeydown = function (event) {
        ok(true, "keydown is fired");
    };
    document.onkeyup = function (event) {
        ok(true, "keyup is fired");
    };
    var editor = new UM.Editor({'autoFloatEnabled': false});
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'event';
    editor.render('event');
    expect(4);
    editor.ready(function () {
        setTimeout(function () {
            editor.focus();
            ua.mousedown(document.body);
            ua.mouseup(document.body);
//            ua.mouseover(document.body);
            ua.keydown(document.body, {'keyCode': 13});
            ua.keyup(document.body, {'keyCode': 13});
            setTimeout(function () {
                document.getElementById('event') && te.dom.push(document.getElementById('event'));
                start();
            }, 1000);
        }, 50);
    });
    stop();
});

