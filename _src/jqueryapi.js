$.fn.umeditor = function( cmd ) {
    var args = arguments.slice(1),
        editor;
    switch(cmd){
        case 'getContent':
            editor = UM.getEditor(container.id);
            editor.execCommand.apply(args);
            break;
        case 'setContent':
            return this.each(function(container, index) {
                var editor = UM.getEditor(container.id);
                editor.execCommand.apply(args);
            });
            break;
        case 'execCommand':
            return this.each(function(container, index) {
                var editor = UM.getEditor(container.id);
                editor.execCommand.apply(args);
            });
            break;
        default:
            return this.each(function(container, index) {
                UM.getEditor(container.id);
            });
    }
};