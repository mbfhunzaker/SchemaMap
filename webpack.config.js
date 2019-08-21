require('node-env-file')('.env')

console.log("Compiling JavaScript using question ID of %s", process.env.QUESTION_ID)

console.log("Saving answers to %s", process.env.QUESTION_NAME)

var webpack = require('webpack')

module.exports = {
  devtool: process.env.NODE_ENV === 'production' ? null : 'sourcemap',

  entry: {
    app: './src/index.js'
  },

  output: {
    filename: '[name].js',
    path: __dirname + '/dist'
  },

  resolve: {
    extensions: [ '', '.js', '.json', '.yml', '.yaml', '.csv' ],
    modulesDirectories: [ 'web_modules', 'node_modules', 'src', 'data' ]
  },

  module: {
    loaders: [
      {
        test    : /\.js*$/,
        exclude : /node_modules/,
        loader  : 'babel',
        query   : {
          stage: 1,
          optional: ['utility.inlineEnvironmentVariables']
        }
      },
      {
        test    : /\.json$/,
        loader  : 'json'
      },
      {
        test    : /\.ya*ml$/,
        loader  : 'json!yaml'
      }
    ]
  }
}
