// Action type consts
const REQUEST_ROUTE_CHANGE = 'taro.Router.REQUEST_ROUTE_CHANGE'
const ROUTE_CHANGED = 'taro.Router.ROUTE_CHANGED'

// Action creators
const requestRouteChange = (route) => ({
  type: REQUEST_ROUTE_CHANGE,
  route: route,
})

const routeChanged = (route) => ({
  type: ROUTE_CHANGED,
  route: route,
})

export {
  REQUEST_ROUTE_CHANGE,
  ROUTE_CHANGED,
  requestRouteChange,
  routeChanged,
}
