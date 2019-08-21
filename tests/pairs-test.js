import pairs from 'pairs'

describe('pairs', function() {

  it ('constructs a list of all unique pairs', function() {
    pairs([ 1, 2, 3 ]).should.eql([ [1,2], [1,3], [2,3]])
  })

  it ('gets the right number of items', function() {
    let items = [ 1, 2, 3, 4, 5 ]

    // http://en.wikipedia.org/wiki/Network_science#Network_properties
    let ties = (items.length * (items.length - 1)) / 2

    pairs(items).length.should.equal(ties)
  })

})
