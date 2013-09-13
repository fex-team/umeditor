'use strict';

module.exports = function ( grunt ) {

    var fs = require("fs"),
        Util = {

            jsBasePath: '_src/',
            cssBasePath: 'themes/default/_css/',

            fetchScripts: function () {

                var sources = fs.readFileSync( "_examples/editor_api.js", {
                        encoding: 'utf-8'
                    } );

                sources = /\[([^\]]+)\]/.exec( sources );

                sources = sources[1].replace( /'|"|\n|\t|\s/g, '' );

                sources = sources.split( "," );

                sources.forEach( function ( filepath, index ) {

                    sources[ index ] = Util.jsBasePath + filepath;

                } );

                return sources;

            },

            fetchStyles: function () {

                var sources = fs.readFileSync( this.cssBasePath + "umeditor.css", {
                        encoding: 'utf-8'
                    } ),
                    filepath = null,
                    pattern = /@import\s+([^;]+)*;/g,
                    src = [];

                while ( filepath = pattern.exec( sources ) ) {

                    src.push( this.cssBasePath + filepath[ 1 ].replace( /'|"/g, "" ) );

                }

                return src;

            }

        },
        server = grunt.option('server') || 'php',
        encode = grunt.option('encode') || 'utf8',
        disDir = "dist/",
        banner = '/*!\n * UEditor Mini版本\n * version: <%= pkg.version %>\n * build: <%= new Date() %>\n */\n\n';

    //init
    ( function () {

        server = server.toLowerCase();
        encode = encode.toLowerCase();

        disDir = 'dist-' + encode + '-' + server + '/';

    } )();

    grunt.initConfig( {
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            js: {
                options: {
                    banner: banner + '(function(){\n\n',
                    footer: '\n\n})()'
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
        uglify: {
            options: {
                banner: banner
            },
            dest: {
                src: disDir + '<%= pkg.name %>.js',
                dest: disDir + '<%= pkg.name %>.min.js'
            }
        },
        copy: {
            base: {
                files: [
                    {

                        expand: true,
                        src: [ 'themes/default/images/**', 'dialogs/**', 'lang/**' ],
                        dest: disDir

                    }, {

                        src: 'umeditor.config.js',
                        dest: disDir,
                        filter: 'isFile'

                    }
                ]
            },
            php: {

                expand: true,
                src: 'php/**',
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
        'grunt-iconv-lite': {

            'gbk': {
                options: {
                    fromEncoding: "utf8",
                    toEncoding: "GBK"
                },
                files: {
                    'dist/test': [disDir + '**/*.js', disDir + '**/*.jsp', disDir + '**/*.java', disDir + '**/*.php', disDir + '**/*.ashx', disDir + '**/*.cs']
                }
            }
        }

    } );

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-iconv-lite');


    var tasks = [ 'concat', 'cssmin', 'uglify', 'copy:base', 'copy:'+server ];

    if ( encode !== 'utf8' ) {

        tasks.push( 'grunt-iconv-lite' );

    }

    grunt.registerTask('default', tasks );

};