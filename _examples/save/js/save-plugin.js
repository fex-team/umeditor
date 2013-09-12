/**
 * “保存功能”插件的行为
 */

//注册一个名为“save”的插件
UM.plugins['save'] = function () {

    UM.commands[ 'save' ] = {

        execCommand: function (cmdName) {

            //在这里实现具体的命令的行为
            //当调用 editor.execCommand("save") 时， 该方法就会被调用
            //保存功能的实际代码由用户自己实现

            alert("触发保存功能");

        },
        queryCommandState: function (cmdName) {

            //这里返回只能是 1, 0, -1
            //1代表当前命令已经执行过了
            //0代表当前命令未执行
            //-1代表当前命令不可用

            //在这里总是返回0， 这样做可以使保存按钮一直可点击
            return 0;
        },
        //声明该插件不支持“撤销／保存”功能， 这样就不会触发ctrl+z 和ctrl+y的记忆功能
        notNeedUndo: 1

    };

};
