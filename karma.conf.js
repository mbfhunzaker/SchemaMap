module.exports = function(config) {
  config.set({
    browsers: [ 'Chrome' ],
    frameworks: [ 'mocha', 'sinon-chai' ],
    files: [ './tests/*.js*' ],
    reporters: [ 'nyan' ],

    preprocessors : {
      './tests/*.js*': [ 'webpack' ],
    },
    webpack: require('./webpack.config')
  })
}
