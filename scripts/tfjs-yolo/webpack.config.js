const path = require('path');

module.exports = {
  target: "node",
  entry: {
    model: ["./src/model.ts"],
    dataflow: ["./src/dataflow.ts"],
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
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "[name].js",
    libraryTarget: 'umd'
  },
  mode: 'development'
};