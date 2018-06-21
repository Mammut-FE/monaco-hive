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
        https: true,
        middleware: function (req, res, next) {
            if (req.url.endsWith('monaco-editor-core/release/dev/hiveWorker.js')) {
                res.writeHead(302, {
                    'Location': '/release/dev/hiveWorker.js'
                });
                res.end();
            }
            next();
        }
    });
    
    gulp.watch(['out/**'], ['release']);
    gulp.watch(['release/dev/**'], browserSync.reload);
});
