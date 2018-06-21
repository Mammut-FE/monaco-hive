const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const run = require('gulp-run');

gulp.task('release-watch', ['release'], browserSync.reload);

gulp.task('release', function () {
    return run('npm run release').exec();
});

gulp.task('default', function () {
    browserSync.init({
        server: {
            baseDir: '.',
            index: 'test/index.html'
        }
    });
    
    gulp.watch(['out/**'], ['release-watch']);
});
