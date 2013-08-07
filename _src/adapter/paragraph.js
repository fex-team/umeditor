
UE.registerUI('paragraph ', function( name ) {

    var me = this,
        fontLabel = (me.options.labelMap && me.options.labelMap[name]) || me.getLang("labelMap." + name),
        options = {
            label: fontLabel,
            title: fontLabel,
            items: me.options.paragraph
        },
        paragraph = options.items,
        $paragraphCombobox = null,
        comboboxWidget = null,
        temp = null,
        tempItems = [];

    /* 参数转化 */

    options.itemStyles = [];
    options.value = [];

    options.autowidthitem = [];

    for( var i = 0, len = paragraph.length; i < len; i++ ) {

        temp = paragraph[ i ];

        options.value.push( temp );

        tempItems.push('<'+temp+' style="height:25px;padding:0;margin:0">' + temp+ '</'+temp+'>')

    }

    options.items = tempItems;


    $paragraphCombobox =  $.eduibuttoncombobox(options).css('zIndex',me.getOpt('zIndex') + 1);
    comboboxWidget =  $paragraphCombobox.edui();

    comboboxWidget
        .on('comboboxselect', function( evt, res ){
            me.execCommand( name, res.value );
        }).on("beforeshow", function(){
            if( $paragraphCombobox.parent().length === 0 ) {
                $paragraphCombobox.appendTo(  me.$container.find('.edui-dialog-container') );
            }
        })



    //querycommand
    this.addListener('selectionchange',function( evt ){

        //设置按钮状态
        var state = this.queryCommandState( name );
        comboboxWidget.button().edui().disabled( state == -1 ).active( state == 1 );

        //设置当前字体
        var fontFamily = this.queryCommandValue( name );

        fontFamily = fontFamily.replace(/['"]/g, '').toLowerCase();

        comboboxWidget.selectItemByLabel( fontFamily.split(/['|"]?\s*,\s*[\1]?/) );

    });

    return comboboxWidget.button().addClass('edui-combobox');



});