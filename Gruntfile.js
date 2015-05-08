module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            js: {
                files: {
                    'production/js/app.min.js': ['develop/js/app.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['newer:uglify:js']);

};