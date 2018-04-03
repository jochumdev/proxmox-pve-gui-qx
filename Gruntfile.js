// grunt
module.exports = function(grunt) {
    require("time-grunt")(grunt);

    var config = {
      uglify: {
        fetch: {
          files: {
            "source/resource/proxmox/js/fetch.min.js": ["node_modules/whatwg-fetch/fetch.js"]
          }
        }
      },
      copy: {
        fontawesome: {
          files: [
            {expand: true, flatten: true, src: ["node_modules/font-awesome/css/font-awesome.css"], dest: "source/resource/proxmox/css/"},
            {expand: true, flatten: true, src: ["node_modules/font-awesome/css/font-awesome.css.map"], dest: "source/resource/proxmox/css/"},
            {expand: true, flatten: true, src: ["node_modules/font-awesome/css/font-awesome.min.css"], dest: "source/resource/proxmox/css/"},

            {expand: true, flatten: true, src: ["node_modules/font-awesome/fonts/fontawesome-webfont.eot"], dest: "source/resource/proxmox/fonts/"},
            {expand: true, flatten: true, src: ["node_modules/font-awesome/fonts/fontawesome-webfont.svg"], dest: "source/resource/proxmox/fonts/"},
            {expand: true, flatten: true, src: ["node_modules/font-awesome/fonts/fontawesome-webfont.ttf"], dest: "source/resource/proxmox/fonts/"},
            {expand: true, flatten: true, src: ["node_modules/font-awesome/fonts/fontawesome-webfont.woff"], dest: "source/resource/proxmox/fonts/"},
            {expand: true, flatten: true, src: ["node_modules/font-awesome/fonts/fontawesome-webfont.woff2"], dest: "source/resource/proxmox/fonts/"},
            {expand: true, flatten: true, src: ["node_modules/font-awesome/fonts/FontAwesome.otf"], dest: "source/resource/proxmox/fonts/"},
          ]
        }
      }
    };
    grunt.initConfig(config);

    grunt.loadNpmTasks("grunt-newer");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask("default", [
      "newer:uglify:fetch",
      "newer:copy:fontawesome"
    ]);
  };
