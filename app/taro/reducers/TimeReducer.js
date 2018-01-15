const TICK_EVENT = "taro.Tick"

const tickEvent = (time) => {
  return {
    type: TICK_EVENT,
    time: time,
  }
}

// Reducer
const START_TIME = new Date()

function timeReducer(state = START_TIME, action = {}) {
  switch (action.type) {
    case TICK_EVENT: {
      return action.time
    }
    default:
      return state
  }
}

export default timeReducer
export {
  TICK_EVENT,
  tickEvent,
}
