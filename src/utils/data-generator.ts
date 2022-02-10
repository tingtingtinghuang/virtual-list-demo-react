export default function dataGen (amount = 200000, startIndex = 0) {
  const data = []
  for (let i = startIndex; i < startIndex+amount; i++) {
    data.push({
      id: Math.random().toString(36).substr(2),
      index: i,
      value: i + 1,
    })
  }
  return data
}
