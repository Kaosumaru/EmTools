const path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    filename: 'dist.js',
    path: path.resolve(__dirname, '@CMAKE_RUNTIME_OUTPUT_DIRECTORY@/js')
  }
};
