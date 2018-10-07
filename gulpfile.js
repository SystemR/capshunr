const gulp = require('gulp');
const browserSync = require('browser-sync');
const fs = require('fs');
const spawn = require('child_process').spawn;

//Spawn child process to run npm run watch (basically doing ng build with angular-cli. See package.json)
gulp.task('build', cb => {
  var cmd = spawn('npm', ['run', 'watch'], { stdio: 'inherit' });
  cmd.on('close', code => {
    console.log('Exited ' + code);
  });

  var checkBuildFinishInterval = setInterval(() => {
    //Wait until dist/index.html exists
    if (fs.existsSync('dist/index.html')) {
      cb();
      clearInterval(checkBuildFinishInterval);
    }
  }, 1000);
});

gulp.task('serve', ['build'], () => {
  browserSync({
    ui: false,
    notify: false,
    port: 4330,
    server: {
      baseDir: 'dist/'
    }
  });
  gulp.watch('dist/**/*.css', ['watch:css']);
  // gulp.watch(['dist/**/*', '!dist/**/*.css']).on('change', browserSync.reload);
});

gulp.task('watch:css', () => {
  gulp.src('dist/**/*.css').pipe(browserSync.stream());
});
