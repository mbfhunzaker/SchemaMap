export default function pairs ([ a, ...tail]) {
  return tail.length ? tail.map(b => [ a, b ]).concat(pairs(tail)) : []
}
