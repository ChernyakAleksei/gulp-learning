grunt.initConfig({
  sass: {
    dist: {
      files: [{
        expand: true,
        src: 'dev/*.scss', // обрабатываем все scss файлы
        dest: '.tmp/styles', // записываем результат обработки
        ext: '.css'
      }]
    }
  },
  autoprefixer: {
    dist: {
      files: [{
        expand: true,
        src: '{,*/}*.css',
        cwd: '.tmp/styles', // обрабатываем *.css файлы после scss плагина
        dest: 'css/styles' // записываем результат
      }]
    }
  },
  watch: {
    styles: {
      files: ['dev/*.scss'],
      tasks: ['sass:dist', 'autoprefixer:dist']
    }
  }
});
grunt.registerTask('default', ['styles', 'watch']);
