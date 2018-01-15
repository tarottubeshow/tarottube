import DeviceReducer from './DeviceReducer'
import FirebaseReducer from './FirebaseReducer'
import ModelRegistryReducer from './ModelRegistryReducer'
import RouterReducer from './RouterReducer'
import TimeReducer from './TimeReducer'

const reducers = {
  Device: DeviceReducer,
  Firebase: FirebaseReducer,
  ModelRegistry: ModelRegistryReducer,
  Router: RouterReducer,
  Time: TimeReducer,
}

export default reducers
