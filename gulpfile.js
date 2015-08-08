/**
 * Created by Sergey on 04.07.2015.
 */

'use strict';

var gulp = require('gulp'),
    notify = require('gulp-notify'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    mainBowerFiles = require('main-bower-files');

// css
gulp.task('css', function ()
{
    return gulp.src('scss/*.scss')
        .pipe(sass(
            {
                outputStyle: 'expanded'
            })
            .on('error', notify.onError(
            {
                message: "<%= error.message %>",
                title: "Error!"
            })
        ))
        .pipe(autoprefixer())
        .pipe(gulp.dest('app/assets/css'))
        .pipe(notify('Good work!'));
});

// watch
gulp.task('watch', ['css'], function ()
{
    gulp.watch('scss/**', ['css']);
});

// default
gulp.task('default', ['watch']);

// get main js files from bower
gulp.task('mainJS', function ()
{
    return gulp.src(mainBowerFiles('**/*.js'))
        .pipe(gulp.dest('app/assets/js'))
});

// get main css files from bower
gulp.task('mainCSS', function ()
{
    return gulp.src(mainBowerFiles('**/*.css'))
        .pipe(gulp.dest('app/assets/css'))
});