const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './index.js',
  output: {
    filename: 'dist.js',
    path: path.resolve(__dirname, '@CMAKE_RUNTIME_OUTPUT_DIRECTORY@/js')
  },
  resolve: { modules: ['node_modules', path.resolve(__dirname, "@CMAKE_BINARY_DIR@/node/node_modules")] },
  //modules: [path.resolve(__dirname, "@CMAKE_BINARY_DIR@/node/node_modules"), "node_modules"],
  plugins: [
    new webpack.DefinePlugin({
      EM_APPLICATION_NAME: '"@EM_BINARY_NAME@"',
      EM_GAPI_CLIENT_ID: '"@EM_GAPI_CLIENT_ID@"',
      EM_GAPI_SCOPES: '"@EM_GAPI_SCOPES@"',
    })
  ]
};
