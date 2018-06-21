const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const run = require('gulp-run');

gulp.task('release', function () {
    return run('npm run release').exec();
});

gulp.task('default', function () {
    browserSync.init({
        server: {
            baseDir: '.',
            index: 'test/index.html'
        },
        https: true
    });
    
    gulp.watch(['out/**'], ['release']);
    gulp.watch(['release/dev/**'],  browserSync.reload)
});
