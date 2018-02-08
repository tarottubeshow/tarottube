const DEVICE_CHANGED = 'taro.Device.SCREEN_SIZE_CHANGED'

const deviceChanged = ({
  implementation,
  width,
  height,
  safeArea,
}) => ({
  type: DEVICE_CHANGED,
  implementation,
  width,
  height,
  safeArea,
})

// Reducers

function deviceReducer(state = {ready: false}, action = {}) {
  switch (action.type) {
    case DEVICE_CHANGED: {
      return {
        ready: true,
        implementation: action.implementation,
        width: action.width,
        height: action.height,
        safeArea: action.safeArea,
      }
    }
    default:
      return state
  }
}

// Selectors

const formFactor = state => {
  const width = state.Device.width
  if(width < 600) {
    return 'sm'
  } else if(width < 1060) {
    return 'md'
  } else if(width < 1200) {
    return 'lg'
  } else {
    return 'xl'
  }
}

export default deviceReducer
export {
  DEVICE_CHANGED,
  deviceChanged,
  formFactor,
}
