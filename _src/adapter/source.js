UE.ready(function(){
    var me = this;
    me.addListener('fullscreenchanged',function(type,state){
        me.$container.find('textarea').width(me.$container.width() - 10).height(me.$container.height())

    })
});