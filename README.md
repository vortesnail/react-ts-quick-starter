# 现在的是 webpack5 + react17 + Typescript 搭建版本

> 分支为 `master`

往下翻可查看当前这版与上一版配置不同的点，大同小异。

<details>
<summary>点击查看差异点</summary>

## ESLint 和 Prettier 的冲突

之前是只下载 [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) 这个插件，并在 `.eslintrc.js` 中的配置如下：

```js
{
  extends: [
    // other configs ...
    'prettier',
    'prettier/@typescript-eslint',
    'prettier/react',
    'prettier/unicorn',
  ]
}
```

但根据[官方推荐](https://github.com/prettier/eslint-plugin-prettier#recommended-configuration)配置方法，既需要下载 [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) 也需要下载 [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier)，然后配置更简洁了：

```js
{
  extends: [
    // other extends ...
    'plugin:prettier/recommended',
  ],
  plugins: [
    // other plugins,
    'prettier'
  ],
}
```

## husky 版本注意

上一个版本使用的是 `husky@4` 版本，这个版本仍然选择使用该版本，`husky@5` 有点问题，不好用，大家安装的时候注意，当然你也可以好好研究下最新版。

## 路径定义文件

在上一个版本中，我们是通过 `path.resolve(__dirname, '../')` 拿到项目根路径，然后使用的时候比如：

```js
{
  entry: {
    app: resolve(PROJECT_PATH, './src/index.tsx'),
  },
}
```

现在独立出了一个专门导出路径的文件 `paths.js` ：

```js
const path = require('path');
const fs = require('fs');

// Get the working directory of the file executed by node
const appDirectory = fs.realpathSync(process.cwd());

/**
 * Resolve absolute path from relative path
 * @param {string} relativePath relative path
 */
function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath);
}

// Default module extension
const moduleFileExtensions = ['ts', 'tsx', 'js', 'jsx'];

/**
 * Resolve module path
 * @param {function} resolveFn resolve function
 * @param {string} filePath file path
 */
function resolveModule(resolveFn, filePath) {
  // Check if the file exists
  const extension = moduleFileExtensions.find((ex) => fs.existsSync(resolveFn(`${filePath}.${ex}`)));

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }
  return resolveFn(`${filePath}.ts`); // default is .ts
}

module.exports = {
  appBuild: resolveApp('build'),
  appPublic: resolveApp('public'),
  appIndex: resolveModule(resolveApp, 'src/index'), // Package entry path
  appHtml: resolveApp('public/index.html'),
  appNodeModules: resolveApp('node_modules'), // node_modules path
  appSrc: resolveApp('src'),
  appSrcComponents: resolveApp('src/components'),
  appSrcUtils: resolveApp('src/utils'),
  appProxySetup: resolveModule(resolveApp, 'src/setProxy'),
  appPackageJson: resolveApp('package.json'),
  appTsConfig: resolveApp('tsconfig.json'),
  moduleFileExtensions,
};
```

## 环境变量文件

之前的环境变量定义在`constants.js` 中，现在我独立出了一个文件 `env.js` ：

```js
const isDevelopment = process.env.NODE_ENV !== 'production';
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  isDevelopment,
  isProduction,
};
```

## 一些常用的变量配置文件

类似 `constants.js` 文件，现在更改为了 `conf.js` ，配置有稍许的不同：

```js
const path = require('path');

const PROJECT_PATH = path.resolve(__dirname, '../');
const PROJECT_NAME = path.parse(PROJECT_PATH).name;

// Dev server host and port
const SERVER_HOST = 'localhost';
const SERVER_PORT = 9000;

// Whether to enable bundle package analysis
const shouldOpenAnalyzer = false;
const ANALYZER_HOST = 'localhost';
const ANALYZER_PORT = '8888';

// Resource size limit
const imageInlineSizeLimit = 4 * 1024;

module.exports = {
  PROJECT_PATH,
  PROJECT_NAME,
  SERVER_HOST,
  SERVER_PORT,
  shouldOpenAnalyzer,
  ANALYZER_HOST,
  ANALYZER_PORT,
  imageInlineSizeLimit,
};
```

## 自定义 `webpack-dev-server` 启动服务

上一个版本中我们没对 `webpack-dev-server` 做任何处理，就一些简单的配置，但是这个版本中，我们实现了两个主要功能：

- 自定义控制台输出，更美观、直观。
- 当前端口占用，自动 port + 1 。

这部分实现就是 `scripts/server` 下的文件们实现的，有兴趣简单看看，不难。

另外，现在脚本执行命令就可以写为：

```sh
"scripts": {
  "start": "cross-env NODE_ENV=development node scripts/server",
},
```

## devtool 配置变化

这个版本中，为了使用错误日志遮罩插件 [error-overlay-webpack-plugin](https://github.com/smooth-code/error-overlay-webpack-plugin)，开环境下的 devtool 设为了 `cheap-module-source-map`，生产环境下原来是 `'none'`，现在应该改为 `false`。

## less 不再默认支持

上一个版本我们默认支持 `less` 和 `sass` ，因为两者配置太过于类似，出于我自己的习惯，这个版本我只配置了 `sass`，有兴趣的，参考下也能把 `less` 加上。

## postcss 配置变化

如下：

```js
{
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      plugins: [
        require('postcss-flexbugs-fixes'),
        isProduction && [
          'postcss-preset-env',
          {
            autoprefixer: {
              grid: true,
              flexbox: 'no-2009',
            },
            stage: 3,
          },
        ],
      ].filter(Boolean),
    },
  },
},
```

## 图片和字体文件处理

之前使用 `file-loader` ，但是 `webpack5` 现在已默认内置资源模块，根据官方配置，现在可以改为以下配置方式，不再需要安装额外插件：

```js
module.exports = {
  output: {
    // ...
    assetModuleFilename: 'images/[name].[contenthash:8].[ext]',
  },
  // other...
  module: {
    rules: [
      // other...
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024,
          },
        },
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2?)$/,
        type: 'asset/resource',
      },
    ]
  },
  plugins: [//...],
}
```

## public 下资源复制问题

之前版本中 `html-webpack-plugin` 这个插件是不会自动打包 `index.hmtl` 文件的，但是这个版本它会在打包的时候（生产环境下会压缩）将 `index.html` 输出到 `build` 中，那我们使用 `copy-webpack-plugin` 插件时，需要将 `index.html` 忽视：

```js
new CopyPlugin({
  patterns: [
    {
      context: paths.appPublic,
      from: '*',
      to: paths.appBuild,
      toType: 'dir',
      globOptions: {
        dot: true,
        gitignore: true,
        ignore: ['**/index.html'],
      },
    },
  ],
}),
```

## 使用默认缓存

之前我们通过使用插件 `hard-source-webpack-plugin` 实现缓存，大大加快二次编译速度，但是我实际在使用过程中，该插件还是会造成一些问题，控制台一堆报红。

万幸的是 `webpack5` 现在默认支持缓存，我们只需要以下配置即可：

```js
module.exports = {
  //...
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  },
  //...
};
```

## css 代码压缩

之前使用的是 `optimize-css-assets-webpack-plugin` 来对 css 文件进行压缩，现在推荐使用 [css-minimizer-webpack-plugin](https://webpack.docschina.org/plugins/css-minimizer-webpack-plugin/#root)。

</details>

<hr>

# 以下是 webpack4 + React16 + Typescript 搭建版本

> 分支是 `webpack4+React16`。

自己搭的 React + Typescript 项目开发环境，也写了文章作为记录：

- [我是这样搭建 Typescript+React 项目环境的！（2.7w 字详解)](https://github.com/vortesnail/blog/issues/14)

该脚手架经过本人在生产环境的使用，具备可用性，而且由于自己塔的，非常灵活，希望大家也能学会自己搭一套自己的脚手架。

欢迎大家阅读，评论，star！

# 其它实用插件

- 如果你要开启 css module，想要通过 `className={styles['xxxxx]}` 能得到提示（比如 `xxxxx`），那你可能需要这个插件：[typescript-plugin-css-modules](https://github.com/mrmckeb/typescript-plugin-css-modules)。
