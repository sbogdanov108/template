/**
 * Created by Sergey on 04.07.2015.
 */

'use strict';

var gulp         = require( 'gulp' ),
    notify       = require( 'gulp-notify' ),
    //webserver    = require( 'gulp-webserver' ),
    autoprefixer = require( 'gulp-autoprefixer' ),
    sass         = require( 'gulp-sass' ),
    concat       = require( 'gulp-concat' ),
    del          = require( 'del' ),
    csso         = require( 'gulp-csso' ), // минификация css
    uglifyJs     = require( 'gulp-uglify' ),  // минификация js;
    rename       = require( "gulp-rename" );

var bc    = './bower_components/',
    notBc = './not_bower/';

// отслеживание всех js файлов в директории

gulp.task( 'js', function()
{
  gulp.src( 'builds/development/app/**/*.js' )
    .pipe( concat( 'app.concat.js' ) )
    .pipe( gulp.dest( 'builds/dist/app/' ) )
} );

// отслеживание всех html файлов в проекте

gulp.task( 'html', function()
{
  del( 'builds/dist/**/*.html' ).then( function()
  {
    gulp.src( 'builds/development/**/*.html' )
      .pipe( gulp.dest( 'builds/dist/' ) )
  } )
} );

// отслеживание шрифтов в директории

gulp.task( 'fonts', function()
{
  del( 'builds/dist/fonts/' ).then( function()
  {
    gulp.src( 'builds/development/fonts/**/*' )
      .pipe( gulp.dest( 'builds/dist/fonts/' ) );
  } )
} );

// отслеживание всех sass файлов в директории

gulp.task( 'sass', function()
{
  gulp.src( 'builds/development/sass/**/*' )
    .pipe( sass().on( 'error', notify.onError(
      {
        message: "<%= error.message %>",
        title  : "Sass error!"
      } ) )
  )
    .pipe( autoprefixer() )
    .pipe( concat( 'styles.concat.css' ) )
    .pipe( gulp.dest( 'builds/dist/css/' ) )
    .pipe( notify( 'SASS - good work!' ) );
} );

gulp.task( 'img', function()
{
  del( 'builds/dist/img' ).then( function()
  {
    gulp.src( 'builds/development/img/**/*' )
      .pipe( gulp.dest( 'builds/dist/img/' ) );
  } );
} );

// вытащить нужные библиотеки из bower в билд

gulp.task( 'libs', function()
{
  // css
  // genericons

  gulp.src( notBc + 'genericons/*' )
    .pipe( gulp.dest( './builds/dist/libs/genericons/' ) );

  // bootstrap

  gulp.src( bc + 'bootstrap/dist/css/bootstrap.css' )
    .pipe( gulp.dest( './builds/dist/libs/bootstrap/css/' ) );

  // js
  // jquery

  gulp.src( bc + 'jquery/dist/jquery.js' )
    .pipe( gulp.dest( './builds/dist/libs/jquery/' ) );

  // bootstrap

  gulp.src( [
    bc + 'bootstrap/js/affix.js',
    bc + 'bootstrap/js/tooltip.js'
  ] )
    .pipe( concat( 'bootstrap.concat.js' ) )
    .pipe( gulp.dest( './builds/dist/libs/bootstrap/' ) );

  // папку с дистрибутивом
  // gulp.src( bc + 'bootstrap/dist/**/*.*' )
  //    .pipe( gulp.dest( './builds/dist/libs/bootstrap/' ) );
} );

/*gulp.task( 'webserver', function()
 {
 gulp.src( 'builds/dist/' )
 .pipe( webserver( {
 livereload: true,
 open      : true,
 port      : 8001
 } ) );
 } );*/

// сделать билд

gulp.task( 'buildProduction', function()
{
  del( 'builds/production/*' ).then( function()
  {
    // js

    gulp.src( [
      'builds/dist/libs/jquery/*.js',
      'builds/dist/libs/bootstrap/*.js',
      'builds/dist/app/app.concat.js'
    ] )
      .pipe( concat( 'app.concat.js' ) )
      .pipe( gulp.dest( 'builds/production/js/' ) )
      .pipe( uglifyJs() )
      .pipe( rename( 'app.min.js' ) )
      .pipe( gulp.dest( 'builds/production/js/' ) );

    // css

    gulp.src( [
      'builds/dist/libs/bootstrap/css/bootstrap.css',
      'builds/dist/libs/genericons/genericons.css',
      'builds/dist/css/styles.concat.css'
    ] )
      .pipe( concat( 'styles.concat.css' ) )
      .pipe( gulp.dest( 'builds/production/css/' ) )
      .pipe( csso() )
      .pipe( rename( 'styles.min.css' ) )
      .pipe( gulp.dest( 'builds/production/css/' ) );

    // fonts

    gulp.src( 'builds/dist/fonts/**/*' )
      .pipe( gulp.dest( 'builds/production/fonts/' ) );

    // img

    gulp.src( 'builds/dist/img/**/*' )
      .pipe( gulp.dest( 'builds/production/img/' ) );

    // html

    gulp.src( 'builds/dist/*.html' )
      .pipe( gulp.dest( 'builds/production/' ) );
  } );
} );

// watch

gulp.task( 'watch', function()
{
  gulp.watch( 'builds/development/app/**/*.js', [ 'js' ] );
  gulp.watch( 'builds/development/sass/**/*.scss', [ 'sass' ] );
  gulp.watch( 'builds/development/**/*.html', [ 'html' ] );
  gulp.watch( 'builds/development/img/**/*', [ 'img' ] );
  gulp.watch( 'builds/development/fonts/**/*', [ 'fonts' ] );
} );

// default

gulp.task( 'default', [
  'js',
  'libs',
  'html',
  'img',
  'fonts',
  'sass',
  'watch'
  //'webserver',
] );

/* Uglify JS */

gulp.task( 'uglifyJs', function()
{
  // return возвращает поток. Для последовательного исполнения задач.
  // Далее указывается порядок подключения скриптов
  return gulp.src( [
      'uglify/js/ajax.js',
      'uglify/js/app.js',
      '!uglify/js/*.min.js' // Исключить все минифицированные файлы
    ] )
    .pipe( concat( 'temp.concat.js' ) )
    .pipe( gulp.dest( 'uglify/done/js/' ) )
    .pipe( uglifyJs() )
    .pipe( rename( 'temp.min.js' ) )
    .pipe( gulp.dest( 'uglify/done/js/' ) );
} );

// Этот таск вызывает минификацию скриптов, затем делает конкатенацию сжатых скриптов
gulp.task( 'concatJsMain', [ 'uglifyJs' ], function()
{
  gulp.src( [
      'uglify/js/jquery.min.js',
      'uglify/done/js/temp.min.js'
    ] )
    .pipe( concat( 'app.min.js' ) )
    .pipe( gulp.dest( 'uglify/done/js/' ) );
} );

/* Uglify CSS */

gulp.task( 'uglifyCss', function()
{
  // return возвращает поток. Для последовательного исполнения задач.
  // Далее указывается порядок подключения css
  return gulp.src( [
      'uglify/css/styles.css',
      '!uglify/css/*.min.js' // Исключить все минифицированные файлы
    ] )
    .pipe( autoprefixer() )
    .pipe( concat( 'temp.concat.css' ) )
    .pipe( gulp.dest( 'uglify/done/css/' ) )
    .pipe( csso() )
    .pipe( rename( 'temp.min.css' ) )
    .pipe( gulp.dest( 'uglify/done/css/' ) );
} );

// Этот таск вызывает минификацию css, затем делает конкатенацию сжатых css
gulp.task( 'concatCssMain', [ 'uglifyCss' ], function()
{
  gulp.src( [
      'uglify/css/bootstrap.min.css',
      'uglify/css/font-awesome.min.css',
      'uglify/done/css/temp.min.css'
    ] )
    .pipe( concat( 'app.min.css' ) )
    .pipe( gulp.dest( 'uglify/done/css/' ) );
} );