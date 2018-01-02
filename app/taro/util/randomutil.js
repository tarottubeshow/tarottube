import seedrandom from 'seedrandom'

export function random(seed=null) {
  const rng = seededRng(seed)
  return rng()
}

export function randomInt(min, max, seed=null) {
  const val = random(seed)
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(val * (max - min + 1)) + min
}

export function randomChoice(values, seed=null) {
  if(values.length > 0) {
    const index = randomInt(0, values.length - 1, seed)
    return values[index]
  }
}

export function seededRng(seed) {
  if(seed == null) {
    return unseededRng()
  } else {
    return seedrandom(seed)
  }
}

export function unseededRng() {
  return Math.random
}
