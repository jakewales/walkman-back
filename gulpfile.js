const gulp = require('gulp');
const webpack = require('webpack-stream'); // https://www.npmjs.com/package/webpack-stream
const webpackConfig = require('./webpack.config.js');
// gulp-nodemon config et. https://github.com/remy/nodemon/blob/master/doc/sample-nodemon.md
// gulp-nodemon watch directories https://github.com/JacksonGariety/gulp-nodemon/issues/73

gulp.task('webpack', function() {
    return gulp.src('./src/index.ts')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('dist/'));
});
