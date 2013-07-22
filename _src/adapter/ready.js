/**
 * 编辑器ready统一入口
 */
UE.ready(function(){
    var T = this;
    this.addListener('click',function(){
        T.$container.find('.dropdown-menu').each(function(){
            $(this).edui().hide()
        })
    })

});
