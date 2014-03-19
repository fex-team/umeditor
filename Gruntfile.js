'use strict';

module.exports = function ( grunt ) {

    var fs = require("fs"),
        Util = {

            jsBasePath: '_src/',
            cssBasePath: 'themes/default/_css/',

            fetchScripts: function () {

                var sources = fs.readFileSync( "_examples/editor_api.js" );
                sources = /\[([^\]]+\.js'[^\]]+)\]/.exec( sources );
                sources = sources[1].replace( /\/\/.*[\n\r]/g, '\n' ).replace( /'|"|\n|\t|\s/g, '' );
                sources = sources.split( "," );
                sources.forEach( function ( filepath, index ) {
                    sources[ index ] = Util.jsBasePath + filepath;
                } );

                return sources;
            },

            fetchStyles: function () {

                var sources = fs.readFileSync( this.cssBasePath + "umeditor.css" ),
                    filepath = null,
                    pattern = /@import\s+([^;]+)*;/g,
                    src = [];

                while ( filepath = pattern.exec( sources ) ) {
                    src.push( this.cssBasePath + filepath[ 1 ].replace( /'|"/g, "" ) );
                }

                return src;

            }

        },
        pkg = grunt.file.readJSON('package.json'),
        server = grunt.option('server') || 'php',
        encode = grunt.option('encode') || 'utf8',
        disDir = "dist/",
        zipName = disDir,
        banner = '/*!\n * UEditor Mini版本\n * version: <%= pkg.version %>\n * build: <%= new Date() %>\n */\n\n';

    //init
    ( function () {

        server = typeof server === "string" ? server.toLowerCase() : 'php';
        encode = typeof encode === "string" ? encode.toLowerCase() : 'utf8';

        disDir = disDir + encode + '-' + server + '/';
        zipName = zipName + pkg.name + pkg.version.replace(/\./g, '_') + '-' + encode + '-' + server + '.zip';

    } )();

    grunt.initConfig( {
        pkg: pkg,
        concat: {
            js: {
                options: {
                    banner: banner + '(function($){\n\n',
                    footer: '\n\n})(jQuery)'
                },
                src: Util.fetchScripts(),
                dest: disDir + '<%= pkg.name %>.js'
            },
            css: {
                src: Util.fetchStyles(),
                dest: disDir + 'themes/default/css/umeditor.css'
            }
        },
        cssmin: {
            options: {
                banner: banner
            },
            files: {
                expand: true,
                cwd: disDir + 'themes/default/css/',
                src: ['*.css', '!*.min.css'],
                dest: disDir + 'themes/default/css/',
                ext: '.min.css'
            }
        },
        closurecompiler: {
            dist: {
                src: disDir + '<%= pkg.name %>.js',
                dest: disDir + '<%= pkg.name %>.min.js'
            }
        },
        copy: {
            base: {
                files: [
                    {
                        src: [ 'themes/default/images/**', 'dialogs/**', 'third-party/**', 'lang/**' ],
                        dest: disDir

                    }
                ]
            },
            demo: {
                files: [
                    {
                        src: '_examples/completeDemo.html',
                        dest: disDir + 'index.html'
                    }
                ]
            },
            php: {

                expand: true,
                src: 'php/**',
                dest: disDir

            },
            asp: {

                expand: true,
                src: 'asp/**',
                dest: disDir

            },
            jsp: {

                expand: true,
                src: 'jsp/**',
                dest: disDir

            },
            net: {

                expand: true,
                src: 'net/**',
                dest: disDir

            }
        },
        transcoding: {

            options: {
                charset: encode
            },
            src: [
                disDir + '*.js',
                disDir + 'dialogs/*.js',
                disDir + 'lang/*.js',
                disDir + '**/*.js',
                disDir + '**/*.js',
                disDir + '**/*.js',
                disDir + '**/*.js',
                disDir + '**/*.html',
                disDir + '**/*.css',
                disDir + '**/*.jsp',
                disDir + '**/*.java',
                disDir + '**/*.php',
                disDir + '**/*.asp',
                disDir + '**/*.ashx',
                disDir + '**/*.cs'
            ]

        },
        replace: {

            fileEncode: {
                src: [ disDir+'**/*.html', disDir+'**/*.css', disDir+'**/*.php', disDir+'**/*.jsp', disDir+'**/*.net', disDir+'**/*.asp' ],
                overwrite: true,
                replacements: [ {
                    from: /utf-8/gi,
                    to: 'gbk'
                } ]
            },
            demo:{
                src: disDir+'index.html',
                overwrite: true,
                replacements: [ {
                    from: /\.\.\//gi,
                    to: ''
                },{
                    from: 'editor_api.js',
                    to: '<%= pkg.name %>.min.js'
                },{
                    from: '_css',
                    to: 'css'
                } ]
            },
            gbkasp:{

                src: [ disDir+'asp/*.asp' ],
                overwrite: true,
                replacements: [ {
                    from: /65001/gi,
                    to: '936'
                } ]
            }

        },
        compress: {
            main: {
                options: {
                    archive: zipName
                },
                expand: true,
                cwd: disDir,
                src: ['**/*']
            }
        }

    } );

    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-closurecompiler');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-transcoding');
    grunt.loadNpmTasks('grunt-contrib-compress');

    grunt.registerTask('default', 'UEditor Mini build', function () {

        var tasks = [ 'concat', 'cssmin', 'closurecompiler', 'copy:base', 'copy:'+server, 'copy:demo', 'replace:demo' ];

        if ( encode === 'gbk' ) {
            tasks.push( 'replace:fileEncode' );
            if(server === 'asp') {
                tasks.push( 'replace:gbkasp' );
            }
        }

        tasks.push( 'transcoding' );

        //config修改
        updateConfigFile();

        grunt.task.run( tasks );

    } );


    function updateConfigFile () {

        var filename = 'umeditor.config.js',
            file = grunt.file.read( filename ),
            path = server + "/",
            suffix = server === "net" ? ".ashx" : "."+server;

        file = file.replace( /php\//ig, path ).replace( /\.php/ig, suffix );

        //写入到dist
        if ( grunt.file.write( disDir + filename, file ) ) {

            grunt.log.writeln( 'config file update success' );

        } else {
            grunt.log.warn('config file update error');
        }

    }

};