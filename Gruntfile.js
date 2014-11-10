'use strict';

module.exports = function ( grunt ) {

    var fs = require("fs"),
        Util = {

            jsBasePath: '_src/',
            cssBasePath: 'themes/default/_css/',

            fetchScripts: function () {

                var sources = require('./export');
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
        encode = 'utf8',
        disDir = "dist/",
        zipName = disDir,
        banner = '/*!\n * UEditor Mini版本\n * version: <%= pkg.version %>\n * build: <%= new Date() %>\n */\n\n';

    //init
    ( function () {

        encode = typeof encode === "string" ? encode.toLowerCase() : 'utf8';

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

        var tasks = [ 'concat', 'cssmin', 'closurecompiler', 'copy:base' ];

        grunt.task.run( tasks );

    } );


};