const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './index.js',
  output: {
    filename: 'dist.js',
    path: path.resolve(__dirname, '@CMAKE_RUNTIME_OUTPUT_DIRECTORY@/js')
  },
  plugins: [
    new webpack.DefinePlugin({
      EM_APPLICATION_NAME: '"@EM_BINARY_NAME@"',
    })
  ]
};
