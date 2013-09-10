module("plugins.list");
/*
 * <li>有序列表切换到无序
 * <li>无序列表切换到有序
 * <li>有序之间相互切换
 * <li>无序之间相互切换
 * <li>先引用后列表
 * <li>表格中插入列表
 * <li>h1套列表
 * <li>去除链接
 *
 * */


test('列表复制粘贴', function () {
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UE.getEditor('ue');
    editor.ready(function () {
        editor.setContent('<ol class="custom_num2 list-paddingleft-1"><li class="list-num-3-1 list-num2-paddingleft-1">a</li><li>b</li></ol><ul><li>a</li><li>b</li></ul>');
        ua.keydown(editor.body, {'keyCode':65, 'ctrlKey':true});
        ua.keydown(editor.body, {'keyCode':67, 'ctrlKey':true});
        /*ctrl+c*/

        setTimeout(function () {
            var html = {html:editor.body.innerHTML};
            editor.fireEvent('beforepaste', html);
            /*粘贴*/
//    range.setStart(editor.body,1).collapse(true).select();
//    editor.fireEvent("paste");
//    ua.manualDeleteFillData(editor.body);
//    equal(editor.body.innerHTML,'<p><br></p>','编辑器清空');
            editor.setContent('<ol><li>a</li><li>b</li></ol><ul><li>a</li><li>b</li></ul>');
            ua.keydown(editor.body, {'keyCode':65, 'ctrlKey':true});
            ua.keydown(editor.body, {'keyCode':67, 'ctrlKey':true});
            /*ctrl+c*/
            html = {html:editor.body.innerHTML};
            editor.fireEvent('beforepaste', html);
            /*粘贴*/
            editor.setContent('<ol><ol><li>a</li><li>b</li></ol><ul><li>a</li><li>b</li></ul></ol>');
            ua.keydown(editor.body, {'keyCode':65, 'ctrlKey':true});
            ua.keydown(editor.body, {'keyCode':67, 'ctrlKey':true});
            /*ctrl+c*/
            html = {html:editor.body.innerHTML};
            editor.fireEvent('beforepaste', html);
            /*粘贴*/
            editor.setContent('<ol class="custom_cn1 list-paddingleft-1"><ol><li>a</li><li>b</li></ol><ul><li>a</li><li>b</li></ul></ol>');
            ua.keydown(editor.body, {'keyCode':65, 'ctrlKey':true});
            ua.keydown(editor.body, {'keyCode':67, 'ctrlKey':true});
            /*ctrl+c*/
            html = {html:editor.body.innerHTML};
            setTimeout(function () {
                editor.fireEvent('beforepaste', html);
                /*粘贴*/
                te.dom.push(editor.container);
                start()
            }, 50);
        }, 50);

    });
    stop();
});


test('修改列表再删除列表', function () {
    if ((ua.browser.safari && !ua.browser.chrome))return 0;
    var editor = te.obj[0];
    var range = te.obj[1];
    var br = UE.browser.chrome ? "<br/>" : "";
    editor.setContent('<ol>hello1</ol>');
//    range.setStart(editor.body.firstChild, 0).collapse(true).select();//如果是闭合选区的话  只有ie8是正确的 chrome和ff都是有些问题的
    range.selectNode(editor.body.firstChild).select();
    editor.execCommand('insertunorderedlist');
    ua.manualDeleteFillData(editor.body);
    equal(editor.body.firstChild.tagName.toLowerCase(), 'ul', '查询列表的类型');
    equal(editor.getContent(editor.body),'<ul><li>hello1</li></ul>');
    range.setStart(editor.body.lastChild, 0).setEnd(editor.body.lastChild, 1).select();
    editor.execCommand('insertunorderedlist');
    ua.manualDeleteFillData(editor.body);
    if(ua.browser.ie)
        equal(editor.getContent(editor.body),'<p>hello1</p>','没有列表格式');
    else
        equal(editor.getContent(editor.body),'hello1'+ br,'没有列表格式');

});

//test('列表内没有列表标号的项后退', function () {//ie8下无法运行
//    if (ua.browser.safari)return;
//    var div = document.body.appendChild(document.createElement('div'));
//    div.id = 'ue';
//    var editor = UE.getEditor('ue');
//    editor.ready(function () {
//        var range = new UE.dom.Range(editor.document);
//        var lis;
//        var br = ua.browser.ie ? '<br>' : '<br>';
//        editor.setContent('<ol><li><p>hello</p><p><a href="http://www.baidu.com">www.baidu.com</a></p></li></ol>');
//        range.setStart(editor.body.firstChild.firstChild.lastChild.lastChild, 0).collapse(true).select();
//        ua.manualDeleteFillData(editor.body);
//        ua.keydown(editor.body, {keyCode:8});
//
//        setTimeout(function () {
//            lis = editor.body.getElementsByTagName('li');
//            equal(lis.length, '1', '列表长度不变');
//            ua.checkSameHtml(ua.getChildHTML(editor.body), '<ol class=" list-paddingleft-2"><li><p>hello</p></li></ol><p><a href="http://www.baidu.com" _href="http://www.baidu.com">www.baidu.com</a></p>', 'p在列表外');
//            te.dom.push(editor.container);
//            start()
//        }, 200);
//    });
//    stop();
//});

test('多个p，选中其中几个变为列表', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent('<p>hello1</p><p>hello2</p><p>hello3</p><p>hello4</p>');
    setTimeout(function () {
        range.setStart(body.firstChild, 0).setEnd(body.firstChild.nextSibling, 1).select();
        editor.execCommand('insertorderedlist');

        var space = ua.browser.webkit?'<br/>':'';
        equal(editor.getContent(editor.body.firstChild), '<ol><li><p>hello1'+space+'</p></li><li><p>hello2'+space+'</p></li></ol><p>hello3</p><p>hello4</p>', '检查列表的内容');
        equal(body.firstChild.tagName.toLowerCase(), 'ol', '检查列表的类型');
        equal(body.childNodes.length, 3, '3个孩子');
        equal(body.lastChild.tagName.toLowerCase(), 'p', '后面的p没有变为列表');
        equal(body.lastChild.innerHTML.toLowerCase(), 'hello4', 'p里的文本');
        start();
    }, 50);
    stop();
});



test('去除无序列表', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent('<p></p>');
    range.setStart(body.firstChild, 0).collapse(1).select();
    editor.execCommand('insertunorderedlist');
    equal(body.firstChild.tagName.toLowerCase(), 'ul', 'insert an unordered list');
    equal(body.childNodes.length, 1, 'body只有一个孩子');
    ok(editor.queryCommandState('insertunorderedlist'), 'state是1');
    /*去除列表*/
    editor.execCommand('insertunorderedlist');
    ua.manualDeleteFillData(editor.body);
    //equal(body.firstChild.tagName.toLowerCase(), 'p', '去除列表');//这句话ff运行不通过   因为此时ff下认为body没有孩子了  所以报错
    equal(body.childNodes.length, ua.browser.gecko?0:1, 'body只有一个孩子');
    ok(!editor.queryCommandState('insertunorderedlist'), 'state是0');
});

test('闭合方式有序和无序列表之间的切换', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent('<p></p>');
    range.setStart(body.firstChild, 0).collapse(1).select();
    editor.execCommand('insertunorderedlist');
    equal(body.firstChild.tagName.toLowerCase(), 'ul', 'insert an unordered list');
    equal(body.childNodes.length, 1, 'body只有一个孩子');
    equal(editor.queryCommandValue('insertorderedlist'), null, '有序列表查询结果为null');
    /*切换为有序列表*/
    editor.execCommand('insertorderedlist');
    ua.manualDeleteFillData(editor.body);
    equal(body.firstChild.tagName.toLowerCase(), 'ol', '变为有序列表');
    equal(body.childNodes.length, 1, 'body只有一个孩子');
    equal(editor.queryCommandValue('insertunorderedlist'), null, '无序列表查询结果为null');
});

test('非闭合方式切换有序和无序列表', function () {//原本是有序列表，非闭合方式进行切换，chrome下就是对的了，外层没有<p></p>了
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    /*如果只选中hello然后切换有序无序的话，不同浏览器下表现不一样*/
    editor.setContent('<ol><li>hello</li><li>hello3</li></ol><p>hello2</p>');
    range.selectNode(body.firstChild).select();
    editor.execCommand('insertunorderedlist');
    equal(body.firstChild.tagName.toLowerCase(), 'ul', '有序列表变为无序列表');
    equal(ua.getChildHTML(body.firstChild), '<li>hello</li><li>hello3</li>', 'innerHTML 不变');
    /*切换为有序列表*/
    editor.execCommand('insertorderedlist');
    equal(body.firstChild.tagName.toLowerCase(), 'ol', '无序列表变为有序列表');
    equal(ua.getChildHTML(body.firstChild), '<li>hello</li><li>hello3</li>', '变为有序列表后innerHTML 不变');
});

test('trace:3591:将列表下的文本合并到列表中', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    var br = UE.browser.chrome ? "<br>" : "";
    editor.setContent('<ul><li>hello1</li></ul><p>是的</p>');
    setTimeout(function () {
        range.setStart(body.firstChild, 0).setEnd(body.lastChild, 1).select();
        /*将无序的变为有序，文本也相应变成无序列表的一部分*/
        editor.execCommand('insertorderedlist');
        ua.manualDeleteFillData(editor.body);
        equal(body.firstChild.tagName.toLowerCase(), 'ol', 'ul变为了ol');
        equal(ua.getChildHTML(body.firstChild), '<li>hello1</li><li>是的'+br+'</li>');
        equal(body.childNodes.length, 1, '只有一个孩子是ol');
        start();
    }, 50);
    stop();
});

test('多个列表', function () {
    if(ua.browser.gecko)return;//trace 3591 不修
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent('<ol><li>hello1</li></ol><ul><li>hello2</li></ul>');
    range.selectNode(body.lastChild).select();
    /*将无序的变为有序*/
    editor.execCommand('insertorderedlist');
    equal(body.firstChild.tagName.toLowerCase(), 'ol', '仍然是ol');
    equal(body.childNodes.length, 1, 'body只有1个孩子ol');
    equal(body.firstChild.childNodes.length, 2, '下面的列表合并到上面');
    equal(ua.getChildHTML(body.lastChild), '<li>hello1</li><li>hello2</li>', '2个li子节点');
});

test('修改列表中间某一段列表为另一种列表', function () {//ie下'childNodes.1.tagName' 为空或不是对象
    if(!ua.browser.ie){
        var editor = te.obj[0];
        var range = te.obj[1];
        var body = editor.body;
        var br = UE.browser.chrome ? "<br>" : "";
        editor.setContent('<ol><li>hello</li><li>hello2</li><li>hello3</li><li>hello4</li></ol>');
        //var lis = body.firstChild.getElementsByTagName('li');
        // range.setStart(lis[1], 0).setEnd(lis[2], 1).select();
        range.setStart(body.firstChild.firstChild.nextSibling,0).setEnd(body.firstChild.firstChild.nextSibling.nextSibling,1).select();
        editor.execCommand('insertunorderedlist');
        equal(body.childNodes.length, 3, '3个列表');
        equal(ua.getChildHTML(body.firstChild), '<li>hello</li>', '第一个列表只有一个li');
        equal(ua.getChildHTML(body.lastChild), '<li>hello4</li>', '最后一个列表只有一个li');
        equal(body.childNodes[1].tagName.toLowerCase(), 'ul', '第二个孩子是无序列表');
        equal(ua.getChildHTML(body.childNodes[1]), '<li>hello2'+br+'</li><li>hello3'+br+'</li>', '检查第二个列表的内容');
    }
});

//ff和ie下是bug
test('trace:3567:两个有序列表，一个无序列表，将无序列表与第二个有序列表合并', function () {
    if(ua.browser.ie||ua.browser.gecko)return;//won't fix
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent('<ol><li>hello3</li></ol><ol><li>hello1</li></ol><ul><li>hello2</li></ul>');
    range.selectNode(body.lastChild).select();
    /*将无序的变为有序，有序上面的有序不会合并在一起了*/
    editor.execCommand('insertorderedlist');
    equal(body.firstChild.tagName.toLowerCase(), 'ol', '仍然是ol');
    equal(body.childNodes.length, 2, 'body有两个孩子ol');
    equal(body.lastChild.childNodes.length, 2, '无序列表合并到第二个有序列表中了');
});

test('列表下的文本合并到列表中', function () {
    if(ua.browser.gecko)return;//trace 3591 不修
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    var br = UE.browser.chrome ? "<br>" : "";
    editor.setContent('<ol><li>hello3</li><li>hello1</li></ol><p>文本1</p><p>文本2</p>');
    range.setStart(body, 1).setEnd(body, 3).select();
    /*选中文本变为有序列表，和上面的列表合并了*/
    editor.execCommand('insertorderedlist');
    var ol = body.firstChild;
    equal(body.childNodes.length, 1, '所有合并为一个列表');
    equal(ol.tagName.toLowerCase(), 'ol', '仍然是ol');
    equal(ol.childNodes.length, 4, '普通文本与上面的有序列表合并为一个了');
    equal(ua.getChildHTML(body.firstChild), '<li>hello3</li><li>hello1</li><li>文本1'+br+'</li><li>文本2'+br+'</li>', '4个li子节点');
});

test('trace 3586 :2个相同类型的列表合并', function () {
    if(ua.browser.ie||ua.browser.gecko)return;//won't fix
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent('<ol><li>hello3</li><li>hello1</li></ol><ol><li><p>文本1</p></li><li><p>文本2</p></li></ol>');
    range.setStart(body.firstChild,0).setEnd(body.lastChild,2).select();
    editor.execCommand('insertorderedlist');
    if(ua.browser.ie){
        var ol = body.firstChild;
        equal(body.childNodes.length, 1, '所有合并为一个列表');
        equal(ol.tagName.toLowerCase(), 'ol', '仍然是ol');
        equal(ol.childNodes.length, 4, '下面和上面的列表合并到上面去了');
        equal(ua.getChildHTML(body.firstChild), '<li>hello3<br></li><li>hello1<br></li><li>文本1<br></li><li>文本2<br></li>', '4个li子节点');
    }
    else{
        equal(ua.getChildHTML(body),'hello3<br>hello1<br>文本1<br>文本2<br>','列表形式被取消');
    }
});
//
/*test('列表内后退', function () {
    *//*实际操作没问题，取range时会在将文本节点分为两个节点，后退操作无法实现*//*
    if ((ua.browser.safari && !ua.browser.chrome))
        return 0;
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UE.getEditor('ue');
    editor.ready(function () {
        var range = new UE.dom.Range(editor.document);
        var lis;
        var br = ua.browser.ie ? '<br>' : '<br>';
//////标签空格的处理
        editor.setContent('<ol><li><br></li><li><p>hello2</p></li><li><br></li><li><sss>hello3</sss></li><li><p>hello4</p></li><li><p>hello5</p></li></ol>');
//    editor.setContent('<ol><li><br></li><li><p>hello2</p></li><li></li><li><sss>hello3</sss></li><li><p>hello4</p></li><li><p>hello5</p></li></ol>');
        range.setStart(editor.body.firstChild.lastChild.firstChild.firstChild, 0).collapse(1).select();
        ua.manualDeleteFillData(editor.body);
        ua.keydown(editor.body, {keyCode:8});

        var ol = editor.body.getElementsByTagName('ol');
        lis = editor.body.getElementsByTagName('li');
        equal(lis.length, '5', '变成5个列表项');
        equal(ua.getChildHTML(editor.body.firstChild), '<li><p>' + br + '</p></li><li><p>hello2</p></li><li><p>' + br + '</p></li><li><sss>hello3</sss></li><li><p>hello4</p><p>hello5</p></li>', '最后一个列表项');
        range.setStart(lis[0].firstChild, 0).collapse(1).select();
        ua.keydown(editor.body, {keyCode:8});

        lis = editor.body.getElementsByTagName('li');
        equal(lis.length, '4', '变成4个列表项');
        equal(ua.getChildHTML(editor.body.lastChild), '<li><p>hello2</p></li><li><p>' + br + '</p></li><li><sss>hello3</sss></li><li><p>hello4</p><p>hello5</p></li>', '第一个列表项且为空行');
        range.setStart(lis[1].firstChild, 0).collapse(1).select();
        ua.keydown(editor.body, {keyCode:8});

        lis = editor.body.getElementsByTagName('li');
        equal(lis.length, '3', '变成3个列表项');
        equal(ua.getChildHTML(editor.body.lastChild), '<li><p>hello2</p><p>' + br + '</p></li><li><sss>hello3</sss></li><li><p>hello4</p><p>hello5</p></li>', '中间列表项且为空行');
        if (!ua.browser.ie) {
            range.setStart(lis[1].firstChild.firstChild, 0).collapse(1).select();
            ua.manualDeleteFillData(editor.body);
            ua.keydown(editor.body, {keyCode:8});
//TODO 1.2.6不严重bug注释 空style未删除
//        equal(ua.getChildHTML(editor.body),'<p><br></p><ol class=\" list-paddingleft-2\"><li><p>hello2</p><p><br></p><sss>hello3</sss></li><li><p>hello4</p><p>hello5</p></li></ol>','自定义标签后退');
        }
        te.dom.push(editor.container);
        start()
    });
    stop();
});*/

//test('列表内回车', function () {//ie8下 用例不通过 ff和chrome下各种问题，比较乱  待定
//    var div = document.body.appendChild(document.createElement('div'));
//    div.id = 'ue';
//    var editor = UE.getEditor('ue');
//    editor.ready(function () {
//        var range = new UE.dom.Range(editor.document);
//        var lis;
//        var br = ua.browser.ie ? '&nbsp;' : '<br>';
//        editor.setContent('<ol><li></li></ol>');
//        lis = editor.body.getElementsByTagName('li');
//        range.setStart(lis[0], 0).collapse(1).select();
//        ua.keydown(editor.body, {keyCode:13});
//        var spa = ua.browser.opera ? '<br>' : '';
//        equal(ua.getChildHTML(editor.body),  '<p>' + br + '</p>', '空列表项回车--无列表');
//
//        editor.setContent('<ol><li>hello1<p>hello2</p></li></ol>');//mini中应该是没有回车  增加列表项的功能
//        lis = editor.body.getElementsByTagName('li');
//        range.setStart(lis[0].lastChild, 0).collapse(1).select();
//        ua.keydown(editor.body, {keyCode:13});
//        //equal(ua.getChildHTML(editor.body.firstChild), '<li><p><sss>hello1</sss><p></p></p></li><li><p><p>hello2</p></p></li>', '单个列表项内回车');
//        equal(ua.getChildHTML(editor.body),'<ol><li>hello1<p>hello2</p></li></ol>');
//        //标签空格的处理
//        editor.setContent('<ol><li><br></li><li><p>hello5</p></li><li><p><br></p><p><br></p></li></ol>');
//        lis = editor.body.getElementsByTagName('li');
//        range.setStart(lis[2].firstChild.firstChild, 0).setEnd(lis[2].lastChild.firstChild, 0).select();
//        ua.keydown(editor.body, {keyCode:13});
//        //trace 2652
//        range.setStart(editor.body.firstChild.firstChild.firstChild, 0).collapse(1).select();
//        ua.keydown(editor.body, {keyCode:13});
//       // trace 2653
//        editor.setContent('<ol><li><p>hello2</p></li><li><p>hello3</p></li><li><p><br /></p><p>hello5</p></li></ol>');
//        lis = editor.body.getElementsByTagName('li');
//        range.setStart(lis[0].firstChild.firstChild, 2).setEnd(lis[1].firstChild.firstChild, 4).select();
//        ua.keydown(editor.body, {keyCode:13});
//        equal(ua.getChildHTML(editor.body.firstChild), '<li><p>he</p></li><li><p>o3</p></li><li><p><br></p><p>hello5</p></li>', '非闭合回车');
//
//        editor.setContent('<ol><li><sss>hello</sss><p>hello4</p></li><li><p>hello5</p></li></ol>');
//        lis = editor.body.getElementsByTagName('li');
//        range.setStart(lis[0].lastChild.firstChild, 1).setEnd(lis[0].lastChild.firstChild, 2).select();
//        ua.keydown(editor.body, {keyCode:13});
//        equal(ua.getChildHTML(editor.body.firstChild), '<li><p><sss>hello</sss><p>h</p></p></li><li><p><p>llo4</p></p></li><li><p>hello5</p></li>', '一个列表项内两行');
//        te.dom.push(editor.container);
//        start()
//    });
//    stop();
//});

//test('回车后产生新的li-选区闭合', function () {
//    var div = document.body.appendChild(document.createElement('div'));
//    div.id = 'ue';
//    var editor = UE.getEditor('ue');
//    editor.ready(function () {
//        var range = new UE.dom.Range(editor.document);
//        var body = editor.body;
//        editor.setContent('<p>hello1</p><p>hello2</p>');
//        setTimeout(function () {
//            range.setStart(body.firstChild, 0).setEnd(body.firstChild.nextSibling, 1).select();
//            editor.execCommand('insertorderedlist');
//           var lastLi = body.firstChild.lastChild.firstChild.firstChild;
//            //var lastLi = body.firstChild.lastChild.firstChild;
//            range.setStart(lastLi, lastLi.length).collapse(1).select();
//            setTimeout(function () {
//                ua.keydown(editor.body, {'keyCode':13});
//                equal(body.firstChild.childNodes.length, 3, '回车后产生新的li');
//                equal(body.firstChild.lastChild.tagName.toLowerCase(), 'li', '回车后产生新的li');
//                var br = ua.browser.ie ? '' : '<br>';
//                equal(ua.getChildHTML(body.firstChild), '<li><p>hello1</p></li><li><p>hello2</p></li><li><p>' + br + '</p></li>', '检查内容');
//                var lastLi = body.firstChild.lastChild.firstChild.firstChild;
//                range.setStart(lastLi, lastLi.length).collapse(1).select();
//                setTimeout(function () {
//                    ua.keydown(editor.body, {'keyCode':13});
//                    equal(body.firstChild.childNodes.length, 2, '空li后回车，删除此行li');
//                    equal(body.lastChild.tagName.toLowerCase(), 'p', '产生p');
//                    br = ua.browser.ie ? '' : '<br>';
//                    ua.manualDeleteFillData(body.lastChild);
//                    equal(body.lastChild.innerHTML.toLowerCase().replace(/\r\n/ig, ''), br, '检查内容');
//                    te.dom.push(editor.container);
//                    start()
//                }, 20);
//            }, 20);
//        }, 50);
//    });
//    stop();
//});

//test('trace 3117：列表内后退两次', function () {
//   // 实际操作没问题，取range时会在将文本节点分为两个节点，后退操作无法实现
//    if ((ua.browser.safari && !ua.browser.chrome))return 0;
//    var div = document.body.appendChild(document.createElement('div'));
//    div.id = 'ue';
//    var editor = UE.getEditor('ue');
//    editor.ready(function () {
//        var range = new UE.dom.Range(editor.document);
//        var br = ua.browser.ie ? '<br>' : '<br>';
//        editor.setContent('<ol><li>hello</li><li><p><br></p></li></ol>');
//
//        range.setStart(editor.body.firstChild.lastChild.firstChild, 0).collapse(1).select();
//        ua.manualDeleteFillData(editor.body);
//        ua.keydown(editor.body, {keyCode:8});
//        var ol = editor.body.getElementsByTagName('ol');
//        var lis = editor.body.getElementsByTagName('li');
//        equal(lis.length, '1', '变成1个列表项');
//        equal(ua.getChildHTML(editor.body.firstChild), '<li><p>hello</p><p>' + br + '</p></li>', '检查列表内容');
////TODO 1.2.6不严重bug注释 空style未删除
////    range.setStart(lis[0].lastChild,0).collapse(1).select();
////    ua.keydown(editor.body,{keyCode:8});
////    equal(ua.getChildHTML(editor.body),'<ol class=\" list-paddingleft-2\"><li><p>hello</p></li></ol><p>'+br+'</p>','检查body内容');
//        //模拟不到光标跳到上一行？
////    range.setStart(editor.body.lastChild,0).collapse(1).select();
////    ua.keydown(editor.body,{keyCode:8});
////    equal(ua.getChildHTML(editor.body),'<ol class=\" list-paddingleft-2\"><li><p>hello</p></li></ol>','检查body内容');
//        te.dom.push(editor.container);
//        start()
//    });
//    stop();
//});

/*trace 3136*/
//test('trace 3118：全选后backspace', function () {//跟单行backspace 是一样的问题
//    /*实际操作没问题，取range时会在将文本节点分为两个节点，后退操作无法实现*/
//    if ((ua.browser.safari && !ua.browser.chrome))return 0;
//    var div = document.body.appendChild(document.createElement('div'));
//    div.id = 'ue';
//    var editor = UE.getEditor('ue');
//    editor.ready(function () {
//
//        var br = ua.browser.ie ? '' : '<br>';
//        editor.setContent('<ol><li>hello</li><li><p><br></p></li></ol>');
//        ua.keydown(editor.body, {'keyCode':65, 'ctrlKey':true});
//        ua.keydown(editor.body, {'keyCode':8});
//        equal(ua.getChildHTML(editor.body), '<p>' + br + '</p>', '');
//        ok(!editor.queryCommandState('insertorderedlist'), 'state是0');
//        te.dom.push(editor.container);
//        start()
//    });
//    stop();
//});

//test('trace 3132：单行列表backspace', function () {
//    //实际操作没问题，取range时会在将文本节点分为两个节点，后退操作无法实现
//    if ((ua.browser.safari && !ua.browser.chrome))return 0;
//    if (ua.browser.ie == 9)return 0;//TODO 1.2.6
//    var div = document.body.appendChild(document.createElement('div'));
//    div.id = 'ue';
//    var editor = UE.getEditor('ue');
//    editor.ready(function () {
//        var range = new UE.dom.Range(editor.document);
//        editor.setContent('<ol><li><br></li></ol>');
//        range.selectNode(editor.body.firstChild.firstChild.firstChild.firstChild).select();
//        ua.keydown(editor.body, {keyCode:8});
//        equal(ua.getChildHTML(editor.body), '<p><br></p>', '');
//        te.dom.push(editor.container);
//        start()
//    });
//    stop();
//});


//test('trace 3118:全选后backspace',function(){  //写的用例，为什么看不到TT 想确定一下为什么的
//    if ((ua.browser.safari && !ua.browser.chrome))return 0;
//    var editor = te.obj[0];
//    var range = te.obj[1];
//   // var body = editor.body;
//    var br = ua.browser.chrome ? '<br>' : '';
//    editor.setContent('<ol><li>hello</li><li><p><br></p></li></ol>');
//    range.selectNode(editor.body.firstChild).select();
//    setTimeout(function(){
//        ua.keydown(editor.body,{'keyCode':65,'ctrlKey':true});
//        ua.keydown(editor.body,{keycode:8});
//        equal(ua.getChildHTML(editor.body),'<p>' + br + '</p>','全部清空');
//        ok(!editor.queryCommandState('insertorderedlist'), 'state是0');
//        start();
//    },200)
//     stop();
//});




test('添加列表，取消列表', function () {
    var editor = te.obj[0];
    var body = editor.body;
    var br = ua.browser.ie ? '' : '<br>';
    editor.setContent('<p>hello1</p><p>hello2</p><p>hello3</p><p>hello4</p>');
    editor.execCommand('selectAll');
    editor.execCommand('insertunorderedlist');

    equal(body.firstChild.tagName.toLowerCase(),'ul','检查无序列表');
    ok(editor.queryCommandState('insertunorderedlist'), 'state是1');
    editor.execCommand('selectAll');
    editor.execCommand('insertunorderedlist');
    if(ua.browser.ie)
        ua.checkHTMLSameStyle('<p>hello1</p><p>hello2</p><p>hello3</p><p>hello4</p>', editor.document, editor.body, '取消列表');
    else{
        if(ua.browser.gecko)
            equal(ua.getChildHTML(editor.body),'hello1<br>hello2<br>hello3<br>hello4','取消列表');
        else
            equal(ua.getChildHTML(editor.body),'hello1<br>hello2<br>hello3<br>hello4<br>','取消列表');
    }
    equal(editor.queryCommandValue('insertunorderedlist'), null, '查询取消无序列表的结果');
    ok(!editor.queryCommandState('insertunorderedlist'), 'state是0');
});

test('去掉列表外边的p', function () {
    var editor = te.obj[0];
    var body = editor.body;
    //var range = te.obj[1];
    var br = ua.browser.ie ? '' : '<br>';
    editor.setContent('<p>hello1</p><p>hello2</p><p>hello3</p><p>hello4</p>');
    editor.execCommand('selectAll');
    //range.selectNode(body.lastChild).select();
    editor.execCommand('insertunorderedlist');
    var count = 0;
    editor.$body.find('ol,ul').each(function(i,n){
        var p = n.parentNode;
        if(p!==editor.body){
            count++
        }
    })
    equal(count,0)
});