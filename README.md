# Mini Program boilerplate

This project is aimmed at launching a Mini Program project with more official rules and standard.

Tips: This is NOT a mini program framework or the best practices to mini program development but just a tool helps to develop mini program project more easier and quickly.

### Features

```
Node Builder support
SCSS compiler
Tailwind Support (part of)
Prettier
Eslint
Gulp
Typescript Support [WIP]
Unit Test component [WIP]
Mini Program build uploader
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
6. Open the `mp-target-folder` folder from `Wechat Development Tool` to preview the mini program screen
7. Edit your code from `src`

If you have mutile mini account like dev account or prod account, you could specify you mini program config files to the file `env.${YOUR-ENVIRONMENT}.json` like `env.dev.json` or `env.prod.jsonn`

if you wish to switch the mini program account, change the `scripts` section from package.json and specify the name.

## Deployment

run `npm run build-dev` or `npm run build-stg` or `npm run build-prod` to build the final release files. 
The final files for releasing are under folder `mp-target-folder`


## Versioning

Version: v2.0.0 (last updated at 2020-05-16)
Version: v1.0.0 (last updated at 2019-02-11)

## Authors

Liu Cheng <liucheng@flyingant.me>