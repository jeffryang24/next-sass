const cssLoaderConfig = require('@zeit/next-css/css-loader-config')

module.exports = (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      if (!options.defaultLoaders) {
        throw new Error(
          'This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade'
        )
      }

      const { dev, isServer } = options
      const { cssModules, cssLoaderOptions, postcssLoaderOptions, sassLoaderOptions = {} } = nextConfig

      options.defaultLoaders.sass = cssLoaderConfig(config, {
        extensions: ['scss', 'sass'],
        cssModules,
        cssLoaderOptions,
        postcssLoaderOptions,
        dev,
        isServer,
        loaders: [
          {
            loader: 'sass-loader',
            options: sassLoaderOptions
          }
        ]
      })

      const sassRule = Object.assign(
        {},
        {
          test: /\.sass$/,
          use: options.defaultLoaders.sass
        },
        cssModules ? { exclude: /\.module\.sass$/ } : {}
      )
      const scssRule = Object.assign(
        {},
        {
          test: /\.scss$/,
          use: options.defaultLoaders.sass
        },
        cssModules ? { exclude: /\.module\.scss$/ } : {}
      )
      config.module.rules.push(sassRule, scssRule)

      if (cssModules) {
        config.module.rules.push(
          {
            test: /\.module\.sass$/,
            use: options.defaultLoaders.sass
          },
          {
            test: /\.module\.scss$/,
            use: options.defaultLoaders.sass
          }
        )
      }

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options)
      }

      return config
    }
  })
}
