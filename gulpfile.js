const del = require('del');
const gulp = require('gulp');
const less = require('gulp-less');
const babel = require('gulp-babel');
const debug = require('gulp-debug');
const concat = require('gulp-concat');
const copy = require('gulp-copy');
const through = require('through2');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

const SRC = './src';
const BUILD = './build';
const PUBLIC = './src';
const paths = {
    build: {
        root: `${BUILD}/`,
        css: `${BUILD}/css/`,
        img: `${BUILD}/img/`,
        js: `${BUILD}/js/`,
    },
    src: {
        css: `${SRC}/css/**/*.css`,
        js: `${SRC}/js/**/*.js`,
        img: `${SRC}/img/**/*`,
        public: `${PUBLIC}/*.*`,
    },
    compileWatch: {
        css: `${SRC}/css/**/*.css`,
        js: `${SRC}/js/**/*.js`,
        img: `${SRC}/img/**/*`,
        html: `${PUBLIC}/*.html`,
    },
    reloadWatch: {
        css: `${BUILD}/**/*.css`,
        js: `${BUILD}/**/*.js`,
        img: `${BUILD}/img/**/*`,
        html: `${BUILD}/*.html`,
    },
};

const verify = () => {
    const write = (file, enc, cb) => {
        console.log('file', file.path);
        cb(null, file);
    };

    const end = cb => {
        console.log('done');
        cb();
    };

    return through({objectMode: true}, write, end);
};

const styles = (paths, outputFilename, outputPath) => {
    return gulp
        .src(paths)
        .pipe(debug({title: 'css:'}))
        .pipe(concat(outputFilename))
        .pipe(gulp.dest(outputPath));
};

const scripts = (paths, outputFilename, outputPath) => {
    return gulp
        .src(paths)
        .pipe(debug({title: 'js:'}))
        // .pipe(babel({presets: ['@babel/preset-env']}))
        .pipe(concat(outputFilename))
        .pipe(debug({title: 'jsconcat:'}))
        .pipe(gulp.dest(outputPath));
};

gulp.task('clean', () => del([paths.build.root], {dot: true}));

gulp.task('copy', () => {
    return gulp
        .src(paths.src.public)
        .pipe(copy(paths.build.root, {prefix: 1}))
        .pipe(verify());
});

gulp.task('styles', callback => {
    styles([paths.src.css], 'styles.css', paths.build.css);
    callback();
});

gulp.task('scripts', callback => {
    scripts([paths.src.js], 'index.js', paths.build.js, false);
    callback();
});

gulp.task('img', () => {
    return gulp.src(paths.src.img, {since: gulp.lastRun('img')}).pipe(gulp.dest(paths.build.img));
});

gulp.task('build', gulp.series('clean', 'copy', gulp.parallel('styles', 'img', 'scripts')));

gulp.task('watch', () => {
    gulp.watch(paths.compileWatch.css, gulp.series('styles'));
    gulp.watch(paths.compileWatch.js, gulp.series('scripts'));
    gulp.watch(paths.compileWatch.img, gulp.series('img'));
    gulp.watch(paths.compileWatch.html, gulp.series('copy'));
});

gulp.task('serve', () => {
    browserSync.init({
        server: {
            baseDir: './build/',
        },
    });

    browserSync.watch(paths.reloadWatch.css).on('change', reload);
    browserSync.watch(paths.reloadWatch.js).on('change', reload);
    browserSync.watch(paths.reloadWatch.img).on('change', reload);
    browserSync.watch(paths.reloadWatch.html).on('change', reload);
});

gulp.task('default', gulp.series('build', gulp.parallel('watch', 'serve')));
