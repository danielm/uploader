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
          src: "src/js/jquery.dm-uploader.js",
          dest: "dist/js/jquery.dm-uploader.min.js"
        }]
      }
    },

    jshint: {
      options: {
        jshintrc: true
      },
      all: [
        "src/js/*.js",
        "Gruntfile.js"
      ]
    },

    cssmin: {
      target: {
        files: {
          "dist/css/jquery.dm-uploader.min.css": ["src/css/*.css"]
        }
      }
    },

    watch: {
      js: {
        files: ["src/js/*.js"],
        tasks: ["jshint", "uglify"],
        options: {
          spawn: false,
        }
      },
      css: {
        files: ["src/css/*.css"],
        tasks: ["cssmin"],
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
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  
  grunt.registerTask("test", ["jshint"]);
  grunt.registerTask("build", ["uglify", "cssmin"]);

  grunt.registerTask("default", ["watch"]);
};