module("plugins.font");
test('设置超链接前景色再清除颜色', function () {
    var editor = te.obj[2];
    var div = document.body.appendChild(document.createElement('div'));
    $(div).css('width', '500px').css('height', '500px').css('border', '1px solid #ccc');
    editor.render(div);
    stop();
    editor.ready(function () {
        var range = new UE.dom.Range(editor.document);
        editor.setContent('<p>hello<a href="www.baidu.com">baidu</a></p>');
        range.selectNode(editor.body.firstChild).select();
        editor.execCommand('forecolor', 'rgb(255,0,0)');
        editor.execCommand('backcolor', 'rgb(0,255,0)');
        editor.execCommand('forecolor', 'rgb(0,0,0)');
        //        var html = '<span style="background-color: rgb(0, 255, 0);">hello</span><a href="www.baidu.com" _href=\"www.baidu.com\" style="text-decoration: underline;"><span style="background-color: rgb(0, 255, 0);">baidu</span></a>';todo 1.2.6.1 样式复制了一次
        //var html = '<span style="background-color: rgb(0, 255, 0);">hello</span><a href="www.baidu.com" _href=\"www.baidu.com\" style="background-color: rgb(0, 255, 0);text-decoration: underline;"><span style="background-color: rgb(0, 255, 0);">baidu</span></a>';
        var html = '<font style=\"background-color: rgb(0, 255, 0);\">hello<a href=\"www.baidu.com\">baidu</a></font>';
        ua.checkHTMLSameStyle(html, editor.document, editor.body.firstChild, '清除前景色');
        equal(editor.body.firstChild.innerHTML.toLowerCase(),html,'前景色为黑');
        setTimeout(function () {
            div.parentNode.removeChild(div);
            start();
        }, 50);
    });
});


test('font转span', function () {
    var editor = te.obj[0];
    editor.setContent('<font size="12" color="red" lang="en" face="arial"><b><i>hello</i>hello</b>');
    //var html = '<span style="font-size:12px;color:red;font-family:arial"><strong><em>hello</em>hello</strong></span>';
    var html = '<font size="12" color="red" lang="en" face="arial"><b><i>hello</i>hello</b>';
    ua.checkHTMLSameStyle(html, editor.document, editor.body.firstChild, '不转换font标签');
    editor.setContent('<b><font size="10" color="#ff0000" lang="en" face="楷体">hello');
    //html = '<strong><span style="font-size:10px;color:#ff0000;font-family:楷体">hello</span></strong>';
    html = '<b><font size="10" color="#ff0000" lang="en" face="楷体">hello';
    ua.checkHTMLSameStyle(html, editor.document, editor.body.firstChild, '不转换font标签');
});

/*为超链接添加删除线，超链接仍然有删除线，trace946*/
test('underline and linethrough', function () {
    var editor = te.obj[2];
    var div = document.body.appendChild(document.createElement('div'));
    $(div).css('width', '500px').css('height', '500px').css('border', '1px solid #ccc');
    editor.render(div);
    stop();
    editor.ready(function () {
        var range = new UE.dom.Range(editor.document);
        editor.setContent('hello<a href="http://www.baidu.com/">baidu</a>test');
        setTimeout(function () {
            if (!ua.browser.opera) {
                editor.focus();
            }
            var body = editor.body;
            ua.manualDeleteFillData(editor.body);
            range.selectNode(body.firstChild.firstChild.nextSibling).select();
            //equal(editor.queryCommandValue('underline'), 'underline', 'query command value is underline');
            //equal(editor.queryCommandValue('strikethrough'), 'underline', 'query command value is not strike');
            ok(editor.queryCommandState('underline'), 'query underline state');
            editor.execCommand('strikethrough');
            //var html = 'hello<a href="http://www.baidu.com/" _href=\"http://www.baidu.com/\" style="text-decoration: line-through" >baidu</a>test';
            //ua.checkHTMLSameStyle(html, editor.document, body.firstChild, 'check results');
            if(ua.browser.chrome||ua.browser.ie)
            {
                var html = 'hello<a href=\"http://www.baidu.com/\"><strike>baidu</strike></a>test';
                equal(editor.body.firstChild.innerHTML.toLowerCase(),html,'超链接也可以添加下划线');
                ua.checkHTMLSameStyle(html, editor.document, body.firstChild, 'check results');
            }
            else
            {
                var html = 'hello<strike><a href=\"http://www.baidu.com/\">baidu</a></strike>test';
                equal(editor.body.firstChild.innerHTML.toLowerCase(),html,'超链接也可以添加下划线');
                ua.checkHTMLSameStyle(html, editor.document, body.firstChild, 'check results');
            }
            setTimeout(function () {
                div.parentNode.removeChild(div);
                start();
            }, 50);
        }, 50);
    });
});



/*trace 918*/
test('trace 918：字体的状态反射', function () {
    var editor = te.obj[2];
    var div = document.body.appendChild(document.createElement('div'));
    $(div).css('width', '500px').css('height', '500px').css('border', '1px solid #ccc');
    editor.render(div);
    stop();
    editor.ready(function () {
        var range = new UE.dom.Range(editor.document);
        editor.setContent('<p>欢迎你回来</p>');
        var p = editor.body.firstChild;
        range.selectNode(p).select();
        editor.execCommand('underline');
        var p1 = document.createElement('p');
        //p1.innerHTML = '<span style="text-decoration: underline;">欢迎你回来</span>';
        p1.innerHTML = '<u >欢迎你回来</u>';
        var html = '<p><span style="text-decoration:underline;">欢迎你回来</span></p>';
        if (!ua.browser.opera) {
            ok(ua.haveSameAllChildAttribs(p, p1), '检查是否添加了下划线');
            equal(editor.getContent('p'),html,'检查是否添加了下划线');
        }
        range.setStart(p.firstChild.firstChild, 3).setEnd(p.firstChild.firstChild, 4).select();
        editor.execCommand('fontfamily', '楷体');
        //var txt = '楷体';
//        if (ua.browser.opera)
//            txt = '\"楷体\"';
        if (ua.browser.chrome || ua.browser.ie)
            var txt = '楷体';
        else
        if(ua.browser.opera)
            txt = '\"楷体\"';
        else
            txt = 'sans-serif';
        equal(editor.queryCommandValue('fontfamily'), txt, '检查字体的状态反射');
        setTimeout(function () {
            div.parentNode.removeChild(div);
            start();
        }, 50);
    });
});

//


test('选中文本设置前景色',function(){
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p>我是mini</p>');
    range.selectNode(editor.body.firstChild).select();
    editor.execCommand('forecolor','rgb(255,0,0)');
    if(ua.browser.chrome)
    {
        var html = '<p><font color="#ff0000">我是mini</font></p>';
        ua.checkSameHtml(html,editor.body.firstChild.outerHTML,'设置文本前景色为红色');
    }
    else
    {
        var html ='<p><font color=rgb(255,0,0)>我是mini</font></p>';
        ua.checkHTMLSameStyle(html,editor.document,editor.body, '设置文本前景色为红色');
    }

});


/*trace 809*/
test('trace 809：闭合时改变前景色和删除线，再输入文本', function () {
    if (!ua.browser.opera) {
        var editor = te.obj[2];
        var div = document.body.appendChild(document.createElement('div'));
        $(div).css('width', '500px').css('height', '500px').css('border', '1px solid #ccc');
        editor.render(div);
        stop();
        editor.ready(function () {
            var range = new UE.dom.Range(editor.document);
            editor.setContent('<p><span style="color: rgb(255, 0, 0); text-decoration: line-through; ">你好</span></p>');
            var p = editor.body.firstChild;
            range.setStart(p.firstChild, 1).collapse(true).select();
            editor.execCommand('forecolor', 'rgb(0,255,0)');
            range = editor.selection.getRange();
            editor.execCommand('underline');
            range = editor.selection.getRange();
            range.insertNode(editor.document.createTextNode('hey'));
            var p1 = editor.document.createElement('p');
            p1.innerHTML = '<span style="color: rgb(255, 0, 0); text-decoration: line-through; ">你好</span><span style="color: rgb(255, 0, 0); "><span style="color: rgb(0, 255, 0); text-decoration: underline; ">​hey</span></span>';
            ua.manualDeleteFillData(editor.body);
            /*ff下会自动加一个空的设置了style的span，比较时不作考虑*/
            if (UE.dom.domUtils.isEmptyNode(editor.body.firstChild.lastChild) && UE.browser.gecko)
                editor.body.firstChild.removeChild(editor.body.firstChild.lastChild);
            //ok(ua.haveSameAllChildAttribs(editor.body.firstChild, p1), '检查新输入的文本下划线和颜色是否正确');
            ua.checkSameHtml( p1.innerHTML,editor.body.firstChild.innerHTML, '检查新输入的文本下划线和颜色是否正确');
            equal(editor.body.firstChild.innerHTML,p1.innerHTML,'try');
            setTimeout(function () {
                div.parentNode.removeChild(div);
                start();
            }, 50);
        });
    }
});

/*trace 805*/
//test('trace 805：切换删除线和下划线，前景色没了', function () {
//    var editor = te.obj[2];
//    var div = document.body.appendChild(document.createElement('div'));
//    $(div).css('width', '500px').css('height', '500px').css('border', '1px solid #ccc');
//    editor.render(div);
//    stop();
//    editor.ready(function () {
//        var range = new UE.dom.Range(editor.document);
//        editor.setContent('<p><strong>你好早安</strong></p>');
//        var text = editor.body.firstChild.firstChild.firstChild;
//        range.selectNode(text).select();
//        editor.execCommand('forecolor', 'rgb(255,0,0)');
//        range.setStart(text, 0).setEnd(text, 2).select();
//        editor.execCommand('underline');
//        range.setStart(text, 0).setEnd(text, 2).select();
//        editor.execCommand('strikethrough');
//        var p1 = editor.document.createElement('p');
//        p1.innerHTML = '<span style="color: rgb(255, 0, 0); text-decoration: line-through;"><strong>你好</strong></span><span style="color: rgb(255, 0, 0);"><strong>早安</strong></span>';
//        ok(ua.haveSameAllChildAttribs(editor.body.firstChild, p1), '查看前景色是不是还在');
//        setTimeout(function () {
//            div.parentNode.removeChild(div);
//            start();
//        }, 50);
//    });
//});


//trace 805
test('trace 805:对字体设置前景色，然后进行下划线和删除线操作，前景色不消失',function(){
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p><strong>你好北京</strong></p>');
    var text = editor.body.firstChild.firstChild.firstChild;
    //range.selectNode(text).select();
    range.setStart(text,0).setEnd(text,4).select();
    editor.execCommand('forecolor','rgb(255,0,0)');
    range.setStart(text,0).setEnd(text,2).select();//选中的是‘你好’
    editor.execCommand('underline');
    range.setStart(text,0).setEnd(text,2).select();//选中的是‘北京’
    editor.execCommand('strikethrough');
    var p1 = editor.document.createElement('p');
    p1.innerHTML = '<strong><font color="#ff0000"><u>你好</u><strike>北京</strike></font></strong>';
    var html = '<p><strong><span style="color:#ff0000"><span style="text-decoration:underline;">你好</span><span style="text-decoration:line-through;">北京</span></span></strong></p>';
    equal(ua.getChildHTML(editor.body).toLowerCase(),p1.outerHTML,'前景色不消失');
    equal(editor.getContent(editor.body),html,'try');
});

/*trace 802*/
test('trace 802：为设置了字体的文本添加删除线', function () {
    var editor = te.obj[2];
    var div = document.body.appendChild(document.createElement('div'));
    $(div).css('width', '500px').css('height', '500px').css('border', '1px solid #ccc');
    editor.render(div);
    stop();
    editor.ready(function () {
        var range = new UE.dom.Range(editor.document);
        editor.setContent('<p><strong>你好早安</strong></p>');
        var text = editor.body.firstChild.firstChild.firstChild;
        range.setStart(text, 0).setEnd(text, 2).select();
        editor.execCommand('strikethrough');
        var p1 = editor.document.createElement('p');
//        p1.innerHTML = '<span style="text-decoration: line-through;"><strong>你好</strong></span><strong>早安</strong>';
//        ok(ua.haveSameAllChildAttribs(editor.body.firstChild, p1), '检查删除线是否正确');
        p1.innerHTML = '<strong><strike>你好</strike>早安</strong>';
        equal(editor.body.firstChild.innerHTML,p1.innerHTML,'删除线存在');
        editor.execCommand('fontfamily', '隶书');
        var txt = '隶书';
        if (ua.browser.opera)
            txt = '\"隶书\"';
        equal(editor.queryCommandValue('fontfamily'), txt);
        setTimeout(function () {
            div.parentNode.removeChild(div);
            start();
        }, 50);
    });
});

/*trace 744*/
test('trace 744：设置超链接背景色后切换到源码再切回来', function () {
    var editor = te.obj[2];
    var div = document.body.appendChild(document.createElement('div'));
    $(div).css('width', '500px').css('height', '500px').css('border', '1px solid #ccc');
    editor.render(div);
    stop();
    editor.ready(function () {
        var range = new UE.dom.Range(editor.document);
        editor.setContent('<p>hello<a href="www.baidu.com">baidu</a></p>');
        range.selectNode(editor.body.firstChild).select();
        editor.execCommand('backcolor', 'rgb(255,0,0)');
        var html = editor.body.firstChild.innerHTML;
        editor.execCommand('source');
        setTimeout(function () {
            editor.execCommand('source');
            setTimeout(function () {
                ua.checkHTMLSameStyle(html, editor.document, editor.body.firstChild, '切换后html代码不变');
                //equal();
                /*切换源码前后代码应当相同*/
                div.parentNode.removeChild(div);
                start();
            }, 50);
        }, 50);
    });
});


/*trace 740*/
//test('trace 740：设置左右字为红色，修改部分字颜色为蓝色，再修改所有字体', function () {//在ff下 有东西没删干净
//    var editor = te.obj[2];
//    var div = document.body.appendChild(document.createElement('div'));
//    $(div).css('width', '500px').css('height', '500px').css('border', '1px solid #ccc');
//    editor.render(div);
//    stop();
//    editor.ready(function () {
//        var range = new UE.dom.Range(editor.document);
//        editor.setContent('<p>你好早安</p>');
//        range.selectNode(editor.body.firstChild).select();
//        editor.execCommand('forecolor', 'rgb(255,0,0)');
//        var text = editor.body.firstChild.firstChild.firstChild;
//        range.setStart(text, 2).setEnd(text, 4).select();
//        editor.execCommand('forecolor', 'rgb(0,255,0)');
//        range.setStart(editor.body.firstChild, 0).setEnd(editor.body.firstChild, 1).select();
//        editor.execCommand('fontfamily', ' 楷体, 楷体_GB2312, SimKai');
//        //editor.execCommand('fontfamily','楷体');
//        setTimeout(function () {
//            //todo 1.2.6.1 去掉多余的复制样式
//            var html = '<span style="color: rgb(255, 0, 0); font-family: 楷体, 楷体_GB2312, SimKai">你好<span style="color: rgb(0, 255, 0);">早安</span></span>';
//            ua.checkSameHtml(html,editor.body.firstChild.innerHTML, '查看字体和颜色是否正确');
//            div.parentNode.removeChild(div);
//            start();
//        }, 50);
//    });
//});

test('trace 740：设置左右字为红色，修改部分字颜色为蓝色，再修改所有字体----', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p>你好早安</p>');
    range.selectNode(editor.body.firstChild).select();
    editor.execCommand('forecolor', 'rgb(255,0,0)');
    var text = editor.body.firstChild.firstChild.firstChild;
    range.setStart(text, 2).setEnd(text, 4).select();
    editor.execCommand('forecolor', 'rgb(0,255,0)');
    range.setStart(editor.body.firstChild, 0).setEnd(editor.body.firstChild, 1).select();
    editor.execCommand('fontfamily', ' 楷体, 楷体_GB2312, SimKai ');
    stop();
    setTimeout(function () {
        //todo 1.2.6.1 去掉多余的复制样式
        //var html = '<span style="...">你好<span style="...">早安</span></span>';
        if(ua.browser.chrome)
        {

            var html = '<font color="#ff0000" face="楷体, 楷体_GB2312, SimKai">你好</font><font color="#00ff00">早安</font>';
            ua.checkSameHtml(html,editor.body.firstChild.innerHTML, '查看字体和颜色是否正确');
        }
        else
        {
            //var html1 = '<p><span style="color:#ff0000;font-family:楷体, 楷体_GB2312, SimKai">你好</span><span style="color:#00ff00">早安</span></p>';
            var html1 = '<p><span style=\"color:rgb(255,0,0);font-family: 楷体, 楷体_GB2312, SimKai \">你好</span><span style=\"color:rgb(0,255,0)\">早安</span></p>';
            equal(editor.getContent(editor.body),html1,'查看字体和颜色是否正确');
        }

        start();
    }, 50);
});


/*trace 721*/
test('trace 721：预先设置下划线和字体颜色，再输入文本，查看下划线颜色', function () {
    if (!ua.browser.opera) {
        var editor = te.obj[2];
        var div = document.body.appendChild(document.createElement('div'));
        $(div).css('width', '500px').css('height', '500px').css('border', '1px solid #ccc');
        editor.render(div);
        stop();
        editor.ready(function () {
            var range = new UE.dom.Range(editor.document);
            editor.setContent('<p><br></p>');
            range.setStart(editor.body.firstChild, 0).collapse(true).select();
            editor.execCommand('underline');
            editor.execCommand('forecolor', 'rgb(255,0,0)');
            range = editor.selection.getRange();
            range.insertNode(editor.document.createTextNode('hello'));
            ua.manualDeleteFillData(editor.body);
            var html = '<span style="text-decoration:underline;color:rgb(255,0,0)">hello</span><br>';
            ua.checkHTMLSameStyle(html, editor.document, editor.body.firstChild, '查看下划线颜色是否与字体颜色一致');
            setTimeout(function () {
                div.parentNode.removeChild(div);
                start();
            }, 50);
        });
    }
});

//test('转换font标签', function () {
//    var editor = te.obj[0];
//    editor.setContent('<font size="16" color="red"><b><i>x</i></b></font>');
//    var html = '<p><span style="font-size:16px;color:red" ><strong><em>x</em></strong></span></p>';
//    ua.checkHTMLSameStyle(html, editor.document, editor.body, '转换font标签');
//    editor.setContent('<font style="color:red"><u>x</u></font>');
//    html = '<span style="color:red"><span style="text-decoration:underline;">x</span></span>';
//    ua.checkHTMLSameStyle(html, editor.document, editor.body.firstChild, '转换font标签');
//});

test('font标签不发生转换', function () {
    var editor = te.obj[0];
    editor.setContent('<font size="16" color="red"><b><i>x</i></b></font>');
//    if(ua.browser.chrome){
//        var html = '<font size="16" color="red"><b><i>x</i></b></font>';
//        equal(editor.body.firstChild.innerHTML.toLowerCase(),html,'font不转换标签');
//    }
//    else{
//        var html = '<font color=red size=16><b><i>x</i></b></font>';
//        equal(editor.body.firstChild.innerHTML.toLowerCase(),html,'font不转换标签');
//    }
    var html1 = '<p><span style="font-size:16px;color:red" ><strong><em>x</em></strong></span></p>';
    ua.checkSameHtml(editor.getContent(editor.body),html1,'确认一下确实是正确的');
    editor.setContent('<font style="color:red"><u>x</u></font>');
    html = '<font style="color:red"><u>x</u></font>';
    //equal(editor.body.firstChild.innerHTML.toLowerCase(),html,'font不转换标签');//ff和chrome下都是正确的，ie下报错，但是错误的提示中，可以看到期待的和实际得到的也是一样的  不知道为何报错
    ua.checkSameHtml(editor.body.firstChild.innerHTML.toLowerCase(),html,'font不转换标签');
});


/*为不同字号的文本加背景色，trace981*/
test('background--不同字号', function () {
    if (!ua.browser.opera) {
        var editor = te.obj[2];
        var div = document.body.appendChild(document.createElement('div'));
        $(div).css('width', '500px').css('height', '500px').css('border', '1px solid #ccc');
        te.obj[2].render(div);
        stop();
        editor.ready(function () {
            var range = new UE.dom.Range(te.obj[2].document);
            te.obj[2].setContent('你好');
            editor.focus();
            //var body = editor.document.body;
            var body = editor.body;
            ua.manualDeleteFillData(editor.body);
            range.selectNode(body.firstChild.firstChild).select();
            editor.execCommand('backcolor', 'rgb(255,0,0)');
            range.setStart(body.firstChild.firstChild, 1).collapse(1).select();
            editor.execCommand('fontsize', '30px');
            range = editor.selection.getRange();
            range.insertNode(editor.document.createTextNode('hello'));
            setTimeout(function () {
                ua.manualDeleteFillData(editor.body);
                //去掉空白字符
                var color = ua.browser.ie && ua.browser.ie < 9 ? '' : ';background-color: rgb(255, 0, 0); ';
                var html = '<span style="background-color: rgb(255, 0, 0)">你好<span style="font-size: 30px ' + color + '">hello</span></span>';
                ua.checkHTMLSameStyle(html, editor.document, editor.body.firstChild, '检查不同字号的文本背景色是否一致');
                div.parentNode.removeChild(div);
                start();
            }, 50);
        });
    }
});

