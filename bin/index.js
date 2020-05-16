#!/usr/bin/env node

const fs = require('fs');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const copy = require('recursive-copy');
const program = require('commander');
const watch = require('node-watch');
const through = require('through2');

const srcDir = `src`;
const distDir = `mp-target-folder`;

const sass = require('node-sass');
const util = require('util');
const renderSass = util.promisify(sass.render);
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const cssnanoPlugin = cssnano({
  preset: [
    'default',
    {
      calc: false,
    },
  ],
});
const postcssPlugins = [
  require('tailwindcss')('tailwind.config.js'),
  autoprefixer(['iOS >= 8', 'Android >= 4.1']),
  cssnanoPlugin
];
const postcssProcessor = postcss(postcssPlugins);

const compileSass = async (inputPath) => {
  try {
    const a = await renderSass({ file: inputPath });
    const { css } = await postcssProcessor.process(a.css, {
      from: inputPath,
    });
    return css;
  } catch (error) {
    console.error(error);
  }
};

const chalk = require('chalk');
const { CLIEngine } = require('eslint');
const cli = new CLIEngine({ useEslintrc: true });

const lintFiles = (files) => {
  const filesToLint = files.filter((file) => {
    const extension = file.slice(((file.lastIndexOf('.') - 1) >>> 0) + 2);
    return extension === 'js' || extension === 'wxml';
  });
  const report = cli.executeOnFiles(filesToLint);
  const errorReport = CLIEngine.getErrorResults(report.results);
  errorReport.forEach((error) => {
    const path = error.filePath.split('src/')[1];
    error.messages.forEach((msg) => {
      const message = `
  ${chalk.bold(`eslint error: `)}${msg.message} [${msg.ruleId}] 
    @ src/${path}, Ln ${msg.line} Col ${msg.column}`;
      console.log(chalk.red(message));
    });
  });
};

// options for recursive-copy
const options = {
  overwrite: true,
  junk: false,
  transform: (src, dest, stats) => {
    if (/\.scss$/.test(src)) {
      return through(async (chunk, enc, done) => {
        const css = await compileSass(src);
        done(null, css);
      });
    }
    /**
  |--------------------------------------------------
  | @todo: remove comments from JS files
  |--------------------------------------------------
  */
  },
  rename: (filePath) => {
    if (/\.scss$/.test(filePath)) {
      return filePath.replace(/\.scss$/, '.wxss');
    }
    return filePath;
  },
};

program
    .command('run <env>')
    .alias('r')
    .option('-w, --watch', 'watch files changes')
    .description('Build or Watch the version of selected environment')
    .action(function (env, cmd) {
      if (env === 'dev' || env === 'stg' || env === 'prod') {
          console.log('Clean previously files ...');
          rimraf(distDir, () => mkdirp(distDir, async () => {
            console.log('Completed.');
            console.log('Copying the files ...');
            const copyCode = copy(srcDir, distDir, options);
            await Promise.all([copyCode]);
            console.log('Completed.');
            console.log('Copying the constants file ...');
            fs
              .createReadStream(`constants.${env}.js`)
              .pipe(fs.createWriteStream(`${distDir}/project.constants.js`));
            console.log('Completed.');
            if (cmd.mp) {
              console.log('Copying the mini program config file ...');
              fs
              .createReadStream(`env.${env}.json`)
              .pipe(fs.createWriteStream(`${distDir}/project.config.json`));
              console.log('Completed.');
            }
            if (cmd.watch) {
              console.log('Start watching the file changes...');
              watch(srcDir, { recursive: true }, (evt, src) => {
                const targetFileName = src.split('/').slice(1).join('/')
                let destinationPath = `${distDir}/${targetFileName}`;
                console.log(evt, targetFileName);
                if (evt === 'update') {
                  fs.stat(src, async (err, stats) => {
                    if (stats.isFile()) {
                      lintFiles([`src/${targetFileName}`]);
                      if (/\.scss$/.test(targetFileName)) {
                        const css = await compileSass(src);
                        destinationPath = destinationPath.replace(/\.scss$/, '.wxss');
                        // fs.createWriteStream(destinationPath, css);
                        fs.writeFile(destinationPath, css, 'utf8', () => null);
                      } else {
                        fs.createReadStream(src).pipe(fs.createWriteStream(destinationPath));
                      }
                    } else {
                      if (!fs.existsSync(destinationPath)) {
                        fs.mkdirSync(destinationPath);
                      }
                    }
                  });
                } else {
                  rimraf(destinationPath, () => null);
                }        
              });
              watch(`constants.${env}.js`, { recursive: true }, (evt, src) => {
                console.log(evt, `${distDir}/project.constants.js`);
                fs
                  .createReadStream(`project.${env}.constants.js`)
                  .pipe(fs.createWriteStream(`${distDir}/project.constants.js`));       
              });
              watch(`env.${env}.json`, { recursive: true }, (evt, src) => {
                console.log(evt, `${distDir}/project.config.json`);
              fs
                .createReadStream(`env.${env}.json`)
                .pipe(fs.createWriteStream(`${distDir}/project.config.json`));      
              });
            }
          }));
      } else {
        console.error(env +' is an unknown environment params!');
        return
      }
    });

program
    .command('build <env>')
    .alias('b')
    .description('Build the release version')
    .action(function (env, cmd) {
      if (env === 'dev' || env === 'stg' || env === 'prod') {
          console.log('Removing the previously files ...');
          rimraf(distDir, () => mkdirp(distDir, async () => {
            console.log('Completed.');
            console.log('Copying the files ...');
            await copy(srcDir, distDir, options);
            console.log('Completed.');
            console.log('Copying the constants file ...');
            fs
              .createReadStream(`constants.${env}.js`)
              .pipe(fs.createWriteStream(`${distDir}/project.constants.js`));
            console.log('Completed.');
            console.log('Copying the mini program config file ...');
            fs
            .createReadStream(`env.${env}.json`)
            .pipe(fs.createWriteStream(`${distDir}/project.config.json`));
            console.log('Completed.');
          }));
      } else {
        console.error(env +' is an unknown environment params!');
        return
      }
    });

program.parse(process.argv);