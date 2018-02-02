import { Platform, Dimensions } from 'react-native'

import { APP_START } from 'taro/actions/AppLifecycle'
import { deviceChanged } from 'taro/reducers/DeviceReducer'

function _dispatchChangeEvent(dispatch) {
  const dims = Dimensions.get('window')
  dispatch(
    deviceChanged({
      implementation: 'app',
      width: dims.width,
      height: dims.height,
    })
  )
}

function _listenToDeviceChanges(dispatch) {
  const onChange = () => {
    _dispatchChangeEvent(dispatch)
  }
  Dimensions.addEventListener('change', onChange)
}

// middlewares

const deviceMiddleware = (store) => (next) => {
  _listenToDeviceChanges(store.dispatch)
  return (action) => {
    const result = next(action)
    if (action.type === APP_START) {
      _dispatchChangeEvent(store.dispatch)
    }
    return result
  }
}

export default deviceMiddleware
