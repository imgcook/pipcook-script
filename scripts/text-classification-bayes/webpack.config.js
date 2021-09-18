const path = require('path');

module.exports = {
  target: "node",
  entry: {
    datasource: ["./src/datasource.ts"],
    model: ["./src/model.js"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ],
  },
  resolve: {
    extensions: [ '.ts', '.js' ]
  },
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "[name].js",
    libraryTarget: 'umd'
  },
  externals: {
    '@pipcook/core': 'commonjs2 @pipcook/core',
    '@node-rs/jieba': 'commonjs2 @node-rs/jieba',
    // the backend is set by the framework initializer, the backend in the script should be replace by tfjs-core.
    '@tensorflow/tfjs-core': 'commonjs2 @tensorflow/tfjs-core',
    '@tensorflow/tfjs-node': 'commonjs2 @tensorflow/tfjs',
    '@tensorflow/tfjs-node-gpu': 'commonjs2 @tensorflow/tfjs'
  },
  mode: 'development'
};
