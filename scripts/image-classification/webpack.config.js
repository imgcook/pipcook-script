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
    '@pipcook/core': 'commonjs2 @pipcook/core',
    // the backend is set by the framework initializer, the backend in the script should be replace by tfjs-core.
    '@tensorflow/tfjs': 'commonjs2 @tensorflow/tfjs',
    '@tensorflow/tfjs-core': 'commonjs2 @tensorflow/tfjs-core',
    '@tensorflow/tfjs-node': 'commonjs2 @tensorflow/tfjs',
    '@tensorflow/tfjs-node-gpu': 'commonjs2 @tensorflow/tfjs'
  },
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "[name].js",
    libraryTarget: 'umd'
  },
  mode: 'development'
};