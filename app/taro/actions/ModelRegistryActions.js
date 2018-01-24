import * as ModelRegistryReducer from 'taro/reducers/ModelRegistryReducer'
import * as typeutil from 'taro/util/typeutil'

const loadModel = (cls, target) => {
  target = ModelRegistryReducer._forceTargetToParams(target)
  const enhance = target.enhance
  const cache = (
    (enhance == null)
    &&
    typeutil.coalesce(target.cache, true)
  ) // never cache enhancements
  const id = cls.extractId(target)
  return {
    type: `__MODEL_REGISTRY__:loadModel(${ cls.key })`,
    __MODEL_REGISTRY__: {
      cls,
      target: target,
      id: id,
      cache: cache,
      enhance: enhance,
    },
  }
}

export {
  loadModel,
}
