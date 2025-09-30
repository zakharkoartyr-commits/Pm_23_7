const { src, dest, watch, series, parallel } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const newer = require("gulp-newer");
const imagemin = require("gulp-imagemin");
const imageminMozjpeg = require("imagemin-mozjpeg");
const imageminPngquant = require("imagemin-pngquant");

function imgTask() {
    return src("app/img/**/*")
        .pipe(newer("dist/imgs"))
        .pipe(
            imagemin([
                imageminMozjpeg({ quality: 75 }),
                imageminPngquant({ quality: [0.6, 0.8] })
            ])
        )
        .pipe(dest("dist/imgs"))
        .pipe(browserSync.stream());
}

const browserSync = require("browser-sync").create();

// Шляхи
const paths = {
    html: "app/html/**/*.html",
    scss: "app/scss/**/*.scss",
    js: "app/js/**/*.js",
    img: "app/img/**/*",
    dist: "dist",
};

// Таск для HTML
function htmlTask() {
    return src(paths.html)
        .pipe(dest(paths.dist))
        .pipe(browserSync.stream());
}

// Таск для SCSS → CSS
function scssTask() {
    return src(paths.scss)
        .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
        .pipe(concat("style.min.css"))
        .pipe(dest(paths.dist + "/css"))
        .pipe(browserSync.stream());
}

// Таск для JS
function jsTask() {
    return src(paths.js)
        .pipe(concat("script.min.js"))
        .pipe(uglify())
        .pipe(dest(paths.dist + "/js"))
        .pipe(browserSync.stream());
}

// Таск для картинок
function imgTask() {
    return src(paths.img)
        .pipe(imagemin())
        .pipe(dest(paths.dist + "/imgs"))
        .pipe(browserSync.stream());
}

// BrowserSync
function serve() {
    browserSync.init({
        server: {
            baseDir: paths.dist,
        },
    });

    watch(paths.html, htmlTask);
    watch(paths.scss, scssTask);
    watch(paths.js, jsTask);
    watch(paths.img, imgTask);
}

// Експорти
exports.html = htmlTask;
exports.scss = scssTask;
exports.js = jsTask;
exports.img = imgTask;
exports.default = series(
    parallel(htmlTask, scssTask, jsTask, imgTask),
    serve
);
