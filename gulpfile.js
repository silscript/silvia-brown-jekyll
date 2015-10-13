var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var cp          = require('child_process');

var messages = {
  jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

// Builds Jekyll site.
gulp.task('jekyll-build', function (done) {
  browserSync.notify(messages.jekyllBuild);
  return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
    .on('close', done);
});

// Rebuild Jekyll and reload page.
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
  browserSync.reload();
});

// Builds Jekyll site and launch server.
gulp.task('browser-sync', ['sass', 'jekyll-build'], function() {
  browserSync({
    server: {
      baseDir: '_site'
    }
  });
});

// Compiles all Sass files.
gulp.task('sass', function () {
  return gulp.src('_sass/main.scss')
    .pipe(sass({
      includePaths: ['scss'],
      onError: browserSync.notify
    }))

    .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
    .pipe(gulp.dest('_site/css'))
    .pipe(browserSync.reload({stream:true}))
    .pipe(gulp.dest('assets/css'));
});

// Watches and recompiles HTML and Sass files.
gulp.task('watch', function () {
  gulp.watch('_sass/main.scss', ['sass']);
  gulp.watch('_sass/vendor/*.scss', ['sass']);
  gulp.watch('_sass/utils/*.scss', ['sass']);
  gulp.watch('_sass/base/*.scss', ['sass']);
  gulp.watch('_sass/layout/*.scss', ['sass']);
  gulp.watch('_sass/components/*.scss', ['sass']);
  gulp.watch('_sass/pages/*.scss', ['sass']);
  gulp.watch('_sass/themes/*.scss', ['sass']);
  gulp.watch(['*.html', '_layouts/*.html', '_posts/*', '_poetry/*', '_portfolio/*'], ['jekyll-rebuild']);
});

// Compiles Jekyll site, Sass files, and launch BrowserSync.
gulp.task('default', ['browser-sync', 'watch']);
