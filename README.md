# Mini Program boilerplate 

`Mini Program Boilerplate` is a tool (based on NodeJS) help to devlop/build the mini program under different environments (dev, staging, prod) and different mini program account.

### Features

```
Node Builder support
SCSS
Prettier
Eslint
autoprefixer
```

### Prerequisites

```
Node

Yarn or NPM
```

### Installing

1. Clone the code
2. Run `npm install` or `yarn install` under root directory
3. Create a new mini program project from the `Wechat Development Tool`
4. Copy all generated files from `Wechat Development Tool` to the folder `src`
5. Run `npm run dev`
6. Open the `build` folder from `Wechat Development Tool` to preview the mini program screen
7. Edit your code from `src`

If you have mutile mini account like dev account or prod account, you could specify you mini program config files to the folder `/mp-config` and give a prefix to config file, like `test.proejct.config.json` or `app.project.config.json`

if you wish to switch the mini program account, change the `scripts` section from package.json and specify the name.

## Deployment

run `npm run build-dev` or `npm run build-staging` or `npm run build-prod` to build the final release files. 
The final files for releasing are under folder `dist`


## Versioning

Version: v1.0.0 (last updated at 2019-02-11)

## Authors

Liu Cheng <liucheng@flyingant.me>

## Acknowledgments

