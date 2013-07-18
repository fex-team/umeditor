/**
 * node.js tpl转js工具
 * 使用方式
 * node compiler.js input.tpl
 * node compiler.js --input input.tpl --output output.js
 */

(function(){

    var fs = require('fs'),
        args = process.argv.splice( 2 );

    //init
    (function(){

        args = parseArgs( args );

        //读取输入
        fs.readFile( args.inputFile, {
            encoding: 'utf-8',
            flag: 'r'
        }, function( err, data ){

            if( err ) {
                throw err;
            }

            data = parseData( data );

            fs.writeFile( args.outputFile, data, function( err ){

                if( err ) {
                    throw err;
                }

                console.log( '转换成功， 新的文件是: ' + args.outputFile );

            } );

        } );

    })();

    /**
     * 解析输入的模板数据
     * @param data 模板数据
     */
    function parseData( data ) {

        var matchArr = [];

        data = data.split('\n');

        data.forEach(function( text, index ){

            matchArr = [];

            text = text.replace( /<var\s+id=('|")([^\1]+)\1[^>]*><\/var>/g, function(){
                return '<%='+ arguments[2] +'%>';
            } );

            //提取出tpl的标签
            text = text.replace( /<%[\s\S]*?%>/g, function( match ){

                var replaceNum = matchArr.length;

                matchArr.push( match );

                return '{$'+ replaceNum +'}';

            } );

            //转义
            text = escapeData( text );

            text = text.replace( /\{\$(\d+)\}/g, function( match, index ){

                return matchArr[ index ];

            } );

            //缩进保存
            text = text.replace( /^\s*/, function( match ){

                return match + '"';

            } );

            //删除尾空格
            text = text.replace( /\s*$/, '' );

            data[ index ] = text + '"';

        });

        return data.join(" + \n");

    }

    /**
     * 转义给定的数据
     * @param data 需要转义的数据
     * @returns {string} 返回转义过后的数据
     */
    function escapeData( data ) {

        return data.replace( /('|"|\\)/g, function( match ) {

            return '\\' + match;

        } );

    }

    /**
     * 解析参数
     * @param args
     */
    function parseArgs( args ) {

        if ( args.length === 1 ) {

            var output = args[0].split('.');

            return {
                inputFile: args[0],
                outputFile: ( output.slice( 0, output.length - 1 ).join('.') || output.join('.') ) + '.js'
            };

        } else if ( args.length > 1 ) {

            if( args[0] !== '--input' || args[2] !== '--output' ) {

                throw new Error('invalid arguments');

            } else {

                return {
                    inputFile: args[1],
                    outputFile: args[3]
                };

            }

        } else {
            throw new Error('invalid arguments');
        }

    }

})();