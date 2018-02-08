// Action type consts
const REQUEST_ROUTE_CHANGE = 'taro.Router.REQUEST_ROUTE_CHANGE'
const REQUEST_BACK = 'taro.Router.REQUEST_BACK'
const ROUTE_CHANGED = 'taro.Router.ROUTE_CHANGED'

// Action creators
const requestBack = (route) => ({
  type: REQUEST_BACK,
})

const requestRouteChange = (route) => ({
  type: REQUEST_ROUTE_CHANGE,
  route: route,
})

const routeChanged = (route) => ({
  type: ROUTE_CHANGED,
  route: route,
})

export {
  REQUEST_BACK,
  REQUEST_ROUTE_CHANGE,
  ROUTE_CHANGED,
  requestBack,
  requestRouteChange,
  routeChanged,
}
