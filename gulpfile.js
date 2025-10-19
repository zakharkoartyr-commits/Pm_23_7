// Підключаємо основні модулі
const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');

// Таск для компіляції SCSS в CSS
const styles = () => {
    return src('app/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(dest('dist/css'))
        .pipe(browserSync.stream());
};

// Таск для копіювання HTML
const html = () => {
    return src('app/*.html')
        .pipe(dest('dist'))
        .pipe(browserSync.reload({ stream: true }));
};

// ВАША ТАСКА ДЛЯ ОПТИМІЗАЦІЇ ЗОБРАЖЕНЬ
const img_task = () => {
    return src('app/img/**/*', { encoding: false })
        .pipe(imagemin())
        .pipe(dest('dist/img'));
};

// Таск для запуску сервера і стеження за змінами
const watchFiles = () => {
    browserSync.init({
        server: {
            baseDir: "./dist"
        },
        browser: "chrome"
    });

    watch('app/scss/**/*.scss', styles);
    watch('app/*.html', html);
    watch('app/img/**/*', img_task).on('change', browserSync.reload);
};

// Експортуємо таски для використання
exports.styles = styles;
exports.html = html;
exports.img_task = img_task; // Експортуємо вашу таску
exports.watch = watchFiles;

// Таск за замовчуванням
exports.default = series(parallel(html, img_task, styles), watchFiles);

