const path = require('path');

module.exports = {
  target: "node",
  entry: {
    model: ["./src/model.ts"],
    datasource: ["./src/datasource.ts"]
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
  externals: {
    '@pipcook/core': 'commonjs2 @pipcook/core',
    '@pipcook/boa': 'commonjs2 @pipcook/boa',
    '@tensorflow/tfjs-node': 'commonjs2 @tensorflow/tfjs-node',
    '@tensorflow/tfjs-node-gpu': 'commonjs2 @tensorflow/tfjs-node-gpu',
  },
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "[name].js",
    libraryTarget: 'umd'
  },
  mode: 'development'
};
