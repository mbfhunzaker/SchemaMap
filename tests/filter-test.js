import filter from 'filter'

describe('Filter', function() {

  it ('constructs a list of all unique pairs', function() {
    let pairs = [ [1,2], [1,3], [1,4], [2,3], [2,4], [3,4] ]
    let unique = [ 2, 3, 4 ]

    filter(pairs, unique).should.eql([ [1,2], [1,3], [1,4] ])
  })

})
