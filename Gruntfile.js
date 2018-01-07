module.exports = function(grunt) {
"use strict";

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    uglify: {
      options: {
        output: {
          comments: "some"
        }
      },
      build: {
        files: [{
          src: "src/jquery.dmuploader.js",
          dest: "dist/jquery.dmuploader.min.js"
        }]
      }
    },

    jshint: {
      options: {
        jshintrc: true
      },
      all: [
        "src/*.js",
        "Gruntfile.js"
      ]
    },

    watch: {
      js: {
        files: ["src/*.js"],
        tasks: ["jshint", "uglify"],
        options: {
          spawn: false,
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-watch");
  
  grunt.registerTask("default", ["watch"]);
};