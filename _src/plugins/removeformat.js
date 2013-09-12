UM.plugins['removeformat'] = function(){
    var me = this;
    me.commands['removeformat'] = {
        execCommand : function(  ) {
            this.document.execCommand('removeformat');
        }
    };

};

