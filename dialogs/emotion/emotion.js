(function(){

    var editor = null;

    function $G( id ) {
        return document.getElementById( id );
    }

    UE.registerWidget('emotion',{

        tpl: "<link type=\"text/css\" rel=\"stylesheet\" href=\"<%=emotion_url%>emotion.css\">" +
            "<div id=\"eduiEmotionTabPanel\" class=\"edui-emotion-wrapper\">" +
            "<ul class=\"edui-tab-nav\">" +
            "<li class=\"edui-tab-item active\"><a href=\"#eduiEmotionTab0\" class=\"edui-tab-text\"><%=lang_input_choice%></a></li>" +
            "<li class=\"edui-tab-item\"><a href=\"#eduiEmotionTab1\" class=\"edui-tab-text\"><%=lang_input_Tuzki%></a></li>" +
            "<li class=\"edui-tab-item\"><a href=\"#eduiEmotionTab2\" class=\"edui-tab-text\"><%=lang_input_lvdouwa%></a></li>" +
            "<li class=\"edui-tab-item\"><a href=\"#eduiEmotionTab3\" class=\"edui-tab-text\"><%=lang_input_BOBO%></a></li>" +
            "<li class=\"edui-tab-item\"><a href=\"#eduiEmotionTab4\" class=\"edui-tab-text\"><%=lang_input_babyCat%></a></li>" +
            "<li class=\"edui-tab-item\"><a href=\"#eduiEmotionTab5\" class=\"edui-tab-text\"><%=lang_input_bubble%></a></li>" +
            "<li class=\"edui-tab-item\"><a href=\"#eduiEmotionTab6\" class=\"edui-tab-text\"><%=lang_input_youa%></a></li>" +
            "<li class=\"edui-emotion-tabs\"></li>" +
            "</ul>" +
            "<div id=\"eduiEmotionTabBodys\" class=\"edui-tab-content\">" +
            "<div id=\"eduiEmotionTab0\" class=\"edui-tab-pane active\">1</div>" +
            "<div id=\"eduiEmotionTab1\" class=\"edui-tab-pane\">2</div>" +
            "<div id=\"eduiEmotionTab2\" class=\"edui-tab-pane\">3</div>" +
            "<div id=\"eduiEmotionTab3\" class=\"edui-tab-pane\">4</div>" +
            "<div id=\"eduiEmotionTab4\" class=\"edui-tab-pane\">5</div>" +
            "<div id=\"eduiEmotionTab5\" class=\"edui-tab-pane\">6</div>" +
            "<div id=\"eduiEmotionTab6\" class=\"edui-tab-pane\">7</div>" +
            "</div>" +
            "<div id=\"eduiEmotionTabIconReview\">" +
            "<img id=\'eduiEmotionFaceReview\' class=\'edui-emotion-review\'/>" +
            "</div>",

        sourceData: {
            emotion: {
                tabNum:7, //切换面板数量
                SmilmgName:{ eduiEmotionTab0:['j_00', 84], eduiEmotionTab1:['t_00', 40], eduiEmotionTab2:['w_00', 52], eduiEmotionTab3:['B_00', 63], eduiEmotionTab4:['C_00', 20], eduiEmotionTab5:['i_f', 50], eduiEmotionTab6:['y_00', 40] }, //图片前缀名
                imageFolders:{ eduiEmotionTab0:'jx2/', eduiEmotionTab1:'tsj/', eduiEmotionTab2:'ldw/', eduiEmotionTab3:'bobo/', eduiEmotionTab4:'babycat/', eduiEmotionTab5:'face/', eduiEmotionTab6:'youa/'}, //图片对应文件夹路径
                imageCss:{eduiEmotionTab0:'jd', eduiEmotionTab1:'tsj', eduiEmotionTab2:'ldw', eduiEmotionTab3:'bb', eduiEmotionTab4:'cat', eduiEmotionTab5:'pp', eduiEmotionTab6:'youa'}, //图片css类名
                imageCssOffset:{eduiEmotionTab0:35, eduiEmotionTab1:35, eduiEmotionTab2:35, eduiEmotionTab3:35, eduiEmotionTab4:35, eduiEmotionTab5:25, eduiEmotionTab6:35}, //图片偏移
                SmileyInfor:{
                    eduiEmotionTab0:['Kiss', 'Love', 'Yeah', '啊！', '背扭', '顶', '抖胸', '88', '汗', '瞌睡', '鲁拉', '拍砖', '揉脸', '生日快乐', '大笑', '瀑布汗~', '惊讶', '臭美', '傻笑', '抛媚眼', '发怒', '打酱油', '俯卧撑', '气愤', '?', '吻', '怒', '胜利', 'HI', 'KISS', '不说', '不要', '扯花', '大心', '顶', '大惊', '飞吻', '鬼脸', '害羞', '口水', '狂哭', '来', '发财了', '吃西瓜', '套牢', '害羞', '庆祝', '我来了', '敲打', '晕了', '胜利', '臭美', '被打了', '贪吃', '迎接', '酷', '微笑', '亲吻', '调皮', '惊恐', '耍酷', '发火', '害羞', '汗水', '大哭', '', '加油', '困', '你NB', '晕倒', '开心', '偷笑', '大哭', '滴汗', '叹气', '超赞', '??', '飞吻', '天使', '撒花', '生气', '被砸', '吓傻', '随意吐'],
                    eduiEmotionTab1:['Kiss', 'Love', 'Yeah', '啊！', '背扭', '顶', '抖胸', '88', '汗', '瞌睡', '鲁拉', '拍砖', '揉脸', '生日快乐', '摊手', '睡觉', '瘫坐', '无聊', '星星闪', '旋转', '也不行', '郁闷', '正Music', '抓墙', '撞墙至死', '歪头', '戳眼', '飘过', '互相拍砖', '砍死你', '扔桌子', '少林寺', '什么？', '转头', '我爱牛奶', '我踢', '摇晃', '晕厥', '在笼子里', '震荡'],
                    eduiEmotionTab2:['大笑', '瀑布汗~', '惊讶', '臭美', '傻笑', '抛媚眼', '发怒', '我错了', 'money', '气愤', '挑逗', '吻', '怒', '胜利', '委屈', '受伤', '说啥呢？', '闭嘴', '不', '逗你玩儿', '飞吻', '眩晕', '魔法', '我来了', '睡了', '我打', '闭嘴', '打', '打晕了', '刷牙', '爆揍', '炸弹', '倒立', '刮胡子', '邪恶的笑', '不要不要', '爱恋中', '放大仔细看', '偷窥', '超高兴', '晕', '松口气', '我跑', '享受', '修养', '哭', '汗', '啊~', '热烈欢迎', '打酱油', '俯卧撑', '?'],
                    eduiEmotionTab3:['HI', 'KISS', '不说', '不要', '扯花', '大心', '顶', '大惊', '飞吻', '鬼脸', '害羞', '口水', '狂哭', '来', '泪眼', '流泪', '生气', '吐舌', '喜欢', '旋转', '再见', '抓狂', '汗', '鄙视', '拜', '吐血', '嘘', '打人', '蹦跳', '变脸', '扯肉', '吃To', '吃花', '吹泡泡糖', '大变身', '飞天舞', '回眸', '可怜', '猛抽', '泡泡', '苹果', '亲', '', '骚舞', '烧香', '睡', '套娃娃', '捅捅', '舞倒', '西红柿', '爱慕', '摇', '摇摆', '杂耍', '招财', '被殴', '被球闷', '大惊', '理想', '欧打', '呕吐', '碎', '吐痰'],
                    eduiEmotionTab4:['发财了', '吃西瓜', '套牢', '害羞', '庆祝', '我来了', '敲打', '晕了', '胜利', '臭美', '被打了', '贪吃', '迎接', '酷', '顶', '幸运', '爱心', '躲', '送花', '选择'],
                    eduiEmotionTab5:['微笑', '亲吻', '调皮', '惊讶', '耍酷', '发火', '害羞', '汗水', '大哭', '得意', '鄙视', '困', '夸奖', '晕倒', '疑问', '媒婆', '狂吐', '青蛙', '发愁', '亲吻', '', '爱心', '心碎', '玫瑰', '礼物', '哭', '奸笑', '可爱', '得意', '呲牙', '暴汗', '楚楚可怜', '困', '哭', '生气', '惊讶', '口水', '彩虹', '夜空', '太阳', '钱钱', '灯泡', '咖啡', '蛋糕', '音乐', '爱', '胜利', '赞', '鄙视', 'OK'],
                    eduiEmotionTab6:['男兜', '女兜', '开心', '乖乖', '偷笑', '大笑', '抽泣', '大哭', '无奈', '滴汗', '叹气', '狂晕', '委屈', '超赞', '??', '疑问', '飞吻', '天使', '撒花', '生气', '被砸', '口水', '泪奔', '吓傻', '吐舌头', '点头', '随意吐', '旋转', '困困', '鄙视', '狂顶', '篮球', '再见', '欢迎光临', '恭喜发财', '稍等', '我在线', '恕不议价', '库房有货', '货在路上']
                }
            }
        },
        initContent:function( _editor, $widget ){

            var me = this,
                emotion = me.sourceData.emotion,
                lang = _editor.getLang( 'emotion' )['static'],
                emotionUrl = UEDITOR_CONFIG.UEDITOR_HOME_URL + 'dialogs/emotion/',
                options = $.extend( {}, lang, {
                    emotion_url: emotionUrl
                } );

            editor = _editor;
            this.widget = $widget;

            me.root().html( $.parseTmpl( me.tpl, options ) );

            emotion.SmileyPath = _editor.options.emotionLocalization === true ? emotionUrl + 'images/' : "http://img.baidu.com/hi/";
            emotion.SmileyBox = me.createTabList( emotion.tabNum );
            emotion.tabExist = me.createArr( emotion.tabNum );

            me.tabs = $.eduitab({selector:"#eduiEmotionTabPanel"});

            me.initImgName();

            //激活第一个选项
            me.tabs.edui().activate( $("#eduiEmotionTab0"), $("#eduiEmotionTab0").parent());

        },
        initEvent:function(){

            var me = this;

            //防止点击过后关闭popup
            me.root().on('click', function(e){
                return false;
            });

            //移动预览
            me.root().delegate( 'td', 'mouseover mouseout', function( evt ){

                var $td = $( this),
                    url = $td.attr('data-surl') || null;

                if( url ) {
                    me[evt.type]( this, url , $td.attr('data-posflag') );
                }

                return false;

            } );

            //点击选中
            me.root().delegate( 'td', 'click', function( evt ){

                var $td = $( this),
                    realUrl = $td.attr('data-realurl') || null;

                if( realUrl ) {
                    me.insertSmiley( realUrl.replace( /'/g, "\\'" ), evt );
                }

                return false;

            } );

            //更新模板
            me.tabs.edui().on("tabbeforeshow", function( evt ){

                var contentId = evt.target.href.replace( /^.*#(?=[^\s]*$)/, '' );

                me.updateTab( contentId );

            });

        },
        initImgName: function() {

            var emotion = this.sourceData.emotion;

            for ( var pro in emotion.SmilmgName ) {
                var tempName = emotion.SmilmgName[pro],
                    tempBox = emotion.SmileyBox[pro],
                    tempStr = "";

                if ( tempBox.length ) return;

                for ( var i = 1; i <= tempName[1]; i++ ) {
                    tempStr = tempName[0];
                    if ( i < 10 ) tempStr = tempStr + '0';
                    tempStr = tempStr + i + '.gif';
                    tempBox.push( tempStr );
                }
            }

        },
        updateTab: function( contentBoxId ) {

            var me = this,
                emotion = me.sourceData.emotion;

//            me.autoHeight( index );

            if ( !emotion.tabExist[ contentBoxId ] ) {

                emotion.tabExist[ contentBoxId ] = true;
                me.createTab( contentBoxId );

            }

        },
        autoHeight: function( index ) {
            var iframe = this.root()[0],
                parent = iframe.parentNode.parentNode;
            switch ( index ) {
                case 0:
                    iframe.style.height = "380px";
                    parent.style.height = "392px";
                    break;
                case 1:
                    iframe.style.height = "220px";
                    parent.style.height = "232px";
                    break;
                case 2:
                    iframe.style.height = "260px";
                    parent.style.height = "272px";
                    break;
                case 3:
                    iframe.style.height = "300px";
                    parent.style.height = "312px";
                    break;
                case 4:
                    iframe.style.height = "140px";
                    parent.style.height = "152px";
                    break;
                case 5:
                    iframe.style.height = "260px";
                    parent.style.height = "272px";
                    break;
                case 6:
                    iframe.style.height = "230px";
                    parent.style.height = "242px";
                    break;
                default:

            }
        },
        createTabList: function( tabNum ) {
            var obj = {};
            for ( var i = 0; i < tabNum; i++ ) {
                obj["eduiEmotionTab" + i] = [];
            }
            return obj;
        },
        mouseover: function( td, srcPath, posFlag ) {
            td.style.backgroundColor = "#ACCD3C";
            $G( 'eduiEmotionFaceReview' ).style.backgroundImage = "url(" + srcPath + ")";
            if ( posFlag == 1 ) $G( "eduiEmotionTabIconReview" ).className = "show";
            $G( "eduiEmotionTabIconReview" ).style.display = 'block';
        },
        mouseout: function( td ) {
            td.style.backgroundColor = "transparent";
            var tabIconRevew = $G( "eduiEmotionTabIconReview" );
            tabIconRevew.className = "";
            tabIconRevew.style.display = 'none';
        },
        insertSmiley: function( url, evt ) {
            var obj = {
                src:editor.options.emotionLocalization ? editor.options.UEDITOR_HOME_URL + "dialogs/emotion/" + url : url
            };
            obj._src = obj.src;
            editor.execCommand( 'insertimage', obj );
            if ( !evt.ctrlKey ) {
                this.widget.edui().hide();
            }
        },
        createTab: function( contentBoxId ) {

            var faceVersion = "?v=1.1", //版本号
                me = this,
                $contentBox = $("#"+contentBoxId),
                emotion = me.sourceData.emotion,
                imagePath = emotion.SmileyPath + emotion.imageFolders[ contentBoxId ], //获取显示表情和预览表情的路径
                positionLine = 11 / 2, //中间数
                iWidth = iHeight = 35, //图片长宽
                iColWidth = 3, //表格剩余空间的显示比例
                tableCss = emotion.imageCss[ contentBoxId ],
                cssOffset = emotion.imageCssOffset[ contentBoxId ],
                textHTML = ['<table border="1" class="edui-emotion-smileytable">'],
                i = 0, imgNum = emotion.SmileyBox[ contentBoxId ].length, imgColNum = 11, faceImage,
                sUrl, realUrl, posflag, offset, infor;

            for ( ; i < imgNum; ) {
                textHTML.push( '<tr>' );
                for ( var j = 0; j < imgColNum; j++, i++ ) {
                    faceImage = emotion.SmileyBox[ contentBoxId ][i];
                    if ( faceImage ) {
                        sUrl = imagePath + faceImage + faceVersion;
                        realUrl = imagePath + faceImage;
                        posflag = j < positionLine ? 0 : 1;
                        offset = cssOffset * i * (-1) - 1;
                        infor = emotion.SmileyInfor[ contentBoxId ][i];

                        textHTML.push( '<td  class="edui-emotion-' + tableCss + '" data-surl="'+ sUrl +'" data-realurl="'+ realUrl +'" data-posflag="'+ posflag +'" align="center">' );
                        textHTML.push( '<span>' );
                        textHTML.push( '<img  style="background-position:left ' + offset + 'px;" title="' + infor + '" src="' + emotion.SmileyPath + (editor.options.emotionLocalization ? '0.gif" width="' : 'default/0.gif" width="') + iWidth + '" height="' + iHeight + '"></img>' );
                        textHTML.push( '</span>' );
                    } else {
                        textHTML.push( '<td width="' + iColWidth + '%"   bgcolor="#FFFFFF">' );
                    }
                    textHTML.push( '</td>' );
                }
                textHTML.push( '</tr>' );
            }
            textHTML.push( '</table>' );
            textHTML = textHTML.join( "" );
            $contentBox.html( textHTML );
        },
        createArr: function( tabNum ) {
            var arr = [];
            for ( var i = 0; i < tabNum; i++ ) {
                arr[i] = 0;
            }
            return arr;
        },
        width:603,
        height:407
    });

})();

