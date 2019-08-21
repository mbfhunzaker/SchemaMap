var fs   = require('fs')
var hash = require('string-hash')
var yaml = require('js-yaml')

var choices = yaml.safeLoad(fs.readFileSync(__dirname + '/../data/choices.yml', 'utf8'))

console.log("id, phrase")

choices.map(function(choice) {
  return console.log('%s, %s', hash(choice), choice)
})
