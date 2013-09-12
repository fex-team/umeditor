/*
 * 拖放文件到编辑器，上传并插入
 */
UM.plugins['dropfile'] = function() {
    var me = this;

    me.setOpt('dropFileEnabled', true);

    if( me.getOpt('dropFileEnabled') && window.FormData && window.FileReader) {
        me.addListener('ready', function(){
            me.$body.on('drop',function (e) {
                try{
                    //获取文件列表
                    var fileList = e.originalEvent.dataTransfer.files;
                    var hasImg = false;
                    if(fileList) {
                        $.each(fileList, function (i, f) {
                            if (/^image/.test(f.type)) {
                                var xhr = new XMLHttpRequest();
                                xhr.open("post", me.getOpt('imageUrl'), true);
                                xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

                                //模拟数据
                                var fd = new FormData();
                                fd.append(me.getOpt('imageFieldName') || 'upfile', f);
                                fd.append('type', 'ajax');

                                xhr.send(fd);
                                xhr.addEventListener('load', function (e) {
                                    var picLink = me.getOpt('imagePath') + e.target.response;
                                    if(picLink) {
                                        me.execCommand('insertimage', {
                                            src: picLink,
                                            _src: picLink
                                        });
                                    }
                                });
                                hasImg = true;
                            }
                        });
                        if(hasImg) e.preventDefault();
                    }
                }catch(e){}

            }).on('dragover', function (e) {
                    if(e.originalEvent.dataTransfer.types[0] == 'Files') {
                        e.preventDefault();
                    }
                });
        });
    }
};