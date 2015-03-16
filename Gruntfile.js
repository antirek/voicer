module.exports = function(grunt) {

    grunt.initConfig({
        default: {

        },
        jasmine_node: {
            coverage: {
                options : {
                    failTask: true,
                    branches: 60 ,
                    functions: 60,
                    statements: 60,
                    lines: 60
                }
            },
            options: {
                forceExit: true,
                match: '.',
                matchall: false,
                extensions: 'js',
                specNameMatcher: 'spec',
                junitreport: {
                    report: false,
                    savePath : "./build/",
                    useDotNotation: true,
                    consolidate: true
                },
                unit: ['./spec/'],
                functional: ['./spec/']    
            }
        }
    });
     
    grunt.loadNpmTasks('grunt-jasmine-node-istanbul');
    grunt.registerTask('default', 'jasmine_node');

};