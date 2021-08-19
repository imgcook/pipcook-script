const path = require('path');

module.exports = {
  target: "node",
  entry: {
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
  externals: {
    '@pipcook/boa': 'commonjs2 @pipcook/boa'
  },
  mode: 'development'
};
