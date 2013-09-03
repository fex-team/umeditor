module('plugins.source');

test('插入表格，切源码再切回来',function(){
    var editor = te.obj[0];
    var div = te.dom[0];
    // editor.render(div);
    editor.setContent('<table><tbody><tr><td>hello1</td><td></td></tr><tr><td>hello2</td><td></td></tr></tbody></table>');
    //source 包含超时操作，ie下必须有同步操作，否则会报错
    setTimeout(function () {
        editor.execCommand('source');
        setTimeout(function () {
            editor.execCommand('source');
            var content = editor.getContent();
            equal(content, '<table><tbody><tr><td>hello1</td><td></td></tr><tr><td>hello2</td><td></td></tr></tbody></table>');
            start();
        }, 20);
    }, 20);

    stop();
});

test('chrome删除后切换源码再切换回来，光标没了', function () {
    //opera 取不到range值
    if (ua.browser.opera) return 0;
    var editor = te.obj[0];
    var div = te.dom[0];
    editor.render(div);
    editor.setContent('hello');
    var range = editor.selection.getRange();
    range.selectNode(editor.body.firstChild).select();
    editor.execCommand('cleardoc');
    stop();
    expect(2);
    //source 包含超时操作，ie下必须有同步操作，否则会报错
    setTimeout(function () {
        editor.execCommand('source');
        setTimeout(function () {
            editor.execCommand('source');
            start();
        }, 20);
    }, 20);
    range = editor.selection.getRange();
    equal(range.startContainer.nodeType, 1, '光标定位在p里');
    equal(range.startContainer.tagName.toLowerCase(), 'p', 'startContainer为p');
    te.dom.push(div);
});

test('切换源码，源码中多处空行', function () {
    var editor = te.obj[0];
    editor.setContent('<p>hello<a href="http://www.baidu.com/">baidu</a></p>');
    stop();
    setTimeout(function () {
        editor.execCommand('source');
        setTimeout(function () {
            editor.execCommand('source');
            setTimeout(function () {
                var html = editor.getContent();
                equal(html, '<p>hello<a href="http://www.baidu.com/">baidu</a></p>');
                start();
            }, 100);
        }, 100);
    }, 100);

    //    var html = '<p>\nhello<a href="http://www.baidu.com/">\n\tbaidu\n</a>\n</p>';
    //无奈的验证，有不可见字符
    //多余不可见字符的的bug已经修改了，现在用例字符串长度：53

    // ok(html.length>=58&&html.length<=60,'切换源码不会多空行');
});
test('设置源码内容没有p标签，切换源码后会自动添加', function () {
    var editor = te.obj[0];
    editor.setContent('<strong><em>helloworld你好啊</em></strong>大家好，<strong><i>你在干嘛呢</i></strong><em><strong>。谢谢，不用谢</strong></em>~~%199<p>hello</p>');
    setTimeout(function () {
        editor.execCommand('source');
        setTimeout(function () {
            editor.execCommand('source');
            setTimeout(function () {
                editor.execCommand('source');
                setTimeout(function () {
                    var childs = editor.body.childNodes;
                    ok(childs.length, 3, '3个p');
                    for (var index = 0; index < 3; index++) {
                        equal(childs[0].tagName.toLowerCase(), 'p', '第' + index + '个孩子为p');
                    }
                    start();
                }, 100);
            }, 100);
        }, 100);
    }, 100);
    stop();
});

test('切换源码不会去掉空的span', function () {
    var editor = te.obj[0];
    editor.setContent('<p>切换源码<span>去掉空的span</span></p>');
    setTimeout(function () {
        editor.execCommand('source');
        setTimeout(function () {
            editor.execCommand('source');
            start();
        }, 100);
    }, 100);
    stop();
    equal(editor.getContent(), '<p>切换源码<span>去掉空的span</span></p>');
});

test('b,i标签，切换源码后自动转换成strong和em', function () {
    var editor = te.obj[0];
    editor.setContent('<p><b>加粗的内容</b><i>斜体的内容<b>加粗且斜体</b></i></p>');
    setTimeout(function () {
        editor.execCommand('source');
        setTimeout(function () {
            editor.execCommand('source');
            start();
        }, 100);
    }, 100);
    stop();
    equal(editor.getContent(), '<p><strong>加粗的内容</strong><em>斜体的内容<strong>加粗且斜体</strong></em></p>');
});

test(' range的更新/特殊符号的转换', function () {
    var editor = te.obj[0];
    editor.setContent('<p>"<></p>');
    setTimeout(function () {
        editor.execCommand('source');
        setTimeout(function () {
            editor.execCommand('source');
            equal(editor.getContent(), '<p>&quot;&lt;&gt;</p>');
            editor.setContent("<p>'<img src='http://nsclick.baidu.com/u.gif?&asdf=\"sdf&asdfasdfs;asdf'></p>");
//            var range = te.obj[1];
//            range.setStart(editor.body.firstChild,0).collapse(1).select();
            setTimeout(function () {
//                var label = ua.browser.gecko ? 'html' : 'body';
                var label = 'html';
                ua.manualDeleteFillData(editor.body);
                if (ua.browser.ie && ua.browser.ie > 8)//todo ie9,10改range
                    equal(editor.selection.getRange().startContainer.parentNode.tagName.toLowerCase(), label, 'range的更新');
                else
                    equal(editor.selection.getRange().startContainer.parentNode.parentNode.parentNode.tagName.toLowerCase(), label, 'range的更新');
                editor.execCommand('source');
                setTimeout(function () {
                    editor.execCommand('source');
                    equal(editor.getContent(), "<p>&#39;<img src=\"http://nsclick.baidu.com/u.gif?&amp;asdf=&quot;sdf&amp;asdfasdfs;asdf\"/></p>");
                    start();
                }, 100);
            }, 100);
        }, 100);
    }, 100);
    stop();
});

test('默认插入的占位符', function () {
    var editor = te.obj[0];
    editor.setContent('');
    equal(editor.getContent(), '');
});

test('不以http://开头的超链接绝对路径网址', function () {
    if (ua.browser.ie == 9)return 0;//TODO 1.2.6
    var editor = te.obj[0];
    editor.setContent('<p><a href="www.baidu.com">绝对路径网址</a></p>');
    setTimeout(function () {
        editor.execCommand('source');
        setTimeout(function () {
            editor.execCommand('source');
            equal(editor.getContent(), '<p><a href="www.baidu.com">绝对路径网址</a></p>');
            start();
        }, 100);
    }, 100);
    stop();
});

test('插入超链接后再插入空格，空格不能被删除', function () {
    var editor = te.obj[0];
    editor.setContent('<p> <a href="http://www.baidu.com/">绝对路径网址</a>  ddd</p>');
    setTimeout(function () {
        editor.execCommand('source');
        setTimeout(function () {
            editor.execCommand('source');
            var html =  '<p><a href=\"http://www.baidu.com/\" _href=\"http://www.baidu.com/\">绝对路径网址</a> &nbsp;ddd​</p>';
            equal(editor.body.innerHTML.toLowerCase(), html, '查看空格是否被删除');
            //equal(editor.body.firstChild.innerHTML.toLowerCase(),'<a href="http://www.baidu.com/">绝对路径网址</a> &nbsp;ddd','空格仍然存在');
            equal(editor.body.innerHTML.toLowerCase().length, html.length, '查看空格是否被删除');
            start();
        }, 100);
    }, 100);
    stop();
});

//自动转换标签
test('在font,b,i标签中输入，会自动转换标签 ', function () {
//    if(!ua.browser.gecko){
    var editor = te.obj[0];
    editor.body.innerHTML = '<p><font size="3" color="red"><b><i>x</i></b></font></p>';
    setTimeout(function () {
        editor.execCommand('source');
        setTimeout(function () {
            editor.execCommand('source');
            equal(editor.body.firstChild.firstChild.tagName.toLowerCase(), 'span', 'font转换成span');
            if (ua.browser.gecko || ua.browser.ie)
                equal($(editor.body.firstChild.firstChild).css('font-size'), '16px', '检查style');
            else
                equal($(editor.body.firstChild.firstChild).css('font-size'), '16px', '检查style');
            var EMstyle = $(editor.body.firstChild.firstChild).css('color');  //dollar符号的使用
            ok(EMstyle == 'rgb(255, 0, 0)' || EMstyle == 'red' || EMstyle == '#ff0000', '检查style');
            equal(ua.getChildHTML(editor.body.firstChild.firstChild), '<strong><em>x</em></strong>', 'b转成strong,i转成em ');
            start();
        }, 20);
    }, 20);
    stop();
//    }
});
test('img和a之间不会产生多余空格', function () {
    var editor = te.obj[0];
    editor.setContent('<p><img src="http://img.baidu.com/hi/jx2/j_0001.gif" /><a href="http://www.baidu.com">http://www.baidu.com</a></p>');
    debugger
    setTimeout(function () {
        editor.execCommand('source');
        setTimeout(function () {
            editor.execCommand('source');
            setTimeout(function () {
                editor.execCommand('source');
                ua.manualDeleteFillData(editor.body);
//                var html = '<p><img src="http://img.baidu.com/hi/jx2/j_0001.gif" _src=\"http://img.baidu.com/hi/jx2/j_0001.gif\"><a href=\"http://www.baidu.com\" _href=\"http://www.baidu.com\">http://www.baidu.com</a></p>';
//                ua.checkSameHtml(editor.body.innerHTML.toLowerCase(), html, '查看img和a之间是否会产生多余空格');
                ua.checkSameHtml(editor.body.firstChild.innerHTML.toLowerCase(),'<img src="http://img.baidu.com/hi/jx2/j_0001.gif"/><a href=\"http://www.baidu.com\" _href=\"http://www.baidu.com\">http://www.baidu.com</a>','img和a之间不会产生多余空格');
                start();
            }, 20);
        }, 20);
    }, 20);
    stop();
});

test('带颜色的span切到源码再切回，不会丢失span', function () {
    var editor = te.obj[0];
    editor.setContent('<p><span style="color: rgb(255, 0, 0);"></span><br></p>');
    setTimeout(function () {
        editor.execCommand('source');
        setTimeout(function () {
            editor.execCommand('source');
            ua.checkSameHtml(editor.body.innerHTML, '<p><span style="color: rgb(255, 0, 0);"></span><br></p>','span不丢失');
            start();
        }, 20);
    }, 20);
    stop();
});