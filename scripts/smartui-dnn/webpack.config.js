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
    '@pipocook/core': 'commonjs2 @pipcook/core',
    '@tensorflow/tfjs-node': 'commonjs2 @tensorflow/tfjs-node',
    '@tensorflow/tfjs-node-gpu': 'commonjs2 @tensorflow/tfjs-node-gpu',
    '@pipcook/boa': 'commonjs2 @pipcook/boa'
  },
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "[name].js",
    libraryTarget: 'umd'
  },
  mode: 'development'
};
