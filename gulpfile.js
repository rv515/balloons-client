import gulp from "gulp";
import htmlmin from "gulp-htmlmin";
import postcss from "gulp-postcss";
import pimport from "postcss-import";
import autoprefixer from "autoprefixer";
import csso from "postcss-csso";
import replace from "gulp-replace";
import terser from "gulp-terser";
import babel from "gulp-babel";
import BrowserSync from "browser-sync";

// HTML
const html = () =>
    gulp
        .src("src/*.html")
        .pipe(
            htmlmin({
                removeComments: true,
                collapseWhitespace: true,
            })
        )
        .pipe(gulp.dest("dist"))
        .pipe(BrowserSync.stream());

// Styles
const styles = () =>
    gulp
        .src("src/styles/index.css")
        .pipe(postcss([pimport, autoprefixer, csso]))
        .pipe(replace(/\.\.\//g, ""))
        .pipe(gulp.dest("dist/styles"))
        .pipe(BrowserSync.stream());

// Scripts
const scripts = () =>
    gulp
        .src("src/scripts/index.js")
        .pipe(
            babel({
                presets: ["@babel/preset-env"],
            })
        )
        .pipe(terser())
        .pipe(gulp.dest("dist/scripts"))
        .pipe(BrowserSync.stream());

// Copy Images
const copyImages = () =>
    gulp
        .src("src/images/**/*.{png,jpg,jpeg,webp,avif}")
        .pipe(gulp.dest("dist/images"))
        .pipe(
            BrowserSync.stream({
                once: true,
            })
        );

// Copy Fonts
const copyFonts = () =>
    gulp
        .src("src/fonts/**/*.{ttf,woff,woff2}")
        .pipe(gulp.dest("dist/fonts"))
        .pipe(
            BrowserSync.stream({
                once: true,
            })
        );

// Watch
const watch = () => {
    gulp.watch("src/*.html", gulp.series(html));
    gulp.watch("src/styles/**/*.css", gulp.series(styles));
    gulp.watch("src/scripts/**/*.js", gulp.series(scripts));
    gulp.watch(
        "src/images/**/*.{png,jpg,jpeg,webp,avif}",
        gulp.series(copyImages)
    );
    gulp.watch("src/fonts/**/*.{ttf,woff,woff2}", gulp.series(copyFonts));
};

// Server
const server = () =>
    BrowserSync.init({
        ui: false,
        notify: false,
        server: { baseDir: "dist" },
    });

export default gulp.series(
    gulp.parallel(html, styles, scripts, copyImages, copyFonts, watch, server)
);
