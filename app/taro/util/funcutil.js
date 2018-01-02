export function combineReducersFuncs(defaultState, ...reducers) {
  const reducer = (state = defaultState, action = {}) => {
    for(const reducer of reducers) {
      state = reducer(state, action)
    }
    return state
  }
  return reducer
}

export const doIf = (cond, func) => {
  if(cond) {
    return func()
  }
}

export const idFunc = ((value) => (value))

export const pickFunc = (key) => {
  return (x) => (x[key])
}

export const returnFunc = ((value) => (() => (value)))

export const later = (f) => {
  setTimeout(f, 0)
}
