module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            js: {
                files: {
                    'production/js/app.min.js': ['develop/js/app.js']
                }
            }
        }, concat: {
            options: {
                separator: ';',
            },
            dist: {
                src: ['develop/css/style.css', 'bower_components/bootstrap/dist/css/bootstrap.min.css'],
                dest:'production/css/all.css',
            },
        }, cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'production/css/all.min.css': ['production/css/all.css']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('default', ['newer:uglify:js', 'newer:concat', 'newer:cssmin']);

};