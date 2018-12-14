#!/usr/bin/env node

const fs = require('fs');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const copydir = require('copy-dir');
const program = require('commander');
const watch = require('node-watch')

const buildDir = `build`;
const srcDir = `src`;
const distDir = `dist`;
const MPConfigDir = `mp-config`;

program
    .command('run <env>')
    .alias('r')
    .option('-w, --watch', 'watch files changes')
    .option('-m, --mp <name>', 'target mini program name')
    .description('Build or Watch the version of selected environment')
    .action(function (env, cmd) {
      if (env === 'dev' || env === 'stg' || env === 'prod') {
          console.log('Removing the previously files ...');
          rimraf(buildDir, () => mkdirp(buildDir, () => {
            console.log('Completed.');
            console.log('Copying the files ...');
            copydir.sync(srcDir, buildDir);
            console.log('Completed.');
            console.log('Copying the constants file ...');
            fs
              .createReadStream(`project.${env}.constants.js`)
              .pipe(fs.createWriteStream(`${buildDir}/project.constants.js`));
            console.log('Completed.');
            if (cmd.mp) {
              console.log('Copying the mini program config file ...');
              fs
              .createReadStream(`${MPConfigDir}/${cmd.mp}.project.config.json`)
              .pipe(fs.createWriteStream(`${buildDir}/project.config.json`));
              console.log('Completed.');
            }
            if (cmd.watch) {
              console.log('Start watching the file changes...');
              watch(srcDir, { recursive: true }, (evt, src) => {
                const targetFileName = src.split('/').slice(1).join('/')
                const destinationPath = `${buildDir}/${targetFileName}`;
                console.log(evt, targetFileName);
                if (evt === 'update') {
                  fs.stat(src, (err, stats) => {
                    if (stats.isFile()) {
                      fs.createReadStream(src).pipe(fs.createWriteStream(destinationPath))
                    } else {
                      if (!fs.existsSync(destinationPath)){
                        fs.mkdirSync(destinationPath)
                      }
                    }
                  })
                } else {
                  rimraf(destinationPath, () => null);
                }        
              });
              watch(`project.${env}.constants.js`, { recursive: true }, (evt, src) => {
                console.log(evt, `${buildDir}/project.constants.js`);
                fs
                  .createReadStream(`project.${env}.constants.js`)
                  .pipe(fs.createWriteStream(`${buildDir}/project.constants.js`));       
              });
              if (cmd.mp) {
                watch(`${MPConfigDir}/${cmd.mp}.project.config.json`, { recursive: true }, (evt, src) => {
                    console.log(evt, `${buildDir}/project.config.json`);
                  fs
                    .createReadStream(`${MPConfigDir}/${cmd.mp}.project.config.json`)
                    .pipe(fs.createWriteStream(`${buildDir}/project.config.json`));      
                  });
                }
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
    .option('-m, --mp <name>', 'target mini program name')
    .description('Build the release version')
    .action(function (env, cmd) {
      if (env === 'dev' || env === 'stg' || env === 'prod') {
          console.log('Removing the previously files ...');
          rimraf(distDir, () => mkdirp(distDir, () => {
            console.log('Completed.');
            console.log('Copying the files ...');
            copydir.sync(srcDir, distDir);
            console.log('Completed.');
            console.log('Copying the constants file ...');
            fs
              .createReadStream(`project.${env}.constants.js`)
              .pipe(fs.createWriteStream(`${distDir}/project.constants.js`));
            console.log('Completed.');
            if (cmd.mp) {
              console.log('Copying the mini program config file ...');
              fs
              .createReadStream(`${MPConfigDir}/${cmd.mp}.project.config.json`)
              .pipe(fs.createWriteStream(`${distDir}/project.config.json`));
              console.log('Completed.');
            }
          }));
      } else {
        console.error(env +' is an unknown environment params!');
        return
      }
    });

program.parse(process.argv);