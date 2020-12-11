/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-vars */
const chalk = require('chalk');
const { task, src, dest, watch, series } = require('gulp');
const del = require('del');
const makeDir = require('make-dir');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const prettier = require('gulp-prettier');
const eslint = require('gulp-eslint');

const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const tailwindcss = require('tailwindcss');

const log = (...args) => console.log(...args);

const PROJECT_DIR = '.';
const DIST_DIR = 'dist';
const SOURCE_DIR = 'src';

// config the cssnamo
const cssnanoPlugin = cssnano({
  preset: [
    'default',
    {
      calc: false,
    },
  ],
});

// creating the dist directory
task('make-dir', () => {
  return makeDir(`${DIST_DIR}`);
});

// clean the dist directory
task('delete-dir', () => {
  return del(`${DIST_DIR}`, { force: true });
});

// compile the sass to css with TailwindCSS framework and then rename to the .wxss
task('compile-sass-with-tailwind', () => {
  return src(`${SOURCE_DIR}/**/*.scss`)
    .pipe(sass().on('error', sass.logError))
    .pipe(
      postcss([
        tailwindcss('tailwind.config.js'),
        autoprefixer(['iOS >= 8', 'Android >= 4.1']),
        cssnanoPlugin,
      ]),
    )
    .pipe(replace('*{--tw-shadow:0 0 transparent}', '.no-shadow{--tw-shadow:0 0 transparent}')) // Replace the common shadow to no-shadow to prevent MP WXSS syntax error
    .pipe(
      replace(
        '*{--tw-ring-inset:var(--tw-empty,/*!*/ /*!*/)',
        '.inset-empty{--tw-ring-inset:var(--tw-empty,/*!*/ /*!*/)',
      ),
    ) // Replace the common inset to inset-empty to prevent MP WXSS syntax error
    .pipe(rename({ extname: '.wxss' }))
    .pipe(dest(`${DIST_DIR}`));
});

// compile the sass to css and then rename to the .wxss
task('compile-sass', () => {
  return src(`${SOURCE_DIR}/**/*.scss`)
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer(['iOS >= 8', 'Android >= 4.1']), cssnanoPlugin]))
    .pipe(rename({ extname: '.wxss' }))
    .pipe(dest(`${DIST_DIR}`));
});
// copy the source code
task('copy-source-code', () => {
  return src([
    `${PROJECT_DIR}/${SOURCE_DIR}/**/*.js`,
    `${PROJECT_DIR}/${SOURCE_DIR}/**/*.wxml`,
    `${PROJECT_DIR}/${SOURCE_DIR}/**/*.json`,
    `${PROJECT_DIR}/${SOURCE_DIR}/**/*.jpg`,
    `${PROJECT_DIR}/${SOURCE_DIR}/**/*.jpeg`,
    `${PROJECT_DIR}/${SOURCE_DIR}/**/*.png`,
    `${PROJECT_DIR}/${SOURCE_DIR}/**/*.svg`,
  ]).pipe(dest(`${DIST_DIR}`));
});

// copy the env DEVELOPMENT constants
task('copy-dev-constants', () => {
  return src(`${PROJECT_DIR}/constants.dev.js`)
    .pipe(rename('constants.env.js'))
    .pipe(dest(`${DIST_DIR}`));
});
// copy the env STAGING constants
task('copy-stg-constants', () => {
  return src(`${PROJECT_DIR}/constants.stg.js`)
    .pipe(rename('constants.env.js'))
    .pipe(dest(`${DIST_DIR}`));
});
// copy the env UAT constants
task('copy-uat-constants', () => {
  return src(`${PROJECT_DIR}/constants.uat.js`)
    .pipe(rename('constants.env.js'))
    .pipe(dest(`${DIST_DIR}`));
});
// copy the env PRODUCTION constants
task('copy-prod-constants', () => {
  return src(`${PROJECT_DIR}/constants.prod.js`)
    .pipe(rename('constants.env.js'))
    .pipe(dest(`${DIST_DIR}`));
});
// copy mini program config
task('copy-mp-config', () => {
  return src(`${PROJECT_DIR}/mp.config.json`)
    .pipe(rename('project.config.json'))
    .pipe(dest(`${DIST_DIR}`));
});

// watch changes for Development
task('watch-dev', () => {
  watch(
    [
      `${PROJECT_DIR}/${SOURCE_DIR}/**/*.js`,
      `${PROJECT_DIR}/${SOURCE_DIR}/**/*.wxml`,
      `${PROJECT_DIR}/${SOURCE_DIR}/**/*.json`,
      `${PROJECT_DIR}/${SOURCE_DIR}/**/*.jpg`,
      `${PROJECT_DIR}/${SOURCE_DIR}/**/*.jpeg`,
      `${PROJECT_DIR}/${SOURCE_DIR}/**/*.png`,
      `${PROJECT_DIR}/${SOURCE_DIR}/**/*.svg`,
    ],
    {
      delay: 1000,
    },
    series('copy-source-code'),
  ).on('change', (path) => {
    log(`File ${path} was changed`);
  });
  watch(
    `${PROJECT_DIR}/${SOURCE_DIR}/**/*.scss`,
    {
      delay: 1000,
    },
    series('compile-sass-with-tailwind'),
  ).on('change', (path) => {
    log(`File ${path} was changed`);
  });
});
// validate
task('validate', () => {
  return src([
    `${PROJECT_DIR}/${SOURCE_DIR}/**/*.js`,
    `!${PROJECT_DIR}/${SOURCE_DIR}/libs/**/*.js`, // exclude the validation from lib folder
  ])
    .pipe(
      prettier.check({
        printWidth: 100,
        tabWidth: 2,
        semi: true,
        arrowParens: 'always',
        singleQuote: true,
        trailingComma: 'all',
      }),
    )
    .pipe(eslint())
    .pipe(
      eslint.result((result) => {
        log(`ESLint result: ${result.filePath}`);
        log(`# Messages: ${result.messages.length}`);
        log(`# Warnings: ${result.warningCount}`);
        log(`# Errors: ${result.errorCount}`);
      }),
    )
    .pipe(
      eslint.results((results) => {
        log(`${chalk.blue('Total Results:')} ${results.length}`);
        log(`${chalk.blue('Total Warnings:')} ${results.warningCount}`);
        log(`${chalk.blue('Total Errors:')} ${results.errorCount}`);
      }),
    );
});
// build Development source code
task(
  'build-dev',
  series(
    'delete-dir',
    'make-dir',
    'copy-source-code',
    'compile-sass-with-tailwind',
    'copy-dev-constants',
    'copy-mp-config',
  ),
);
// build Staging source code
task(
  'build-stg',
  series(
    'delete-dir',
    'make-dir',
    'copy-source-code',
    'compile-sass-with-tailwind',
    'copy-stg-constants',
    'copy-mp-config',
  ),
);
// build UAT source code
task(
  'build-uat',
  series(
    'delete-dir',
    'make-dir',
    'copy-source-code',
    'compile-sass-with-tailwind',
    'copy-uat-constants',
    'copy-mp-config',
  ),
);
// build PROD source code
task(
  'build-prod',
  series(
    'delete-dir',
    'make-dir',
    'copy-source-code',
    'compile-sass-with-tailwind',
    'copy-prod-constants',
    'copy-mp-config',
  ),
);
