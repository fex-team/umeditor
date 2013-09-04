module("core.Editor");

//test('', function () {
//    stop()
//});
test("autoSyncData:true,textarea容器(由setcontent触发的)", function () {
    var div = document.body.appendChild(document.createElement('div'));
    div.innerHTML = '<form id="form" method="post" target="_blank"><textarea id="myEditor" name="myEditor">这里的内容将会和html，body等标签一块提交</textarea></form>';
    var editor_a = UE.getEditor('myEditor');
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
        var editor_a = UE.getEditor('myEditor_autoSyncData_blur');
        stop();
        editor_a.ready(function () {
            editor_a.body.innerHTML = '<p>设置内容autoSyncData 2<br/></p>';
            equal(document.getElementsByTagName('textarea').length, 0, '内容空没有textarea');
            ua.blur(editor_a.body);
            stop();
            setTimeout(function () {
                var form = document.getElementById('form');
                var textarea = form.lastChild;
                if(textarea.tagName.toLowerCase()=='textarea'){
                    equal(textarea.value, '<p>设置内容autoSyncData 2<br/></p>', 'textarea内容正确');
                }
                else{
                    ok(false,'没有textarea');
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
    var editor_a = UE.getEditor('myEditor_sync');
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
test("hide,show", function () {
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue_hide_show';
    var editor = UE.getEditor('ue_hide_show');
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
                te.dom.push(editor.container);

                start();
            }, 50);
        }, 50);
    });
    stop();
});

test("_setDefaultContent--focus", function () {
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue_setDefaultContent_focus';
    var editor = UE.getEditor('ue_setDefaultContent_focus');
    editor.ready(function () {
        editor._setDefaultContent('hello');
        editor.fireEvent('focus');
        var br = ua.browser.ie ? '' : '<br>';
        equal(ua.getChildHTML(editor.body), '<p>' + br + '</p>', 'focus');
        te.dom.push(editor.container);

        start();
    });
    stop();
});

test("_setDefaultContent--firstBeforeExecCommand", function () {
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue_setDefaultContent_firstBef';
    var editor = UE.getEditor('ue_setDefaultContent_firstBef');
    editor.ready(function () {
        editor._setDefaultContent('hello');
        editor.fireEvent('firstBeforeExecCommand');
        var br = ua.browser.ie ? '' : '<br>';
        equal(ua.getChildHTML(editor.body), '<p>' + br + '</p>', 'firstBeforeExecCommand');
        te.dom.push(editor.container);

        start();
    });
    stop();
});
test("trace 3610 setDisabled,setEnabled", function () {
    if(ua.browser.gecko)return;//trace 3610
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue_setDisabled';
    var editor = UE.getEditor('ue_setDisabled');
    editor.ready(function () {
        editor.setContent('<p>欢迎使用ueditor!</p>');
        editor.focus();
        setTimeout(function () {
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
                    equal(ua.getChildHTML(editor.body), '<p>欢迎使用ueditor!</p>', '内容恢复');
                    if (!ua.browser.ie || ua.browser.ie < 9) {//todo ie9,10改range 之后，ie9,10这里的前后range不一致，focus时是text，setEnabled后是p
                        equal(editor.selection.getRange().startContainer.outerHTML, startContainer, '检查range');
                    }
                    equal(editor.selection.getRange().startOffset, startOffset, '检查range');
                    equal(editor.selection.getRange().collapsed, collapse, '检查range');
                    setTimeout(function () {
                        te.dom.push(editor.container);

                        start();
                    }, 100);
                }, 50);
            }, 50);
        }, 50);
    });
    stop();
});


test("render-- options", function () {
    var options = {'initialContent': '<span class="span">xxx</span><div>xxx<p></p></div>', 'UEDITOR_HOME_URL': '../../../', autoClearinitialContent: false, 'autoFloatEnabled': false};
    var editor = new UE.Editor(options);

    var div = document.body.appendChild(document.createElement('div'));
    editor.render(div);
    /*会自动用p标签包围*/
//    var space = UE.browser.ie ? '&nbsp;' : '<br>';
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
    var editor = UE.getEditor('edu');
    editor.ready(function () {
        editor.destroy();
        equal(document.getElementById('edu').tagName.toLowerCase(), 'textarea', '容器被删掉了');
        UE.clearCache('edu');
        document.getElementById('edu') && te.dom.push(document.getElementById('ed'));
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
    var editor = UE.getEditor('test1');
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
            UE.clearCache('test1');
            te.dom.push(editor.container);
            document.getElementById('test1') && te.dom.push(document.getElementById('test1'));
            setTimeout(function () {
                start();
            }, 100);
        }, 1000);
    });
});

test("setContent 追加", function () {
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue_setContent';
    var editor = UE.getEditor('ue_setContent');
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
        te.dom.push(editor.container);
        document.getElementById('ue_setContent') && te.dom.push(document.getElementById('ue_setContent'));
        start();
    });
});

test("focus(false)", function () {
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue_focus_false';
    var editor = UE.getEditor('ue_focus_false');
    stop();
    editor.ready(function () {
        var range = new UE.dom.Range(editor.document);
        editor.setContent("<p>hello1</p><p>hello2</p>");
        editor.focus(false);
        if (ua.browser.gecko) {
            equal(editor.selection.getRange().startContainer, editor.body.firstChild, "focus(false)焦点在最前面");
            equal(editor.selection.getRange().endContainer, editor.body.firstChild, "focus(false)焦点在最前面");
        }
        else {
            equal(editor.selection.getRange().startContainer, editor.body.firstChild.firstChild, "focus(false)焦点在最前面");
            equal(editor.selection.getRange().endContainer, editor.body.firstChild.firstChild, "focus(false)焦点在最前面");
        }
        equal(editor.selection.getRange().startOffset, 0, "focus(false)焦点在最前面");
        equal(editor.selection.getRange().endOffset, 0, "focus(false)焦点在最前面");
        te.dom.push(editor.container);
        document.getElementById('ue_focus_false') && te.dom.push(document.getElementById('ue_focus_false'));
        start();
    });
});

test("focus(true)", function () {
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue_focus_true';
    var editor = UE.getEditor('ue_focus_true');
    stop();
    editor.ready(function () {
        var range = new UE.dom.Range(editor.document);
        editor.setContent("<p>hello1</p><p>hello2</p>");
        editor.focus(true);
        if (ua.browser.gecko) {
            equal(editor.selection.getRange().startContainer, editor.body.lastChild, "focus( true)焦点在最后面");
            equal(editor.selection.getRange().endContainer, editor.body.lastChild, "focus( true)焦点在最后面");
            equal(editor.selection.getRange().startOffset, editor.body.lastChild.childNodes.length, "focus( true)焦点在最后面");
            equal(editor.selection.getRange().endOffset, editor.body.lastChild.childNodes.length, "focus( true)焦点在最后面");
        }
        else {
            equal(editor.selection.getRange().startContainer, editor.body.lastChild.lastChild, "focus( true)焦点在最后面");
            equal(editor.selection.getRange().endContainer, editor.body.lastChild.lastChild, "focus( true)焦点在最后面");
            equal(editor.selection.getRange().startOffset, editor.body.lastChild.lastChild.length, "focus( true)焦点在最后面");
            equal(editor.selection.getRange().endOffset, editor.body.lastChild.lastChild.length, "focus( true)焦点在最后面");
        }
        te.dom.push(editor.container);
        document.getElementById('ue_focus_true') && te.dom.push(document.getElementById('ue_focus_true'));
        start();
    });
});


/*按钮高亮、正常和灰色*/
test("queryCommandState", function () {
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue_queryCommandState';
    var editor = UE.getEditor('ue_queryCommandState');
    stop();
    editor.ready(function () {
        editor.focus();
        editor.setContent("<p><b>xxx</b>xxx</p>");
        var p = editor.document.getElementsByTagName('p')[0];
        var r = new UE.dom.Range(editor.document,editor.body);
        r.setStart(p.firstChild, 0).setEnd(p.firstChild, 1).select();
        equal(editor.queryCommandState('bold'), 1, '加粗状态为1');
        r.setStart(p, 1).setEnd(p, 2).select();
        equal(editor.queryCommandState('bold'), 0, '加粗状态为0');
        UE.clearCache(div.id);
        te.dom.push(editor.container);
        document.getElementById('ue_queryCommandState') && te.dom.push(document.getElementById('ue_queryCommandState'));
        start();
    });
});
test("queryCommandValue", function () {
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue_queryCommandValue';
    var editor = UE.getEditor('ue_queryCommandValue');
    stop();
    editor.ready(function () {
        editor.focus();
        var html = ua.browser.ie?'<p align="left">xxx</p>':'<p style="text-align:left">xxx</p>';
        editor.setContent(html);
        var range = new UE.dom.Range(editor.document,editor.body);
        var p = editor.document.getElementsByTagName("p")[0];
        range.selectNode(p).select();
        equal(editor.queryCommandValue('justifyleft'), 'left', 'text align is left');
        UE.clearCache(div.id);
        te.dom.push(editor.container);
        document.getElementById('ue_queryCommandValue') && te.dom.push(document.getElementById('ue_queryCommandValue'));
        start();
    });
});
test("execCommand", function () {
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UE.getEditor('ue');
    stop();
    editor.ready(function () {
        editor.focus();
        editor.setContent("<p>xx</p><p>xxx</p>");
        var doc = editor.document;
        var range = new UE.dom.Range(doc,editor.body);
        var p = doc.getElementsByTagName('p')[1];
        range.setStart(p, 0).setEnd(p, 1).select();
        editor.execCommand('justifyright');
        equal($(p).css('text-align'), 'right', 'execCommand align');
        range.selectNode(p).select();
        editor.execCommand("forecolor", "red");
        var font = doc.getElementsByTagName('font')[0];
        equal(ua.formatColor(font.color), "#ff0000", 'check execCommand color');
        var html = '<p>xx</p><p style=\"text-align: right;\"><font color=\"#ff0000\">xxx</font></p>';
        var html_1 = "<p>xx</p><p align=\"right\"><font color=\"red\">xxx</font></p>";
        ua.checkSameHtml(editor.body.innerHTML,ua.browser.ie?html_1:html, 'check style')
        UE.clearCache(div.id);
        te.dom.push(editor.container);
        document.getElementById('ue') && te.dom.push(document.getElementById('ue'));
        start();
    });
});

test("hasContents", function () {
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UE.getEditor('ue');
    stop();
    editor.ready(function () {
        editor.focus();
        editor.setContent('');
        ok(!editor.hasContents(), "have't content");
        editor.setContent("xxx");
        ok(editor.hasContents(), "has contents");
        editor.setContent('<p><br/></p>');
        ok(!editor.hasContents(), '空p认为是空');
        UE.clearCache(div.id);
        te.dom.push(editor.container);
        document.getElementById('ue') && te.dom.push(document.getElementById('ue'));
        start();
    });
});


/*参数是对原有认为是空的标签的一个扩展，即原来的dtd认为br为空，加上这个参数可以认为br存在时body也不是空*/
test("hasContents--有参数", function () {
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UE.getEditor('ue');
    stop();
    editor.ready(function () {
        editor.focus();
        editor.setContent('<p><img src="" alt="">你好<ol><li>ddd</li></ol></p>');
        ok(editor.hasContents(['ol', 'li', 'table']), "有ol和li");
        ok(editor.hasContents(['td', 'li', 'table']), "有li");
        editor.setContent('<p><br></p>');
        ok(!editor.hasContents(['']), "为空");
        ok(editor.hasContents(['br']), "不为空");
        UE.clearCache(div.id);
        te.dom.push(editor.container);
        document.getElementById('ue') && te.dom.push(document.getElementById('ue'));
        start();
    });
});

test('trace 1964 getPlainTxt--得到有格式的编辑器的纯文本内容', function () {
    if (ua.browser.ie > 0 && ua.browser.ie < 9)return;//TODO 1.2.6

    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UE.getEditor('ue');
    stop();
    editor.ready(function () {
        editor.focus();
        editor.setContent('<p>&nbsp;</p><p>&nbsp; hell\no<br/>hello</p>');
        equal(editor.getPlainTxt(), "\n  hello\nhello\n", '得到编辑器的纯文本内容，但会保留段落格式');
        te.dom.push(editor.container);
        document.getElementById('ue') && te.dom.push(document.getElementById('ue'));
        start();
    });
});

test('getContentTxt--文本前后的空格,&nbs p转成空格', function () {
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UE.getEditor('ue');
    stop();
    editor.ready(function () {
        editor.focus();
        editor.setContent('&nbsp;&nbsp;你 好&nbsp;&nbsp; ');
        equal(editor.getContentTxt(), '  你 好   ');
        equal(editor.getContentTxt().length, 8, '8个字符，空格不被过滤');
        te.dom.push(editor.container);
        document.getElementById('ue') && te.dom.push(document.getElementById('ue'));
        start();
    });
});
test('getAllHtml', function () {

    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue_getAllHtml';
    var editor = UE.getEditor('ue_getAllHtml');
    stop();
    editor.ready(function () {
        editor.focus();
        var html = editor.getAllHtml();
        ok(/ueditor.css/.test(html), '引入样式');
        te.dom.push(editor.container);
        document.getElementById('ue_getAllHtml') && te.dom.push(document.getElementById('ue_getAllHtml'));
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
    /*动态加载js需要时间，用这个ueditor.config.js覆盖默认的配置文件*/
    setTimeout(function () {
        var div1 = document.body.appendChild(document.createElement('div'));
        div1.id = 'div1';
        div1.style.height = '200px';
        var div2 = document.body.appendChild(document.createElement('div'));
        div2.id = 'div2';
        var editor1 = UE.getEditor('div1',{'UEDITOR_HOME_URL':'../../../', 'initialContent':'欢迎使用ueditor', 'autoFloatEnabled':false});
        editor1.ready(function(){
            var editor2 = UE.getEditor('div2',UEDITOR_CONFIG2);
            editor2.ready(function () {
                equal(editor1.body.style.minHeight, '200px', '编辑器高度为200px');
                equal(editor2.body.style.minHeight, '400px', '自定义div高度为400px');
                var html = UEDITOR_CONFIG2.initialContent;
                ua.checkHTMLSameStyle(html, editor2.document, editor2.body.firstChild, '初始内容为自定制的');
                equal(editor2.options.enterTag, 'br', 'enterTag is br');
                html = '欢迎使用ueditor';
                equal(html, editor1.body.firstChild.innerHTML, '内容和ueditor.config一致');
                equal(editor1.options.enterTag, 'p', 'enterTag is p');
                te.dom.push(editor1.container);
                te.dom.push(editor2.container);
                document.getElementById('div1') && te.dom.push(document.getElementById('div1'));
                document.getElementById('div2') && te.dom.push(document.getElementById('div2'));
                start();
            });
        });
    }, 100);
});
test("_initEvents,_proxyDomEvent--click", function () {
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue_initEvents';
    var editor = UE.getEditor('ue_initEvents');
    stop();
    editor.ready(function () {
        editor.focus();
        expect(1);
        stop();
        editor.addListener('click', function () {
            ok(true, 'click event dispatched');
            te.dom.push(editor.container);
            document.getElementById('ue_initEvents') && te.dom.push(document.getElementById('ue_initEvents'));
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
    document.onmouseover = function (event) {
        ok(true, "mouseover is fired");
    };
    document.onkeydown = function (event) {
        ok(true, "keydown is fired");
    };
    document.onkeyup = function (event) {
        ok(true, "keyup is fired");
    };
    var editor = new UE.Editor({'autoFloatEnabled':false});
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'event';
    editor.render('event');
    expect(5);
    editor.ready(function () {
        setTimeout(function () {
            editor.focus();
            ua.mousedown(document.body);
            ua.mouseup(document.body);
            ua.mouseover(document.body);
            ua.keydown(document.body, {'keyCode':13});
            ua.keyup(document.body, {'keyCode':13});
            setTimeout(function () {
                document.getElementById('event') && te.dom.push(document.getElementById('event'));
                start();
            }, 1000);
        }, 50);
    });
    stop();
});

