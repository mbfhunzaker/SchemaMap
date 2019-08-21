function within (pair, list) {
  return pair.filter(i => list.indexOf(i) > -1).length < 2
}

export default function (list, unallowed) {
  return list.filter(i => within(i, unallowed))
}
