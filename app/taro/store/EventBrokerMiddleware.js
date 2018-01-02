// An abstract middleware that can be used to dispatch events based on other events

const eventBrokerMiddleware = (eventMapper) => (store) => (next) => {
  return (action) => {
    const result = next(action)
    const dispatch = (newAction) => {
      store.dispatch({
        ...newAction,
        __PARENT__: action,
      })
    }
    eventMapper({
      action,
      dispatch: dispatch,
      getState: store.getState,
    })
    return result
  }
}
export default eventBrokerMiddleware
