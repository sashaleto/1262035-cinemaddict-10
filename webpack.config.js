const MomentLocalesPlugin = require(`moment-locales-webpack-plugin`);
const path = require(`path`);

module.exports = {
  mode: `development`,
  entry: `./src/main.js`,
  output: {
    path: path.resolve(__dirname, `public`),
    filename: `bundle.js`,
  },
  devtool: `source-map`,
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    watchContentBase: true,
  },
  plugins: [
    new MomentLocalesPlugin({
      localesToKeep: [`es-us`],
    })
  ]
};
