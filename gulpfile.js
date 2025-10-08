const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();

// Шляхи
const paths = {
    styles: {
        src: 'src/scss/**/*.scss',
        // Компілюємо наш власний SCSS у фінальну папку dist/css
        dest: 'dist/css'
    },
    // Додаємо шляхи для копіювання
    html: 'src/**/*.html',
    js: 'src/js/**/*.js',
    img: 'src/img/**/*',

    // Шляхи до файлів Bootstrap (з node_modules)
    bootstrapCSS: 'node_modules/bootstrap/dist/css/bootstrap.min.css',
    bootstrapJS: 'node_modules/bootstrap/dist/js/bootstrap.min.js'
};

// 1. Таск для копіювання мініфікованого CSS Bootstrap (Вимога 3)
function copyBootstrapCSS() {
    return gulp.src(paths.bootstrapCSS)
        .pipe(gulp.dest('dist/css'));
}

// 2. Таск для копіювання мініфікованого JS Bootstrap (Вимога 3)
function copyBootstrapJS() {
    return gulp.src(paths.bootstrapJS)
        .pipe(gulp.dest('dist/js'));
}

// 3. Таск для копіювання HTML, JS та ЗОБРАЖЕНЬ (для коректної роботи)
function copyOtherFiles() {
    // Копіюємо HTML
    gulp.src(paths.html)
        .pipe(gulp.dest('dist'));

    // Копіюємо JS
    gulp.src(paths.js)
        .pipe(gulp.dest('dist/js'));

    // Копіюємо ЗОБРАЖЕННЯ
    return gulp.src(paths.img)
        .pipe(gulp.dest('dist/img'));
}


// 4. Задача для компіляції нашого SCSS
function style() {
    return gulp.src(paths.styles.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream()); // Додаємо автооновлення CSS
}

// 5. Задача для ініціалізації сервера BrowserSync
function serve(done) {
    browserSync.init({
        server: {
            // ОБСЛУГОВУЄМО ТЕПЕР ФІНАЛЬНУ ПАПКУ DIST
            baseDir: './dist'
        },
        open: true
    });
    done();
}

// 6. Задача для відстеження змін
function watch() {
    gulp.watch(paths.styles.src, style);
    // При зміні HTML/JS/IMG копіюємо файли і перезавантажуємо
    gulp.watch(paths.html, gulp.series(copyOtherFiles, browserSync.reload));
    gulp.watch(paths.js, gulp.series(copyOtherFiles, browserSync.reload));
    gulp.watch(paths.img, gulp.series(copyOtherFiles, browserSync.reload));
}

// Фінальна збірка (запускає все необхідне для створення папки dist)
const build = gulp.series(
    copyBootstrapCSS,
    copyBootstrapJS,
    copyOtherFiles,
    style
);

// Експорт функцій Gulp:
exports.copyBootstrapCSS = copyBootstrapCSS;
exports.copyBootstrapJS = copyBootstrapJS;
exports.style = style;
exports.watch = watch;
exports.build = build;

// Задача 'gulp' за замовчуванням: збірка, запуск сервера та відстеження
exports.default = gulp.series(build, serve, watch);