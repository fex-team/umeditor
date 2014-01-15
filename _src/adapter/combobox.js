
UM.registerUI('paragraph fontfamily fontsize', function( name ) {

    var me = this,
        label = (me.options.labelMap && me.options.labelMap[name]) || me.getLang("labelMap." + name),
        options = {
            label: label,
            title: label,
            comboboxName: name,
            items: me.options[ name ] || [],
            itemStyles: [],
            value: [],
            autowidthitem: []
        },
        $combox = null,
        comboboxWidget = null;
    if(options.items.length == 0){
        return null;
    }
    switch ( name ) {

        case 'paragraph':
            options = transForParagraph( options );
            break;

        case 'fontfamily':
            options = transForFontfamily( options );
            break;

        case 'fontsize':
            options = transForFontsize( options );
            break;

    }

    //实例化
    $combox =  $.eduibuttoncombobox(options).css('zIndex',me.getOpt('zIndex') + 1);
    comboboxWidget =  $combox.edui();

    comboboxWidget.on('comboboxselect', function( evt, res ){
                        me.execCommand( name, res.value );
                    }).on("beforeshow", function(){
                        if( $combox.parent().length === 0 ) {
                            $combox.appendTo(  me.$container.find('.edui-dialog-container') );
                        }
                        UM.setTopEditor(me);
                    });


    //状态反射
    this.addListener('selectionchange',function( evt ){

        var state  = this.queryCommandState( name ),
            value = this.queryCommandValue( name );

        //设置按钮状态
        comboboxWidget.button().edui().disabled( state == -1 ).active( state == 1 );
        if(value){
            //设置label
            value = value.replace(/['"]/g, '').toLowerCase().split(/['|"]?\s*,\s*[\1]?/);

            comboboxWidget.selectItemByLabel( value );
        }


    });

    return comboboxWidget.button().addClass('edui-combobox');

    /**
     * 宽度自适应工具函数
     * @param word 单词内容
     * @param hasSuffix 是否含有后缀
     */
    function wordCountAdaptive ( word, hasSuffix ) {

        var $tmpNode = $('<span>' ).html( word ).css( {
                display: 'inline',
                position: 'absolute',
                top: -10000000,
                left: -100000
            } ).appendTo( document.body),
            width = $tmpNode.width();

        $tmpNode.remove();
        $tmpNode = null;

        if( width < 50 ) {

            return word;

        } else {

            word = word.slice( 0, hasSuffix ? -4 : -1 );

            if( !word.length ) {
                return '...';
            }

            return wordCountAdaptive( word + '...', true );

        }

    }


    //段落参数转换
    function transForParagraph ( options ) {

        var tempItems = [];

        for( var key in options.items ) {

            options.value.push( key );
            tempItems.push( key );
            options.autowidthitem.push( wordCountAdaptive( key ) );

        }

        options.items = tempItems;
        options.autoRecord = false;

        return options;

    }

    //字体参数转换
    function transForFontfamily ( options ) {

        var temp = null,
            tempItems = [];

        for( var i = 0, len = options.items.length; i < len; i++ ) {

            temp = options.items[ i ].val;
            tempItems.push( temp.split(/\s*,\s*/)[0] );
            options.itemStyles.push('font-family: ' + temp);
            options.value.push( temp );
            options.autowidthitem.push( wordCountAdaptive( tempItems[ i ] ) );

        }

        options.items = tempItems;

        return options;

    }

    //字体大小参数转换
    function transForFontsize ( options ) {

        var temp = null,
            tempItems = [];

        options.itemStyles = [];
        options.value = [];

        for( var i = 0, len = options.items.length; i < len; i++ ) {

            temp = options.items[ i ];
            tempItems.push( temp );
            options.itemStyles.push('font-size: ' + temp +'px');

        }

        options.value = options.items;
        options.items = tempItems;
        options.autoRecord = false;

        return options;

    }

});


UM.registerUI('forecolor backcolor', function( name ) {
    function getCurrentColor() {
        return domUtils.getComputedStyle( $colorLabel[0], 'background-color' );
    }

    var me = this,
        $colorPickerWidget = null,
        $colorLabel = null,
        $btn = null;

    //querycommand
    this.addListener('selectionchange', function(){

        var state = this.queryCommandState( name );
        $btn.edui().disabled( state == -1 ).active( state == 1 );

    });

    $btn = $.eduicolorsplitbutton({
        icon: name,
        caret: true,
        name: name,
        title: me.getLang("labelMap")[name],
        click: function() {
            me.execCommand( name, getCurrentColor() );
        }
    });

    $colorLabel = $btn.edui().colorLabel();

    $colorPickerWidget = $.eduicolorpicker({
        name: name,
        lang_clearColor: me.getLang('clearColor') || '',
        lang_themeColor: me.getLang('themeColor') || '',
        lang_standardColor: me.getLang('standardColor') || ''
    })
        .on('pickcolor', function( evt, color ){
            window.setTimeout( function(){
                $colorLabel.css("backgroundColor", color);
                me.execCommand( name, color );
            }, 0 );
        })
        .on('show',function(){
            UM.setActiveWidget( colorPickerWidget.root() );
        }).css('zIndex',me.getOpt('zIndex') + 1);

    $btn.edui().on('arrowclick',function(){
        if(!$colorPickerWidget.parent().length){
            me.$container.find('.edui-dialog-container').append($colorPickerWidget);
        }
        $colorPickerWidget.edui().show($btn,{
            caretDir:"down",
            offsetTop:-5,
            offsetLeft:8,
            caretLeft:11,
            caretTop:-8
        });
        UM.setTopEditor(me);
    }).register('click', $btn, function () {
            $colorPickerWidget.edui().hide()
        });

    return $btn;

});