import { TICK_EVENT } from 'taro/reducers/TimeReducer'

const loggingMiddleware = (store) => (next) => {
  return (action) => {
    try {
      const result = next(action)
      if(action.type == TICK_EVENT) {
        return false
      }

      console.log(`======== ACTION: ${ action.type } ========`)
      console.log(action)
      console.log('--------------- NEXT STATE ---------------')
      console.log(store.getState())
      console.log('\n\n')
      return result
    } catch (e) {
      console.log(`======== ACTION: ${ action.type } ========`)
      console.log(action)
      console.log('!!!!!!!!!!!!!!!! EXCEPTION !!!!!!!!!!!!!!!!')
      console.log(e)
      console.log('\n\n')
      throw e
    }
    return result
  }
}

export default loggingMiddleware
