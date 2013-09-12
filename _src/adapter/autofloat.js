UM.registerUI('autofloat',function(){
    var me = this,
        lang = me.getLang();
    me.setOpt({
        topOffset:0
    });
    var optsAutoFloatEnabled = me.options.autoFloatEnabled !== false,
        topOffset = me.options.topOffset;


    //如果不固定toolbar的位置，则直接退出
    if(!optsAutoFloatEnabled){
        return;
    }
    me.ready(function(){
        var LteIE6 = browser.ie && browser.version <= 6,
            quirks = browser.quirks;

        function checkHasUI(){
            if(!UM.ui){
                alert(lang.autofloatMsg);
                return 0;
            }
            return 1;
        }
        function fixIE6FixedPos(){
            var docStyle = document.body.style;
            docStyle.backgroundImage = 'url("about:blank")';
            docStyle.backgroundAttachment = 'fixed';
        }
        var	bakCssText,
            placeHolder = document.createElement('div'),
            toolbarBox,orgTop,
            getPosition=function(element){
                var bcr;
                //trace  IE6下在控制编辑器显隐时可能会报错，catch一下
                try{
                    bcr = element.getBoundingClientRect();
                }catch(e){
                    bcr={left:0,top:0,height:0,width:0}
                }
                var rect = {
                    left: Math.round(bcr.left),
                    top: Math.round(bcr.top),
                    height: Math.round(bcr.bottom - bcr.top),
                    width: Math.round(bcr.right - bcr.left)
                };
                var doc;
                while ((doc = element.ownerDocument) !== document &&
                    (element = domUtils.getWindow(doc).frameElement)) {
                    bcr = element.getBoundingClientRect();
                    rect.left += bcr.left;
                    rect.top += bcr.top;
                }
                rect.bottom = rect.top + rect.height;
                rect.right = rect.left + rect.width;
                return rect;
            };
        var isFullScreening = false;
        function setFloating(){
            if(isFullScreening){
                return;
            }
            var toobarBoxPos = domUtils.getXY(toolbarBox),
                origalFloat = domUtils.getComputedStyle(toolbarBox,'position'),
                origalLeft = domUtils.getComputedStyle(toolbarBox,'left');
            toolbarBox.style.width = toolbarBox.offsetWidth + 'px';
            toolbarBox.style.zIndex = me.options.zIndex * 1 + 1;
            toolbarBox.parentNode.insertBefore(placeHolder, toolbarBox);
            if (LteIE6 || (quirks && browser.ie)) {
                if(toolbarBox.style.position != 'absolute'){
                    toolbarBox.style.position = 'absolute';
                }
                toolbarBox.style.top = (document.body.scrollTop||document.documentElement.scrollTop) - orgTop + topOffset  + 'px';
            } else {
                if(toolbarBox.style.position != 'fixed'){
                    toolbarBox.style.position = 'fixed';
                    toolbarBox.style.top = topOffset +"px";
                    ((origalFloat == 'absolute' || origalFloat == 'relative') && parseFloat(origalLeft)) && (toolbarBox.style.left = toobarBoxPos.x + 'px');
                }
            }
        }
        function unsetFloating(){

            if(placeHolder.parentNode){
                placeHolder.parentNode.removeChild(placeHolder);
            }
            toolbarBox.style.cssText = bakCssText;
        }

        function updateFloating(){
            var rect3 = getPosition(me.container);
            var offset=me.options.toolbarTopOffset||0;
            if (rect3.top < 0 && rect3.bottom - toolbarBox.offsetHeight > offset) {
                setFloating();
            }else{
                unsetFloating();
            }
        }
        var defer_updateFloating = utils.defer(function(){
            updateFloating();
        },browser.ie ? 200 : 100,true);

        me.addListener('destroy',function(){
            domUtils.un(window, ['scroll','resize'], updateFloating);
            me.removeListener('keydown', defer_updateFloating);
        });

        if(checkHasUI(me)){
            toolbarBox = $('.edui-toolbar',me.container)[0];
            me.addListener("afteruiready",function(){
                setTimeout(function(){
                    orgTop = $(toolbarBox).offset().top;
                },100);
            });
            bakCssText = toolbarBox.style.cssText;
            placeHolder.style.height = toolbarBox.offsetHeight + 'px';
            if(LteIE6){
                fixIE6FixedPos();
            }
            domUtils.on(window, ['scroll','resize'], updateFloating);
            me.addListener('keydown', defer_updateFloating);

            me.addListener('beforefullscreenchange', function (t, enabled){
                if (enabled) {
                    unsetFloating();
                    isFullScreening = enabled;
                }
            });
            me.addListener('fullscreenchanged', function (t, enabled){
                if (!enabled) {
                    updateFloating();
                }
                isFullScreening = enabled;
            });
            me.addListener('sourcemodechanged', function (t, enabled){
                setTimeout(function (){
                    updateFloating();
                },0);
            });
            me.addListener("clearDoc",function(){
                setTimeout(function(){
                    updateFloating();
                },0);

            })
        }
    })


})