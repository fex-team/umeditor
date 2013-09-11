/**
 * 创建按钮
 */

UM.registerUI('save', function( name ){

    //该方法里的this指向编辑器实例

    var me = this,

        //实例化一个UMEDITOR提供的按钮对象
        $button = $.eduibutton({
            //按钮icon的名字， 在这里会生成一个“edui-icon-save”的className的icon box，
            //用户可以重写该className的background样式来更改icon的图标
            //覆盖示例见btn.css
            'icon': 'save',
            'title': me.options.lang === "zh-cn" ? "保存" : "save",
            'click': function(){
                //在这里处理按钮的点击事件
                //点击之后执行save命令
                me.execCommand( name );
            }
        });

    //在这里处理保存按钮的状态反射
    me.addListener( "selectionchange", function () {

        //检查当前的编辑器状态是否可以使用save命令
        var state = this.queryCommandState( name );

        //如果状态表示是不可用的( queryCommandState()的返回值为-1 )， 则要禁用该按钮
        $button.edui().disabled( state == -1 ).active( state == 1 );

    } );

    //返回该按钮对象后， 该按钮将会被附加到工具栏上
    return $button;

});