import choices from '../data/choices'
import hash from 'string-hash'

describe('generating ids with string hashing', function() {

  it ('does not contain any duplicate ids', function() {
    var ids = choices.map(hash)

    ids.forEach(function(code) {
      ids.filter(id => id === code).length.should.equal(1)
    })
  })

  it ('produces consistent hash codes', function() {
    var existing = []

    choices.forEach(function(code) {
      var expected = hash(code)

      for (var i = 0; i < 1000; i++) {
        hash(code).should.equal(expected)
      }

      existing.indexOf(expected).should.equal(-1)
      existing.push(expected)
    })
  })

})
