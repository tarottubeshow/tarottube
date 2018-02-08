import ApiStoreReducer from './ApiStoreReducer'
import DeviceReducer from './DeviceReducer'
import FirebaseReducer from './FirebaseReducer'
import ModelRegistryReducer from './ModelRegistryReducer'
import RouterReducer from './RouterReducer'
import TimeReducer from './TimeReducer'

const reducers = {
  ApiStore: ApiStoreReducer,
  Device: DeviceReducer,
  Firebase: FirebaseReducer,
  ModelRegistry: ModelRegistryReducer,
  Router: RouterReducer,
  Time: TimeReducer,
}

export default reducers
