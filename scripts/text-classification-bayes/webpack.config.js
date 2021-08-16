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
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "[name].js",
    libraryTarget: 'umd'
  },
  externals: {
<<<<<<< HEAD
    '@pipocook/datacook': 'commonjs2 @pipcook/datacook'
=======
    '@pipcook/boa': 'commonjs2 @pipcook/boa',
    '@pipcook/core': 'commonjs2 @pipcook/core',
    '@pipcook/datacook': 'commonjs2 @pipcook/datacook'
>>>>>>> fe00a8e14b66b37e1895b56297fe223295f18bda
  },
  mode: 'development'
};
