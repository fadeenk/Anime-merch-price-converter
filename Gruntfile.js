
module.exports = function(grunt) {

  //include the grunt libs
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-replace');

  grunt.initConfig({
    //get application data
    app: grunt.file.readJSON('package.json'),
    //get the header file
    headers: grunt.file.read('src/header.js'),
    //name of the dist file
    scriptName: 'AMPC.user',
    //combine all source code into a file in dist folder
    concat: {
      dist: {
        src: ['src/**/*.js'],
        dest: 'dist/<%= scriptName %>.js'
      }
    },
    //js-hint for syntax errors prevents stupid mistakes
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js'],
      options: {
        reporter: require('jshint-stylish'),
        jshintrc: '.jshintrc',
      }
    },
    //replace updates the headers based on the package.json
    replace: {
      dist: {
        options: {
          patterns: [
            {
              match: 'version',
              replacement: '<%= app.version %>'
            },{
              match: 'name',
              replacement: '<%= app.name %>'
            },{
              match: 'description',
              replacement: '<%= app.description %>'
            }
          ],
        },
        files: [
          {expand: true, flatten: false, src: ['dist/*.js']}
        ]
      },
    }
  });

  //default task runs jshint
  grunt.registerTask('default', ['jshint']);
  //build task compiles the code and creates js file in dist
  grunt.registerTask('build', ['jshint','concat','replace']);
};
