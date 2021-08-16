const path = require('path');

module.exports = {
  target: "node",
  entry: {
    // model: ["./src/model.ts"],
    // dataflow: ["./src/dataflow.ts"],
    // datasource: ["./src/datasource.ts"]
    model: ["./dist/model.js"],
    dataflow: ["./dist/dataflow.js"],
    datasource: ["./dist/datasource.js"]
  },
  // module: {
  //   rules: [
  //     {
  //       test: /\.tsx?$/,
  //       use: 'ts-loader',
  //       exclude: /node_modules/,
  //     }
  //   ],
  // },
  resolve: {
    extensions: [ '.ts', '.js' ]
  },
  externals: {
    '@pipocook/core': 'commonjs2 @pipcook/core',
    '@tensorflow/tfjs-node': 'commonjs2 @tensorflow/tfjs-node',
    '@tensorflow/tfjs-node-gpu': 'commonjs2 @tensorflow/tfjs-node-gpu'
  },
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "[name].js",
    libraryTarget: 'umd'
  },
  mode: 'development'
};