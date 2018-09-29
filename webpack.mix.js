const mix = require('laravel-mix');


mix
  .js('index.js', 'dist/')
  .sass('style.scss', 'dist/')
  .browserSync({
    proxy: false,
    injectChanges: true,
    server: {
      baseDir: './',
      index: 'index.html',
    },
    files: ['./*.*']
  });
